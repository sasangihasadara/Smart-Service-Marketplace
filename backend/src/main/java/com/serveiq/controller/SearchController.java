package com.serveiq.controller;

import java.util.Map;

import com.serveiq.dto.SearchLogRequest;
import com.serveiq.service.SearchLogService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/searches")
public class SearchController {

    private final SearchLogService searchLogService;

    public SearchController(SearchLogService searchLogService) {
        this.searchLogService = searchLogService;
    }

    @PostMapping
    public Map<String, Object> logSearch(@Valid @RequestBody SearchLogRequest request) {
        return searchLogService.logSearch(request);
    }
}
