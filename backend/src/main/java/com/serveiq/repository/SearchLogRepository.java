package com.serveiq.repository;

import java.util.List;

import com.serveiq.entity.SearchLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SearchLogRepository extends JpaRepository<SearchLog, Long> {
    List<SearchLog> findTop5ByOrderByCreatedAtDesc();
}
