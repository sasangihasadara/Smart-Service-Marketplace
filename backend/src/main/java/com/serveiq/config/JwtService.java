package com.serveiq.config;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.serveiq.entity.AppUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private static final long TOKEN_TTL_SECONDS = 60L * 60L * 24L;
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final String secret;

    public JwtService(@Value("${app.auth.jwt.secret:serveiq-dev-secret-change-me}") String secret) {
        this.secret = secret == null ? "serveiq-dev-secret-change-me" : secret;
    }

    public String generateToken(AppUser user) {
        long now = Instant.now().getEpochSecond();
        Map<String, Object> claims = new LinkedHashMap<>();
        claims.put("sub", user.getEmail());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().name());
        claims.put("status", user.getStatus().name());
        claims.put("iat", now);
        claims.put("exp", now + TOKEN_TTL_SECONDS);

        return createSignedToken(claims);
    }

    public Optional<Map<String, Object>> validateToken(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return Optional.empty();
        }

        String header = parts[0];
        String payload = parts[1];
        String signature = parts[2];
        String signingInput = header + "." + payload;

        try {
            String expectedSignature = base64UrlEncode(sign(signingInput));
            if (!MessageDigest.isEqual(signature.getBytes(StandardCharsets.UTF_8), expectedSignature.getBytes(StandardCharsets.UTF_8))) {
                return Optional.empty();
            }

            String decodedPayload = new String(Base64.getUrlDecoder().decode(payload), StandardCharsets.UTF_8);
            Map<String, Object> claims = OBJECT_MAPPER.readValue(decodedPayload, Map.class);
            Number expiry = (Number) claims.get("exp");
            if (expiry == null || expiry.longValue() < Instant.now().getEpochSecond()) {
                return Optional.empty();
            }
            return Optional.of(claims);
        } catch (Exception exception) {
            return Optional.empty();
        }
    }

    private String createSignedToken(Map<String, Object> claims) {
        try {
            String header = base64UrlEncode("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
            String payload = base64UrlEncode(OBJECT_MAPPER.writeValueAsString(claims));
            String signingInput = header + "." + payload;
            return signingInput + "." + base64UrlEncode(sign(signingInput));
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Unable to generate JWT token.", exception);
        }
    }

    private byte[] sign(String input) {
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            mac.init(new javax.crypto.spec.SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return mac.doFinal(input.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException | InvalidKeyException exception) {
            throw new IllegalStateException("Unable to sign JWT token.", exception);
        }
    }

    private String base64UrlEncode(String value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String base64UrlEncode(byte[] value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value);
    }
}
