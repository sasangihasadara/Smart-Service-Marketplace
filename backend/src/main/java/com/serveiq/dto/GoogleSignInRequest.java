package com.serveiq.dto;

import jakarta.validation.constraints.NotBlank;

public record GoogleSignInRequest(@NotBlank String credential) {
}
