package com.makers.technical.infrastructure.adapter.in.web.auth.dto;

public record AuthResponse(
        String token,
        String role
) {}