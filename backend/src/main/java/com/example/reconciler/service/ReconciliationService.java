package com.example.reconciler.service;

import com.example.reconciler.model.ReferenceTransaction;
import com.example.reconciler.model.ReconciliationResult;
import com.example.reconciler.model.Transaction;
import com.example.reconciler.repository.ReferenceRepository;
import com.example.reconciler.repository.TransactionRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReconciliationService {

    private final TransactionRepository transactionRepository;
    private final ReferenceRepository referenceRepository;

    public ReconciliationService(TransactionRepository transactionRepository,
            ReferenceRepository referenceRepository) {
        this.transactionRepository = transactionRepository;
        this.referenceRepository = referenceRepository;
    }

    @Transactional
    public void ingestTransactionsCsv(MultipartFile file) throws Exception {
        transactionRepository.deleteAll();
        BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
        CSVParser csvParser = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(reader);
        List<Transaction> list = new ArrayList<>();
        for (CSVRecord r : csvParser) {
            String txnId = r.get("txn_id");
            String source = r.isMapped("source") ? r.get("source") : null;
            String amountStr = r.get("amount");
            String dateStr = r.get("txn_date");
            BigDecimal amount = amountStr == null || amountStr.isBlank() ? BigDecimal.ZERO : new BigDecimal(amountStr);
            LocalDate date = (dateStr == null || dateStr.isBlank()) ? null : LocalDate.parse(dateStr);
            Transaction t = new Transaction(txnId, source, amount, date);
            list.add(t);
        }
        transactionRepository.saveAll(list);

    }

    @Transactional
    public void ingestReferenceCsv(MultipartFile file) throws Exception {
        referenceRepository.deleteAll(); // in ingestReferenceCsv()
        BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
        CSVParser csvParser = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(reader);
        List<ReferenceTransaction> list = new ArrayList<>();
        for (CSVRecord r : csvParser) {
            String refTxnId = r.get("ref_txn_id");
            String source = r.isMapped("source") ? r.get("source") : null;
            String amountStr = r.get("amount");
            String dateStr = r.get("txn_date");
            BigDecimal amount = amountStr == null || amountStr.isBlank() ? BigDecimal.ZERO : new BigDecimal(amountStr);
            LocalDate date = (dateStr == null || dateStr.isBlank()) ? null : LocalDate.parse(dateStr);
            ReferenceTransaction rt = new ReferenceTransaction(refTxnId, source, amount, date);
            list.add(rt);
        }
        referenceRepository.saveAll(list);

    }

    @Transactional
    public ReconciliationResult reconcileAll() {
        List<Transaction> txns = transactionRepository.findAll();
        List<ReferenceTransaction> refs = referenceRepository.findAll();

        // Track which reference rows were matched
        Map<Long, Boolean> refMatched = new HashMap<>();

        // Output rows we will return
        List<Map<String, Object>> simpleMatches = new ArrayList<>();

        // 1) Fast lookup by reference id
        Map<String, ReferenceTransaction> refsById = refs.stream()
                .filter(r -> r.getRefTxnId() != null && !r.getRefTxnId().isBlank())
                .collect(Collectors.toMap(ReferenceTransaction::getRefTxnId, r -> r, (a, b) -> a));

        // 2) Fallback lookup by amount + date
        Multimap<String, ReferenceTransaction> refsByAmountDate = new Multimap<>();
        for (ReferenceTransaction r : refs) {
            String key = (r.getAmount() != null ? r.getAmount().toPlainString() : "NA")
                    + "|" + (r.getTxnDate() != null ? r.getTxnDate().toString() : "NA");
            refsByAmountDate.put(key, r);
        }

        int matchedCount = 0;

        for (Transaction t : txns) {
            boolean matched = false;

            // a) exact id match
            if (t.getTxnId() != null && refsById.containsKey(t.getTxnId())) {
                ReferenceTransaction r = refsById.get(t.getTxnId());

                Map<String, Object> row = new HashMap<>();
                row.put("txnId", t.getTxnId());
                row.put("txnAmount", t.getAmount());
                row.put("txnDate", t.getTxnDate());
                row.put("referenceId", r.getRefTxnId());
                row.put("referenceAmount", r.getAmount());
                row.put("rule", "txnId");
                simpleMatches.add(row);

                matched = true;
                matchedCount++;
                refMatched.put(r.getId(), true);
                continue;
            }

            // b) amount + date match
            String key = (t.getAmount() != null ? t.getAmount().toPlainString() : "NA")
                    + "|" + (t.getTxnDate() != null ? t.getTxnDate().toString() : "NA");
            List<ReferenceTransaction> maybe = refsByAmountDate.get(key);
            if (!maybe.isEmpty()) {
                ReferenceTransaction r = maybe.get(0);

                Map<String, Object> row = new HashMap<>();
                row.put("txnId", t.getTxnId());
                row.put("txnAmount", t.getAmount());
                row.put("txnDate", t.getTxnDate());
                row.put("referenceId", r.getRefTxnId());
                row.put("referenceAmount", r.getAmount());
                row.put("rule", "amount+date");
                simpleMatches.add(row);

                matched = true;
                matchedCount++;
                refMatched.put(r.getId(), true);
                refsByAmountDate.removeOne(key, r);
                continue;
            }

            // c) unmatched
            Map<String, Object> row = new HashMap<>();
            row.put("txnId", t.getTxnId());
            row.put("txnAmount", t.getAmount());
            row.put("txnDate", t.getTxnDate());
            row.put("referenceId", null);
            row.put("referenceAmount", null);
            row.put("rule", "unmatched");
            simpleMatches.add(row);
        }

        // Count unmatched references
        int unmatchedRefs = (int) refs.stream()
                .filter(r -> !refMatched.containsKey(r.getId()))
                .count();

        ReconciliationResult result = new ReconciliationResult();
        result.setTotalTransactions(txns.size());
        result.setTotalReferences(refs.size());
        result.setMatched(matchedCount);
        result.setUnmatchedTransactions(txns.size() - matchedCount);
        result.setUnmatchedReferences(unmatchedRefs);
        result.setMatches(simpleMatches);

        return result;
    }

    private static class Multimap<K, V> {
        private final Map<K, List<V>> map = new HashMap<>();

        public void put(K k, V v) {
            map.computeIfAbsent(k, kk -> new ArrayList<>()).add(v);
        }

        public List<V> get(K k) {
            return map.getOrDefault(k, Collections.emptyList());
        }

        public void removeOne(K k, V v) {
            List<V> l = map.get(k);
            if (l != null)
                l.remove(v);
        }
    }
}
