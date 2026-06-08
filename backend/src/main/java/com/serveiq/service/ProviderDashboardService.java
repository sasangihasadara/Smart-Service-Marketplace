package com.serveiq.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.serveiq.entity.AppUser;
import com.serveiq.entity.Booking;
import com.serveiq.entity.BookingStatus;
import com.serveiq.entity.NotificationChannel;
import com.serveiq.repository.AppUserRepository;
import com.serveiq.repository.BookingRepository;
import com.serveiq.repository.ProviderNotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class ProviderDashboardService {

    private final AppUserRepository appUserRepository;
    private final BookingRepository bookingRepository;
    private final ProviderNotificationRepository providerNotificationRepository;
    private final ProviderCatalogService providerCatalogService;
    private final ProviderNotificationService providerNotificationService;

    public ProviderDashboardService(
            AppUserRepository appUserRepository,
            BookingRepository bookingRepository,
            ProviderNotificationRepository providerNotificationRepository,
            ProviderCatalogService providerCatalogService,
            ProviderNotificationService providerNotificationService
    ) {
        this.appUserRepository = appUserRepository;
        this.bookingRepository = bookingRepository;
        this.providerNotificationRepository = providerNotificationRepository;
        this.providerCatalogService = providerCatalogService;
        this.providerNotificationService = providerNotificationService;
    }

    public Map<String, Object> getDashboard(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Provider email is required.");
        }

        AppUser provider = appUserRepository.findByEmailIgnoreCase(email.trim().toLowerCase(Locale.ROOT))
                .filter(user -> user.getRole() == com.serveiq.entity.UserRole.PROVIDER)
                .orElseThrow(() -> new IllegalArgumentException("Provider account not found."));

        List<Booking> bookings = bookingRepository.findByProviderNameIgnoreCase(provider.getFullName());
        List<Map<String, Object>> bookingRows = mapBookings(bookings);
        List<Map<String, Object>> notificationRows = providerNotificationService.mapNotifications(
                providerNotificationRepository.findTop10ByProviderIdOrderByCreatedAtDesc(provider.getId())
        );

        Map<String, Object> response = new HashMap<>();
        response.put("generatedAt", java.time.OffsetDateTime.now().toString());
        response.put("provider", buildProfile(provider));
        response.put("summary", List.of(
                metric("Approval Status", provider.getStatus().name().toLowerCase(Locale.ROOT), "up", approvalMessage(provider)),
                metric("Bookings", String.valueOf(bookings.size()), "up", "Requests assigned to your account"),
                metric("Completed Jobs", String.valueOf(countByStatus(bookings, BookingStatus.COMPLETED)), "up", "Successful deliveries"),
                metric("Notifications", String.valueOf(notificationRows.size()), "up", channelSummary(provider.getId()))
        ));
        response.put("bookings", bookingRows);
        response.put("notifications", notificationRows);
        response.put("stats", buildStats(bookings, provider));
        return response;
    }

    private Map<String, Object> buildProfile(AppUser provider) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", provider.getId());
        profile.put("name", provider.getFullName());
        profile.put("email", provider.getEmail());
        profile.put("phoneNumber", provider.getPhoneNumber());
        profile.put("category", provider.getServiceCategory());
        profile.put("rating", provider.getRating() == null ? "0.0" : provider.getRating().toPlainString());
        profile.put("jobs", provider.getJobsCompleted() == null ? 0 : provider.getJobsCompleted());
        profile.put("priceText", provider.getPriceText());
        profile.put("status", provider.getStatus().name().toLowerCase(Locale.ROOT));
        profile.put("yearsOfExperience", provider.getYearsOfExperience());
        profile.put("reviewedAt", provider.getReviewedAt() == null ? null : provider.getReviewedAt().toString());
        profile.put("reviewNote", provider.getReviewNote());
        profile.put("catalog", providerCatalogService.toProviderMap(provider));
        return profile;
    }

    private Map<String, Object> buildStats(List<Booking> bookings, AppUser provider) {
        long pending = countByStatus(bookings, BookingStatus.PENDING);
        long confirmed = countByStatus(bookings, BookingStatus.CONFIRMED);
        long completed = countByStatus(bookings, BookingStatus.COMPLETED);
        BigDecimal earnings = bookings.stream()
                .filter(booking -> booking.getStatus() == BookingStatus.CONFIRMED || booking.getStatus() == BookingStatus.COMPLETED)
                .map(Booking::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", bookings.size());
        stats.put("pendingBookings", pending);
        stats.put("confirmedBookings", confirmed);
        stats.put("completedBookings", completed);
        stats.put("earnings", earnings.stripTrailingZeros().toPlainString());
        stats.put("providerStatus", provider.getStatus().name().toLowerCase(Locale.ROOT));
        return stats;
    }

    private List<Map<String, Object>> mapBookings(List<Booking> bookings) {
        List<Map<String, Object>> rows = new ArrayList<>();
        for (Booking booking : bookings) {
            Map<String, Object> item = new HashMap<>();
            item.put("bookingCode", booking.getBookingCode());
            item.put("serviceRequired", booking.getServiceRequired());
            item.put("customerName", booking.getCustomerName());
            item.put("bookingDate", booking.getBookingDate() == null ? null : booking.getBookingDate().toString());
            item.put("bookingTime", booking.getBookingTime() == null ? null : booking.getBookingTime().toString());
            item.put("location", booking.getLocation());
            item.put("amount", booking.getTotalAmount() == null ? "LKR 0" : "LKR " + booking.getTotalAmount().stripTrailingZeros().toPlainString());
            item.put("status", booking.getStatus().name().toLowerCase(Locale.ROOT));
            item.put("paymentMethod", booking.getPaymentMethod() == null ? "-" : booking.getPaymentMethod());
            rows.add(item);
        }
        return rows;
    }

    private long countByStatus(List<Booking> bookings, BookingStatus status) {
        return bookings.stream().filter(booking -> booking.getStatus() == status).count();
    }

    private Map<String, Object> metric(String label, String value, String trend, String change) {
        Map<String, Object> item = new HashMap<>();
        item.put("label", label);
        item.put("value", value);
        item.put("trend", trend);
        item.put("change", change);
        return item;
    }

    private String approvalMessage(AppUser provider) {
        return switch (provider.getStatus()) {
            case ACTIVE -> "Your account is live and visible to customers.";
            case PENDING -> "Your account is waiting for admin review.";
            case REJECTED -> "Your last application was rejected. Review the note and reapply.";
            case SUSPENDED -> "Your account is temporarily suspended.";
            default -> "Account status updated.";
        };
    }

    private String channelSummary(Long providerId) {
        long emailCount = providerNotificationRepository.countByProviderIdAndChannel(providerId, NotificationChannel.EMAIL);
        long smsCount = providerNotificationRepository.countByProviderIdAndChannel(providerId, NotificationChannel.SMS);
        return emailCount + " emails and " + smsCount + " SMS messages sent";
    }
}
