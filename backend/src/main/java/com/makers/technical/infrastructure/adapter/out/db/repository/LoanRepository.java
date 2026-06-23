package com.makers.technical.infrastructure.adapter.out.db.repository;

import com.makers.technical.infrastructure.adapter.out.db.entity.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanRepository extends JpaRepository<LoanEntity, Long> {
    List<LoanEntity> findByUserEmail(String userEmail);
}