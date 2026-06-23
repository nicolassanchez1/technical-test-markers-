package com.makers.technical.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Loan {
    private Long id;
    private String userEmail;
    private BigDecimal amount;
    private LoanStatus status;
    private LocalDateTime createdAt;

    public enum LoanStatus {
        PENDING, APPROVED, REJECTED
    }

    public static Loan createRequest(String userEmail, BigDecimal amount) {
        return Loan.builder()
                .userEmail(userEmail)
                .amount(amount)
                .status(LoanStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public void approve() {
        if (this.status != LoanStatus.PENDING) {
            throw new IllegalStateException("Only outstanding loans can be approved");
        }
        this.status = LoanStatus.APPROVED;
    }

    public void reject() {
        if (this.status != LoanStatus.PENDING) {
            throw new IllegalStateException("Only outstanding loans can be rejected");
        }
        this.status = LoanStatus.REJECTED;
    }
}