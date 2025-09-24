package com.example.reconciler.repository;

import com.example.reconciler.model.ReferenceTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReferenceRepository extends JpaRepository<ReferenceTransaction, Long> {
    Optional<ReferenceTransaction> findByRefTxnId(String refTxnId);
}
