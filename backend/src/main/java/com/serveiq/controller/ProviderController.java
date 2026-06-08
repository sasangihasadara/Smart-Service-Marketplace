package com.serveiq.controller;

import java.util.List;
import java.util.Map;

import com.serveiq.service.ProviderCatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    private final ProviderCatalogService providerCatalogService;

    public ProviderController(ProviderCatalogService providerCatalogService) {
        this.providerCatalogService = providerCatalogService;
    }

    @GetMapping
    public List<Map<String, Object>> getProviders() {
        return providerCatalogService.getProviders();
    }
}
