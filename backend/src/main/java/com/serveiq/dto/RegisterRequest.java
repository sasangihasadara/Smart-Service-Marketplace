package com.serveiq.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record RegisterRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @Email @NotBlank String email,
        @NotBlank String phoneNumber,
        @NotBlank String role,
        String serviceCategory,
        @PositiveOrZero @NotNull Integer yearsOfExperience,
        @NotBlank String password
) {
}
