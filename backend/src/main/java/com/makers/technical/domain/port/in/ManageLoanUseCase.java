package com.makers.technical.domain.port.in;

import com.makers.technical.domain.model.Loan;
import java.math.BigDecimal;
import java.util.List;

public interface ManageLoanUseCase {
    Loan requestLoan(String userEmail, BigDecimal amount);
    Loan reviewLoan(Long loanId, Loan.LoanStatus status);
    List<Loan> getUserLoans(String userEmail);
    List<Loan> getAllLoans();
}