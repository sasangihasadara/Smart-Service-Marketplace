package com.serveiq.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import com.serveiq.dto.LoginRequest;
import com.serveiq.dto.RegisterRequest;
import com.serveiq.entity.AccountStatus;
import com.serveiq.entity.AppUser;
import com.serveiq.entity.UserRole;
import com.serveiq.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Map<String, Object> register(RegisterRequest request) {
        if (appUserRepository.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("Email already exists.");
        }

        AppUser user = new AppUser();
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setEmail(request.email().trim().toLowerCase(Locale.ROOT));
        user.setPhoneNumber(request.phoneNumber().trim());
        user.setRole(parseRole(request.role()));
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
