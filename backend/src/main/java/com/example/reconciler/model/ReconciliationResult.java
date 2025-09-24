package com.example.reconciler.model;

import java.util.List;
import java.util.Map;

public class ReconciliationResult {
    private int totalTransactions;
    private int totalReferences;
    private int matched;
    private int unmatchedTransactions;
    private int unmatchedReferences;
    private List<Map<String, Object>> matches;

    public ReconciliationResult() {}

    public int getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(int totalTransactions) { this.totalTransactions = totalTransactions; }
    public int getTotalReferences() { return totalReferences; }
    public void setTotalReferences(int totalReferences) { this.totalReferences = totalReferences; }
    public int getMatched() { return matched; }
    public void setMatched(int matched) { this.matched = matched; }
    public int getUnmatchedTransactions() { return unmatchedTransactions; }
    public void setUnmatchedTransactions(int unmatchedTransactions) { this.unmatchedTransactions = unmatchedTransactions; }
    public int getUnmatchedReferences() { return unmatchedReferences; }
    public void setUnmatchedReferences(int unmatchedReferences) { this.unmatchedReferences = unmatchedReferences; }
    public List<Map<String, Object>> getMatches() { return matches; }
    public void setMatches(List<Map<String, Object>> matches) { this.matches = matches; }
}
