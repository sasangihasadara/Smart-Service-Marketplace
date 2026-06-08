package com.serveiq.controller;

import java.util.Map;

import com.serveiq.dto.ProviderReviewRequest;
import com.serveiq.service.AdminDashboardService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/overview")
    public Map<String, Object> overview() {
        return adminDashboardService.overview();
    }

    @GetMapping("/users")
    public Map<String, Object> users() {
        return adminDashboardService.users();
    }

    @GetMapping("/bookings")
    public Map<String, Object> bookings() {
        return adminDashboardService.bookings();
    }

    @GetMapping("/providers")
    public Map<String, Object> providers() {
        return adminDashboardService.providers();
    }

    @GetMapping("/providers/pending")
    public Map<String, Object> pendingProviders() {
        return adminDashboardService.pendingProviders();
    }

    @PostMapping("/providers/{providerId}/approve")
    public Map<String, Object> approveProvider(
            @PathVariable Long providerId,
            @Valid @RequestBody(required = false) ProviderReviewRequest request
    ) {
        return adminDashboardService.approveProvider(providerId, request == null ? null : request.note());
    }

    @PostMapping("/providers/{providerId}/reject")
    public Map<String, Object> rejectProvider(
            @PathVariable Long providerId,
            @Valid @RequestBody(required = false) ProviderReviewRequest request
    ) {
        return adminDashboardService.rejectProvider(providerId, request == null ? null : request.note());
    }

    @GetMapping("/fraud")
    public Map<String, Object> fraud() {
        return adminDashboardService.fraud();
    }
}
