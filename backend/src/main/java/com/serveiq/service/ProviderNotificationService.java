package com.serveiq.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import com.serveiq.entity.AppUser;
import com.serveiq.entity.NotificationChannel;
import com.serveiq.entity.NotificationDeliveryStatus;
import com.serveiq.entity.ProviderNotification;
import com.serveiq.repository.ProviderNotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProviderNotificationService {

    private final ProviderNotificationRepository providerNotificationRepository;

    public ProviderNotificationService(ProviderNotificationRepository providerNotificationRepository) {
        this.providerNotificationRepository = providerNotificationRepository;
    }

    @Transactional
    public void sendProviderReviewNotification(AppUser provider, String actionLabel, String note) {
        String statusLabel = provider.getStatus().name().toLowerCase(Locale.ROOT);
        String emailSubject = switch (provider.getStatus()) {
            case ACTIVE -> "Your ServeIQ provider account has been approved";
            case REJECTED -> "Your ServeIQ provider account review result";
            default -> "Your ServeIQ provider account update";
        };

        String emailMessage = buildEmailMessage(provider, actionLabel, note, statusLabel);
        String smsMessage = buildSmsMessage(provider, actionLabel, statusLabel);

        saveNotification(provider, NotificationChannel.EMAIL, emailSubject, emailMessage);
        saveNotification(provider, NotificationChannel.SMS, emailSubject, smsMessage);
    }

    public List<Map<String, Object>> mapNotifications(List<ProviderNotification> notifications) {
        return notifications.stream()
                .map(notification -> Map.<String, Object>of(
                        "id", notification.getId(),
                        "channel", notification.getChannel().name().toLowerCase(Locale.ROOT),
                        "subject", notification.getSubject(),
                        "message", notification.getMessage(),
                        "status", notification.getStatus().name().toLowerCase(Locale.ROOT),
                        "createdAt", notification.getCreatedAt() == null ? null : notification.getCreatedAt().toString(),
                        "deliveredAt", notification.getDeliveredAt() == null ? null : notification.getDeliveredAt().toString()
                ))
                .collect(Collectors.toList());
    }

    private void saveNotification(AppUser provider, NotificationChannel channel, String subject, String message) {
        ProviderNotification notification = new ProviderNotification();
        notification.setProviderId(provider.getId());
        notification.setProviderName(provider.getFullName());
        notification.setProviderEmail(provider.getEmail());
        notification.setProviderPhone(provider.getPhoneNumber());
        notification.setChannel(channel);
        notification.setSubject(subject);
        notification.setMessage(message);
        notification.setStatus(NotificationDeliveryStatus.SENT);
        notification.setDeliveredAt(OffsetDateTime.now());
        providerNotificationRepository.save(notification);
    }

    private String buildEmailMessage(AppUser provider, String actionLabel, String note, String statusLabel) {
        String base = "Hi " + provider.getFullName() + ", your provider application has been " + actionLabel + ".";
        String context = "Your account is now " + statusLabel + ".";

        if (note == null || note.isBlank()) {
            return base + " " + context;
        }

        return base + " " + context + " Review note: " + note.trim();
    }

    private String buildSmsMessage(AppUser provider, String actionLabel, String statusLabel) {
        return "ServeIQ: " + provider.getFullName() + ", your provider application was " + actionLabel + " and is now " + statusLabel + ".";
    }
}
