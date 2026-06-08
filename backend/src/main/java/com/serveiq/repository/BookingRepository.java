package com.serveiq.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import com.serveiq.entity.Booking;
import com.serveiq.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingCode(String bookingCode);
    List<Booking> findTop5ByOrderByCreatedAtDesc();
    long countByStatus(BookingStatus status);
    long countByProviderNameIgnoreCase(String providerName);

    @Query("select coalesce(sum(b.totalAmount), 0) from Booking b where b.status <> com.serveiq.entity.BookingStatus.CANCELLED")
    BigDecimal sumNonCancelledAmount();
}
