package com.makers.technical.application.service;

import com.makers.technical.domain.model.Loan;
import com.makers.technical.domain.port.in.ManageLoanUseCase;
import com.makers.technical.domain.port.out.LoanRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanService implements ManageLoanUseCase {

    private final LoanRepositoryPort loanRepositoryPort;

    @Override
    public List<Loan> getAllLoans() {
        return loanRepositoryPort.findAll();
    }

    @Override
    @Transactional
    @CacheEvict(value = "userLoans", key = "#userEmail")
    public Loan requestLoan(String userEmail, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("The loan amount must be greater than zero");
        }
        Loan newLoan = Loan.createRequest(userEmail, amount);
        return loanRepositoryPort.save(newLoan);
    }

    @Override
    @Transactional
    @CacheEvict(value = "userLoans", allEntries = true)
    public Loan reviewLoan(Long loanId, Loan.LoanStatus status) {
        Loan loan = loanRepositoryPort.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found."));

        if (status == Loan.LoanStatus.APPROVED) {
            loan.approve();
        } else if (status == Loan.LoanStatus.REJECTED) {
            loan.reject();
        }

        return loanRepositoryPort.save(loan);
    }

    @Override
    @Cacheable(value = "userLoans", key = "#userEmail")
    public List<Loan> getUserLoans(String userEmail) {
        return loanRepositoryPort.findByUserEmail(userEmail);
    }
}