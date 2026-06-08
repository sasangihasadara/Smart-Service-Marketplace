package com.serveiq.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import com.serveiq.dto.BookingRequest;
import com.serveiq.entity.AppUser;
import com.serveiq.entity.Booking;
import com.serveiq.entity.BookingStatus;
import com.serveiq.repository.AppUserRepository;
import com.serveiq.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final AppUserRepository appUserRepository;

    public BookingService(BookingRepository bookingRepository, AppUserRepository appUserRepository) {
        this.bookingRepository = bookingRepository;
        this.appUserRepository = appUserRepository;
    }

    @Transactional
    public Map<String, Object> createBooking(BookingRequest request) {
        AppUser provider = resolveActiveProvider(request.providerName());

        Booking booking = new Booking();
        booking.setBookingCode(generateBookingCode());
        booking.setServiceRequired(request.serviceRequired().trim());
        booking.setBookingDate(request.bookingDate());
        booking.setBookingTime(request.bookingTime());
        booking.setLocation(request.location().trim());
        booking.setDescription(request.description().trim());
        booking.setCustomerName(request.customerName().trim());
        booking.setCustomerEmail(request.customerEmail().trim().toLowerCase(Locale.ROOT));
        booking.setCustomerPhone(request.customerPhone().trim());
        booking.setProviderName(provider == null ? null : provider.getFullName());
        booking.setServiceFee(normalizeAmount(request.serviceFee()));
        booking.setCallOutFee(normalizeAmount(request.callOutFee()));
        booking.setTotalAmount(normalizeAmount(request.totalAmount()));
        booking.setPaymentMethod(request.paymentMethod());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);

        return toResponse(saved, "Booking saved successfully.");
    }

    private AppUser resolveActiveProvider(String providerName) {
        if (providerName == null || providerName.isBlank()) {
            return null;
        }

        return appUserRepository.findActiveProviderByFullName(providerName.trim())
                .orElseThrow(() -> new IllegalArgumentException("Selected provider is unavailable. Please choose an active provider."));
    }

    private BigDecimal normalizeAmount(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private String generateBookingCode() {
        long suffix = System.currentTimeMillis() % 100000;
        return String.format("#BK-%05d", suffix);
    }

    private Map<String, Object> toResponse(Booking booking, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("id", booking.getId());
        response.put("bookingCode", booking.getBookingCode());
        response.put("serviceRequired", booking.getServiceRequired());
        response.put("customerName", booking.getCustomerName());
        response.put("customerEmail", booking.getCustomerEmail());
        response.put("customerPhone", booking.getCustomerPhone());
        response.put("providerName", booking.getProviderName());
        response.put("totalAmount", booking.getTotalAmount());
        response.put("status", booking.getStatus().name().toLowerCase(Locale.ROOT));
        return response;
    }
}
