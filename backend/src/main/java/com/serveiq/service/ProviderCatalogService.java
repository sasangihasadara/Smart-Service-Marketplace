package com.serveiq.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import com.serveiq.entity.AccountStatus;
import com.serveiq.entity.AppUser;
import com.serveiq.entity.BookingStatus;
import com.serveiq.entity.UserRole;
import com.serveiq.repository.AppUserRepository;
import com.serveiq.repository.BookingRepository;
import org.springframework.stereotype.Service;

@Service
public class ProviderCatalogService {

    private final AppUserRepository appUserRepository;
    private final BookingRepository bookingRepository;

    public ProviderCatalogService(AppUserRepository appUserRepository, BookingRepository bookingRepository) {
        this.appUserRepository = appUserRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<Map<String, Object>> getPublicProviders() {
        return appUserRepository.findByRoleAndStatusOrderByCreatedAtDesc(UserRole.PROVIDER, AccountStatus.ACTIVE).stream()
                .map(this::toProviderMap)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAdminProviders() {
        return sortForAdmin(appUserRepository.findByRoleOrderByCreatedAtDesc(UserRole.PROVIDER)).stream()
                .map(this::toProviderMap)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getPendingProviders() {
        return appUserRepository.findByRoleAndStatusOrderByCreatedAtDesc(UserRole.PROVIDER, AccountStatus.PENDING).stream()
                .map(this::toProviderMap)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getProviderSummary() {
        List<AppUser> providers = appUserRepository.findByRoleOrderByCreatedAtDesc(UserRole.PROVIDER);
        long activeProviders = providers.stream()
                .filter(provider -> provider.getStatus() == AccountStatus.ACTIVE)
                .count();
        long topRated = providers.stream()
                .filter(provider -> provider.getRating() != null && provider.getRating().compareTo(new BigDecimal("4.8")) >= 0)
                .count();
        long pendingProviders = providers.stream()
                .filter(provider -> provider.getStatus() == AccountStatus.PENDING)
                .count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("activeProviders", activeProviders);
        summary.put("topRated", topRated);
        summary.put("pendingProviders", pendingProviders);
        summary.put("totalProviders", providers.size());
        return summary;
    }

    public AppUser getProviderOrThrow(Long providerId) {
        return appUserRepository.findByIdAndRole(providerId, UserRole.PROVIDER)
                .orElseThrow(() -> new IllegalArgumentException("Provider not found."));
    }

    public Map<String, Object> toProviderMap(AppUser provider) {
        long totalJobs = bookingRepository.countByProviderNameIgnoreCase(provider.getFullName());
        long completedJobs = bookingRepository.findByProviderNameIgnoreCase(provider.getFullName()).stream()
                .filter(booking -> booking.getStatus() == BookingStatus.COMPLETED)
                .count();
        String completionRate = totalJobs == 0 ? "100%" : Math.round((completedJobs * 100.0) / totalJobs) + "%";

        Map<String, Object> result = new HashMap<>();
        result.put("id", provider.getId());
        result.put("name", provider.getFullName());
        result.put("category", provider.getServiceCategory());
        result.put("rating", provider.getRating() == null ? "0.0" : provider.getRating().toPlainString());
        result.put("jobs", provider.getJobsCompleted() == null ? totalJobs : provider.getJobsCompleted());
        result.put("completionRate", completionRate);
        result.put("price", provider.getPriceText() == null ? "LKR 2,500/hr" : provider.getPriceText());
        result.put("status", provider.getStatus() == null ? "pending" : provider.getStatus().name().toLowerCase(Locale.ROOT));
        result.put("reviewedAt", provider.getReviewedAt() == null ? null : provider.getReviewedAt().toString());
        result.put("reviewNote", provider.getReviewNote());
        return result;
    }

    private List<AppUser> sortForAdmin(List<AppUser> providers) {
        Comparator<AppUser> comparator = Comparator
                .comparingInt(this::statusPriority)
                .thenComparing(AppUser::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(AppUser::getId, Comparator.nullsLast(Comparator.reverseOrder()));

        return providers.stream()
                .sorted(comparator)
                .toList();
    }

    private int statusPriority(AppUser provider) {
        if (provider.getStatus() == AccountStatus.PENDING) {
            return 0;
        }

        if (provider.getStatus() == AccountStatus.ACTIVE) {
            return 1;
        }

        if (provider.getStatus() == AccountStatus.REJECTED) {
            return 2;
        }

        return 3;
    }
}
