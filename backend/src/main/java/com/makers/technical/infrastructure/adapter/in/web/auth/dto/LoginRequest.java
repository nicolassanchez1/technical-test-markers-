package com.makers.technical.infrastructure.adapter.in.web.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "The email field cannot be left blank")
        @Email(message = "The email format is invalid")
        String email,

        @NotBlank(message = "The password cannot be left blank")
        String password
) {}