package com.example.reconciler.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "reference_transactions")
public class ReferenceTransaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ref_txn_id")
    private String refTxnId;

    @Column(name = "source")
    private String source;

    @Column(name = "amount", precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(name = "txn_date")
    private LocalDate txnDate;

    public ReferenceTransaction() {}

    public ReferenceTransaction(String refTxnId, String source, BigDecimal amount, LocalDate txnDate) {
        this.refTxnId = refTxnId;
        this.source = source;
        this.amount = amount;
        this.txnDate = txnDate;
    }

    public Long getId() { return id; }
    public String getRefTxnId() { return refTxnId; }
    public void setRefTxnId(String refTxnId) { this.refTxnId = refTxnId; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDate getTxnDate() { return txnDate; }
    public void setTxnDate(LocalDate txnDate) { this.txnDate = txnDate; }
}
