package com.serveiq.repository;

import java.util.List;

import com.serveiq.entity.NotificationChannel;
import com.serveiq.entity.ProviderNotification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderNotificationRepository extends JpaRepository<ProviderNotification, Long> {
    List<ProviderNotification> findTop10ByProviderIdOrderByCreatedAtDesc(Long providerId);
    long countByProviderId(Long providerId);
    long countByProviderIdAndChannel(Long providerId, NotificationChannel channel);
}
