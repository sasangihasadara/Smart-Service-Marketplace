package com.serveiq.dto;

import jakarta.validation.constraints.NotBlank;

public record SearchLogRequest(
        @NotBlank String query,
        @NotBlank String location
) {
}
