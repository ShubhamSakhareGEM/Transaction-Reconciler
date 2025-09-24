package com.example.reconciler.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "txn_id")
    private String txnId;

    @Column(name = "source")
    private String source;

    @Column(name = "amount", precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(name = "txn_date")
    private LocalDate txnDate;

    @Column(name = "notes")
    private String notes;

    public Transaction() {}

    public Transaction(String txnId, String source, BigDecimal amount, LocalDate txnDate) {
        this.txnId = txnId;
        this.source = source;
        this.amount = amount;
        this.txnDate = txnDate;
    }

    public Long getId() { return id; }
    public String getTxnId() { return txnId; }
    public void setTxnId(String txnId) { this.txnId = txnId; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDate getTxnDate() { return txnDate; }
    public void setTxnDate(LocalDate txnDate) { this.txnDate = txnDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
