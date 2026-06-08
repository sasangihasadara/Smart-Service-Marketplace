package com.serveiq.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import com.serveiq.dto.PaymentRequest;
import com.serveiq.entity.Booking;
import com.serveiq.entity.BookingStatus;
import com.serveiq.entity.Payment;
import com.serveiq.entity.PaymentStatus;
import com.serveiq.repository.BookingRepository;
import com.serveiq.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public Map<String, Object> createPayment(PaymentRequest request) {
        Booking booking = bookingRepository.findByBookingCode(request.bookingCode())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));

        Payment payment = new Payment();
        payment.setPaymentReference(generatePaymentReference());
        payment.setBookingCode(booking.getBookingCode());
        payment.setPayerName(request.payerName().trim());
        payment.setPayerEmail(request.payerEmail().trim().toLowerCase(Locale.ROOT));
        payment.setMethod(request.method().trim());
        payment.setAmount(normalizeAmount(request.amount()));
        payment.setStatus(PaymentStatus.PAID);

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentMethod(request.method().trim());
        bookingRepository.save(booking);

        Payment saved = paymentRepository.save(payment);
        return toResponse(saved, booking, "Payment recorded successfully.");
    }

    private BigDecimal normalizeAmount(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private String generatePaymentReference() {
        long suffix = System.currentTimeMillis() % 1000000;
        return String.format("PAY-%06d", suffix);
    }

    private Map<String, Object> toResponse(Payment payment, Booking booking, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("paymentReference", payment.getPaymentReference());
        response.put("bookingCode", booking.getBookingCode());
        response.put("amount", payment.getAmount());
        response.put("status", payment.getStatus().name().toLowerCase(Locale.ROOT));
        return response;
    }
}
