package com.example.reconciler.controller;

import com.example.reconciler.model.ReconciliationResult;
import com.example.reconciler.service.ReconciliationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class ReconciliationController {

    private final ReconciliationService service;

    public ReconciliationController(ReconciliationService service) {
        this.service = service;
        }

    @PostMapping(value = "/upload/transactions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadTransactions(@RequestParam("file") MultipartFile file) {
        try {
            service.ingestTransactionsCsv(file);
            return ResponseEntity.ok("transactions uploaded");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("error: " + e.getMessage());
        }
    }

    @PostMapping(value = "/upload/reference", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadReference(@RequestParam("file") MultipartFile file) {
        try {
            service.ingestReferenceCsv(file);
            return ResponseEntity.ok("reference uploaded");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("error: " + e.getMessage());
        }
    }

    @GetMapping("/reconcile")
    public ResponseEntity<ReconciliationResult> reconcile() {
        ReconciliationResult res = service.reconcileAll();
        return ResponseEntity.ok(res);
    }
}
