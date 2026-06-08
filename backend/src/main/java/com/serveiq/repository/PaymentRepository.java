package com.serveiq.repository;

import java.math.BigDecimal;
import java.util.List;

import com.serveiq.entity.Payment;
import com.serveiq.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findTop5ByOrderByCreatedAtDesc();
    long countByStatus(PaymentStatus status);

    @Query("select coalesce(sum(p.amount), 0) from Payment p where p.status = com.serveiq.entity.PaymentStatus.PAID")
    BigDecimal sumPaidAmount();
}
