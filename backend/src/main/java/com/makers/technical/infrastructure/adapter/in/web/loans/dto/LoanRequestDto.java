package com.makers.technical.infrastructure.adapter.in.web.loans.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record LoanRequestDto(
        @NotNull(message = "The amount is mandatory")
        @Positive(message = "The amount must be greater than zero")
        BigDecimal amount
) {}