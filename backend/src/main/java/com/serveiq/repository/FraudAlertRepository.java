package com.serveiq.repository;

import java.util.List;

import com.serveiq.entity.FraudAlert;
import com.serveiq.entity.FraudSeverity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FraudAlertRepository extends JpaRepository<FraudAlert, Long> {
    List<FraudAlert> findTop5ByOrderByCreatedAtDesc();
    long countBySeverity(FraudSeverity severity);
}
