package com.makers.technical.domain.port.out;

import com.makers.technical.domain.model.Loan;
import java.util.List;
import java.util.Optional;

public interface LoanRepositoryPort {
    Loan save(Loan loan);
    Optional<Loan> findById(Long id);
    List<Loan> findByUserEmail(String userEmail);
}