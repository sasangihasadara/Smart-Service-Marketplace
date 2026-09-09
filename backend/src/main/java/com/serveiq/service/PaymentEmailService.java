package com.serveiq.service;

import com.serveiq.entity.Payment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(prefix = "app.mail", name = "enabled", havingValue = "true")
public class PaymentEmailService {

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public PaymentEmailService(JavaMailSender mailSender, @Value("${app.mail.from}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendReceipt(Payment payment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(payment.getPayerEmail());
        message.setSubject("ServeIQ payment confirmed - " + payment.getPaymentReference());
        message.setText(String.format(
                "Hi %s,%n%nYour ServeIQ payment was confirmed.%n%nPayment reference: %s%nBooking: %s%nAmount: LKR %s%nMethod: %s%n%nKeep this email for your records.%n%nServeIQ",
                payment.getPayerName(),
                payment.getPaymentReference(),
                payment.getBookingCode(),
                payment.getAmount().stripTrailingZeros().toPlainString(),
                payment.getMethod()
        ));
        mailSender.send(message);
    }
}