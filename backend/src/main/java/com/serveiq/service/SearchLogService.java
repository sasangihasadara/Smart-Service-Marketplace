package com.serveiq.service;

import java.util.HashMap;
import java.util.Map;

import com.serveiq.dto.SearchLogRequest;
import com.serveiq.entity.SearchLog;
import com.serveiq.repository.SearchLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SearchLogService {

    private final SearchLogRepository searchLogRepository;

    public SearchLogService(SearchLogRepository searchLogRepository) {
        this.searchLogRepository = searchLogRepository;
    }

    @Transactional
    public Map<String, Object> logSearch(SearchLogRequest request) {
        SearchLog searchLog = new SearchLog();
        searchLog.setQueryText(request.query().trim());
        searchLog.setLocationText(request.location().trim());

        SearchLog saved = searchLogRepository.save(searchLog);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Search saved successfully.");
        response.put("id", saved.getId());
        response.put("query", saved.getQueryText());
        response.put("location", saved.getLocationText());
        return response;
    }
}
