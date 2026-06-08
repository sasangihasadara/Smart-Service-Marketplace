package com.serveiq.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record BookingRequest(
        @NotBlank String serviceRequired,
        @NotNull LocalDate bookingDate,
        @NotNull LocalTime bookingTime,
        @NotBlank String location,
        @NotBlank String description,
        @NotBlank String customerName,
        @Email @NotBlank String customerEmail,
        @NotBlank String customerPhone,
        String providerName,
        @NotNull @PositiveOrZero BigDecimal serviceFee,
        @NotNull @PositiveOrZero BigDecimal callOutFee,
        @NotNull @PositiveOrZero BigDecimal totalAmount,
        String paymentMethod
) {
}
