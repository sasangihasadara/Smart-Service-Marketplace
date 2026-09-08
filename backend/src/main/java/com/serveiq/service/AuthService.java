package com.serveiq.service;

import java.math.BigDecimal;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.serveiq.dto.GoogleSignInRequest;
import com.serveiq.dto.LoginRequest;
import com.serveiq.dto.InternalAdminCreateRequest;
import com.serveiq.dto.RegisterRequest;
import com.serveiq.entity.AccountStatus;
import com.serveiq.entity.AppUser;
import com.serveiq.entity.UserRole;
import com.serveiq.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final String googleClientId;

    public AuthService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.auth.google.client-id:}") String googleClientId
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.googleClientId = googleClientId == null ? "" : googleClientId.trim();
    }

    @Transactional
    public Map<String, Object> register(RegisterRequest request) {
        if (appUserRepository.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("Email already exists.");
        }

        UserRole role = parseRegisterRole(request.role());

        AppUser user = new AppUser();
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setEmail(request.email().trim().toLowerCase(Locale.ROOT));
        user.setPhoneNumber(request.phoneNumber().trim());
        user.setRole(role);
        user.setServiceCategory(request.serviceCategory() == null || request.serviceCategory().isBlank()
                ? defaultCategoryFor(user.getRole())
                : request.serviceCategory().trim());
        user.setYearsOfExperience(request.yearsOfExperience());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setStatus(user.getRole() == UserRole.PROVIDER ? AccountStatus.PENDING : AccountStatus.ACTIVE);

        if (user.getRole() == UserRole.PROVIDER) {
            user.setPriceText(defaultPriceFor(user.getServiceCategory()));
            user.setRating(new BigDecimal("4.8"));
            user.setJobsCompleted(0);
        }

        AppUser saved = appUserRepository.save(user);
        return toResponse(saved, "Account created successfully.");
    }

    @Transactional
    public Map<String, Object> createInternalAdmin(InternalAdminCreateRequest request) {
        if (appUserRepository.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("Email already exists.");
        }

        AppUser user = new AppUser();
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setEmail(request.email().trim().toLowerCase(Locale.ROOT));
        user.setPhoneNumber(request.phoneNumber().trim());
        user.setRole(UserRole.ADMIN);
        user.setServiceCategory("Platform");
        user.setYearsOfExperience(0);
        user.setPriceText("LKR 0");
        user.setRating(new BigDecimal("5.0"));
        user.setJobsCompleted(0);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setStatus(AccountStatus.ACTIVE);

        AppUser saved = appUserRepository.save(user);
        return toResponse(saved, "Admin account created successfully.");
    }

    @Transactional(readOnly = true)
    public Map<String, Object> login(LoginRequest request) {
        AppUser user = appUserRepository.findByEmailIgnoreCase(request.email().trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new IllegalArgumentException("No account found for that email."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid password.");
        }

        if (request.role() != null && !request.role().isBlank()) {
            UserRole requestedRole = parseRole(request.role());
            if (requestedRole != user.getRole()) {
                throw new IllegalArgumentException("This account is not registered as " + request.role() + ".");
            }
        }

        return toResponse(user, "Login successful.");
    }

    @Transactional
    public Map<String, Object> googleSignIn(GoogleSignInRequest request) {
        if (googleClientId.isBlank()) {
            throw new IllegalStateException("Google sign-in is not configured on the server.");
        }

        GoogleIdToken.Payload payload = verifyGoogleCredential(request.credential());
        String email = payload.getEmail();
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Google did not provide an email address for this account.");
        }

        if (!isEmailVerified(payload)) {
            throw new IllegalArgumentException("Please use a Google account with a verified email address.");
        }

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        AppUser existingUser = appUserRepository.findByEmailIgnoreCase(normalizedEmail).orElse(null);
        if (existingUser != null) {
            return toResponse(existingUser, "Signed in with Google.");
        }

        AppUser user = new AppUser();
        user.setFirstName(firstNameFrom(payload));
        user.setLastName(lastNameFrom(payload));
        user.setEmail(normalizedEmail);
        user.setPhoneNumber("Not provided");
        user.setRole(UserRole.CUSTOMER);
        user.setServiceCategory("Customer");
        user.setYearsOfExperience(0);
        user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setStatus(AccountStatus.ACTIVE);

        AppUser saved = appUserRepository.save(user);
        return toResponse(saved, "Your ServeIQ customer account was created with Google.");
    }

    private GoogleIdToken.Payload verifyGoogleCredential(String credential) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken token = verifier.verify(credential);
            if (token == null) {
                throw new IllegalArgumentException("Google could not verify this sign-in token.");
            }

            return token.getPayload();
        } catch (GeneralSecurityException | IOException exception) {
            throw new IllegalArgumentException("Google sign-in could not be verified. Please try again.");
        }
    }

    private boolean isEmailVerified(GoogleIdToken.Payload payload) {
        Object value = payload.get("email_verified");
        return Boolean.TRUE.equals(value) || "true".equalsIgnoreCase(String.valueOf(value));
    }

    private String firstNameFrom(GoogleIdToken.Payload payload) {
        String givenName = String.valueOf(payload.get("given_name") == null ? "" : payload.get("given_name")).trim();
        if (!givenName.isBlank()) {
            return givenName;
        }

        String[] nameParts = fullNameFrom(payload).split("\\s+", 2);
        return nameParts.length > 0 && !nameParts[0].isBlank() ? nameParts[0] : "Google";
    }

    private String lastNameFrom(GoogleIdToken.Payload payload) {
        String familyName = String.valueOf(payload.get("family_name") == null ? "" : payload.get("family_name")).trim();
        if (!familyName.isBlank()) {
            return familyName;
        }

        String[] nameParts = fullNameFrom(payload).split("\\s+", 2);
        return nameParts.length > 1 && !nameParts[1].isBlank() ? nameParts[1] : "User";
    }

    private String fullNameFrom(GoogleIdToken.Payload payload) {
        Object name = payload.get("name");
        return name == null ? "" : String.valueOf(name).trim();
    }

    private Map<String, Object> toResponse(AppUser user, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("userId", user.getId());
        response.put("fullName", user.getFullName());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name().toLowerCase(Locale.ROOT));
        response.put("status", user.getStatus().name().toLowerCase(Locale.ROOT));
        response.put("serviceCategory", user.getServiceCategory());
        response.put("priceText", user.getPriceText());
        return response;
    }

    private UserRole parseRole(String value) {
        if (value == null || value.isBlank()) {
            return UserRole.CUSTOMER;
        }

        return switch (value.trim().toLowerCase(Locale.ROOT)) {
            case "provider" -> UserRole.PROVIDER;
            case "admin" -> UserRole.ADMIN;
            default -> UserRole.CUSTOMER;
        };
    }

    private UserRole parseRegisterRole(String value) {
        UserRole role = parseRole(value);
        if (role == UserRole.ADMIN) {
            throw new IllegalArgumentException("Admin accounts cannot be created from the public registration form.");
        }
        return role;
    }

    private String defaultCategoryFor(UserRole role) {
        return role == UserRole.PROVIDER ? "General Service" : "Customer";
    }

    private String defaultPriceFor(String category) {
        return switch (category.toLowerCase(Locale.ROOT)) {
            case "electrician", "electricians" -> "LKR 2,500/hr";
            case "plumber", "plumbers" -> "LKR 3,000/hr";
            case "ac technician", "ac technicians" -> "LKR 2,200/hr";
            case "tutor", "tutors" -> "LKR 2,000/hr";
            case "cleaner", "cleaners" -> "LKR 1,800/hr";
            case "photographer", "photographers" -> "LKR 8,500/session";
            case "carpenter", "carpenters" -> "LKR 3,400/hr";
            default -> "LKR 2,500/hr";
        };
    }
}
