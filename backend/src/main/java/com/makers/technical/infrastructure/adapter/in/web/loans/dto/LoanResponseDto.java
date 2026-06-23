package com.makers.technical.infrastructure.adapter.in.web.loans.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record LoanResponseDto(
        Long id,
        String userEmail,
        BigDecimal amount,
        String status,
        LocalDateTime createdAt
) {}