package com.makers.technical.infrastructure.adapter.in.web.loans.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record LoanReviewDto(
        @NotBlank(message = "This field is required")
        @Pattern(regexp = "APPROVED|REJECTED", message = "The status must be APPROVED or REJECTED")
        String status
) {}