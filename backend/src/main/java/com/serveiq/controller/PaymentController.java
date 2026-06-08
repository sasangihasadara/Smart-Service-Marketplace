package com.serveiq.controller;

import java.util.Map;

import com.serveiq.dto.PaymentRequest;
import com.serveiq.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public Map<String, Object> createPayment(@Valid @RequestBody PaymentRequest request) {
        return paymentService.createPayment(request);
    }
}
