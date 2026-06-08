package com.serveiq.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record PaymentRequest(
        @NotBlank String bookingCode,
        @NotBlank String payerName,
        @Email @NotBlank String payerEmail,
        @NotBlank String method,
        @NotNull @PositiveOrZero BigDecimal amount
) {
}
