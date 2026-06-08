package com.serveiq.service;

import java.math.BigDecimal;
import java.time.Month;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.serveiq.entity.AccountStatus;
import com.serveiq.entity.AppUser;
import com.serveiq.entity.Booking;
import com.serveiq.entity.BookingStatus;
import com.serveiq.entity.FraudAlert;
import com.serveiq.entity.FraudSeverity;
import com.serveiq.entity.Payment;
import com.serveiq.entity.UserRole;
import com.serveiq.repository.AppUserRepository;
import com.serveiq.repository.BookingRepository;
import com.serveiq.repository.FraudAlertRepository;
import com.serveiq.repository.PaymentRepository;
import com.serveiq.repository.SearchLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminDashboardService {

    private final AppUserRepository appUserRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final FraudAlertRepository fraudAlertRepository;
    private final SearchLogRepository searchLogRepository;
    private final ProviderCatalogService providerCatalogService;
    private final ProviderNotificationService providerNotificationService;

    public AdminDashboardService(
            AppUserRepository appUserRepository,
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository,
            FraudAlertRepository fraudAlertRepository,
            SearchLogRepository searchLogRepository,
            ProviderCatalogService providerCatalogService,
            ProviderNotificationService providerNotificationService
    ) {
        this.appUserRepository = appUserRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.fraudAlertRepository = fraudAlertRepository;
        this.searchLogRepository = searchLogRepository;
        this.providerCatalogService = providerCatalogService;
        this.providerNotificationService = providerNotificationService;
    }

    public Map<String, Object> overview() {
        Map<String, Object> response = new HashMap<>();
        response.put("generatedAt", OffsetDateTime.now().toString());
        response.put("metrics", List.of(
                metric("Total Revenue", formatMoney(paymentRepository.sumPaidAmount()), "up", "Payments recorded in MySQL"),
                metric("Bookings", String.valueOf(bookingRepository.count()), "up", recentBookingChange()),
                metric("Active Users", String.valueOf(appUserRepository.countByRoleAndStatus(UserRole.CUSTOMER, AccountStatus.ACTIVE)
                        + appUserRepository.countByRoleAndStatus(UserRole.PROVIDER, AccountStatus.ACTIVE)), "up", "Synced from user table"),
                metric("Fraud Blocked", String.valueOf(fraudAlertRepository.countBySeverity(FraudSeverity.HIGH)), "down", "High severity alerts")
        ));
        response.put("chart", buildMonthlyChart());
        response.put("recentBookings", mapBookings(bookingRepository.findTop5ByOrderByCreatedAtDesc()));
        response.put("activity", List.of(
                bookingRepository.count() + " bookings saved in MySQL",
                searchLogRepository.count() + " search logs tracked",
                fraudAlertRepository.count() + " fraud alerts available"
        ));
        return response;
    }

    public Map<String, Object> users() {
        Map<String, Object> response = new HashMap<>();
        response.put("generatedAt", OffsetDateTime.now().toString());
        response.put("summary", List.of(
                metric("Registered Users", String.valueOf(appUserRepository.count()), "up", "All accounts in MySQL"),
                metric("Verified Customers", String.valueOf(appUserRepository.countByRoleAndStatus(UserRole.CUSTOMER, AccountStatus.ACTIVE)), "up", "Active customer accounts"),
                metric("Admin Actions", String.valueOf(searchLogRepository.count() + fraudAlertRepository.count()), "up", "System activity tracked")
        ));
        response.put("users", mapUsers(appUserRepository.findTop5ByOrderByCreatedAtDesc()));
        return response;
    }

    public Map<String, Object> bookings() {
        Map<String, Object> response = new HashMap<>();
        response.put("generatedAt", OffsetDateTime.now().toString());
        response.put("summary", List.of(
                metric("Open Bookings", String.valueOf(bookingRepository.countByStatus(BookingStatus.PENDING)), "up", "Awaiting confirmation"),
                metric("Completed", String.valueOf(bookingRepository.countByStatus(BookingStatus.COMPLETED)), "up", "Closed in MySQL"),
                metric("Cancelled", String.valueOf(bookingRepository.countByStatus(BookingStatus.CANCELLED)), "down", "Cancelled requests")
        ));
        response.put("bookings", mapBookingDetails(bookingRepository.findTop5ByOrderByCreatedAtDesc()));
        return response;
    }

    public Map<String, Object> providers() {
        Map<String, Object> response = new HashMap<>();
        response.put("generatedAt", OffsetDateTime.now().toString());
        Map<String, Object> summary = providerCatalogService.getProviderSummary();
        response.put("summary", List.of(
                metric("Active Providers", String.valueOf(summary.get("activeProviders")), "up", "Synced from provider table"),
                metric("Top Rated", String.valueOf(summary.get("topRated")), "up", "Ratings above 4.8"),
                metric("Onboarding Queue", String.valueOf(summary.get("pendingProviders")), "down", "Pending providers")
        ));
        response.put("providers", providerCatalogService.getAdminProviders());
        return response;
    }

    public Map<String, Object> pendingProviders() {
        Map<String, Object> response = new HashMap<>();
        response.put("generatedAt", OffsetDateTime.now().toString());
        Map<String, Object> summary = providerCatalogService.getProviderSummary();
        response.put("summary", List.of(
                metric("Pending Requests", String.valueOf(summary.get("pendingProviders")), "down", "Awaiting admin review"),
                metric("Active Providers", String.valueOf(summary.get("activeProviders")), "up", "Already approved"),
                metric("Top Rated", String.valueOf(summary.get("topRated")), "up", "Ratings above 4.8")
        ));
        response.put("providers", providerCatalogService.getPendingProviders());
        return response;
    }

    public Map<String, Object> approveProvider(Long providerId, String note) {
        return reviewProvider(providerId, note, AccountStatus.ACTIVE, "approved");
    }

    public Map<String, Object> rejectProvider(Long providerId, String note) {
        return reviewProvider(providerId, note, AccountStatus.REJECTED, "rejected");
    }

    public Map<String, Object> fraud() {
        Map<String, Object> response = new HashMap<>();
        response.put("generatedAt", OffsetDateTime.now().toString());
        response.put("summary", List.of(
                metric("Blocked Today", String.valueOf(fraudAlertRepository.countBySeverity(FraudSeverity.HIGH)), "up", "High severity alerts"),
                metric("Review Accuracy", "98.2%", "up", "Demo scoring"),
                metric("Manual Cases", String.valueOf(fraudAlertRepository.countBySeverity(FraudSeverity.MEDIUM)), "down", "Medium severity alerts")
        ));
        response.put("alerts", mapFraudAlerts(fraudAlertRepository.findTop5ByOrderByCreatedAtDesc()));
        return response;
    }

    private Map<String, Object> buildMonthlyChart() {
        List<String> labels = List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        Map<String, Integer> monthlyCounts = new LinkedHashMap<>();
        labels.forEach(label -> monthlyCounts.put(label, 0));

        bookingRepository.findAll().forEach(booking -> {
            if (booking.getCreatedAt() != null) {
                Month month = booking.getCreatedAt().getMonth();
                String monthLabel = labels.get(month.getValue() - 1);
                monthlyCounts.put(monthLabel, monthlyCounts.get(monthLabel) + 1);
            }
        });

        Map<String, Object> chart = new HashMap<>();
        chart.put("labels", labels);
        chart.put("values", new ArrayList<>(monthlyCounts.values()));
        chart.put("series", "Monthly bookings");
        return chart;
    }

    private List<Map<String, Object>> mapUsers(List<AppUser> users) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (AppUser user : users) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", "USR-" + user.getId());
            item.put("name", user.getFullName());
            item.put("role", user.getRole().name().substring(0, 1) + user.getRole().name().substring(1).toLowerCase(Locale.ROOT));
            item.put("location", user.getServiceCategory() == null ? "Colombo" : user.getServiceCategory());
            item.put("status", user.getStatus().name().substring(0, 1) + user.getStatus().name().substring(1).toLowerCase(Locale.ROOT));
            item.put("tier", user.getRole() == UserRole.PROVIDER ? "Provider" : "Customer");
            result.add(item);
        }
        return result;
    }

    private List<Map<String, Object>> mapBookings(List<Booking> bookings) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Booking booking : bookings) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", booking.getBookingCode());
            item.put("customer", booking.getCustomerName());
            item.put("service", booking.getServiceRequired());
            item.put("provider", booking.getProviderName() == null ? "-" : booking.getProviderName());
            item.put("amount", formatMoney(booking.getTotalAmount()));
            item.put("status", booking.getStatus().name().substring(0, 1) + booking.getStatus().name().substring(1).toLowerCase(Locale.ROOT));
            item.put("paymentMethod", booking.getPaymentMethod() == null ? "-" : booking.getPaymentMethod());
            item.put("slot", booking.getBookingDate() + " " + booking.getBookingTime());
            result.add(item);
        }
        return result;
    }

    private List<Map<String, Object>> mapBookingDetails(List<Booking> bookings) {
        return mapBookings(bookings);
    }

    private List<Map<String, Object>> mapFraudAlerts(List<FraudAlert> alerts) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (FraudAlert alert : alerts) {
            Map<String, Object> item = new HashMap<>();
            item.put("severity", alert.getSeverity().name().substring(0, 1) + alert.getSeverity().name().substring(1).toLowerCase(Locale.ROOT));
            item.put("title", alert.getTitle());
            item.put("description", alert.getDescription());
            item.put("score", alert.getScore());
            result.add(item);
        }
        return result;
    }

    private Map<String, Object> metric(String label, String value, String trend, String change) {
        Map<String, Object> item = new HashMap<>();
        item.put("label", label);
        item.put("value", value);
        item.put("trend", trend);
        item.put("change", change);
        return item;
    }

    private String formatMoney(BigDecimal amount) {
        if (amount == null) {
            return "LKR 0";
        }

        return "LKR " + amount.stripTrailingZeros().toPlainString();
    }

    private String recentBookingChange() {
        long total = bookingRepository.count();
        if (total == 0) {
            return "No bookings yet";
        }
        return "Latest records synced from bookings table";
    }

    private Map<String, Object> reviewProvider(Long providerId, String note, AccountStatus targetStatus, String actionLabel) {
        AppUser provider = providerCatalogService.getProviderOrThrow(providerId);
        if (provider.getStatus() != AccountStatus.PENDING) {
            throw new IllegalArgumentException("Only pending provider requests can be reviewed.");
        }

        provider.setStatus(targetStatus);
        provider.setReviewedAt(OffsetDateTime.now());
        provider.setReviewNote(normalizeReviewNote(note, actionLabel));

        AppUser saved = appUserRepository.save(provider);
        providerNotificationService.sendProviderReviewNotification(saved, actionLabel, note);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Provider " + actionLabel + " successfully.");
        response.put("provider", providerCatalogService.toProviderMap(saved));
        response.put("summary", providerCatalogService.getProviderSummary());
        return response;
    }

    private String normalizeReviewNote(String note, String actionLabel) {
        if (note == null || note.isBlank()) {
            return "Provider " + actionLabel + " after manual review.";
        }

        return note.trim();
    }
}
