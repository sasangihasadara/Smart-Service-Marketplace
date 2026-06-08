package com.serveiq.controller;

import java.util.List;
import java.util.Map;

import com.serveiq.service.ProviderDashboardService;
import com.serveiq.service.ProviderCatalogService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    private final ProviderCatalogService providerCatalogService;
    private final ProviderDashboardService providerDashboardService;

    public ProviderController(ProviderCatalogService providerCatalogService, ProviderDashboardService providerDashboardService) {
        this.providerCatalogService = providerCatalogService;
        this.providerDashboardService = providerDashboardService;
    }

    @GetMapping
    public List<Map<String, Object>> getProviders() {
        return providerCatalogService.getPublicProviders();
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(@RequestParam String email) {
        return providerDashboardService.getDashboard(email);
    }
}
