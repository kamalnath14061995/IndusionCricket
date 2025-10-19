package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.PaymentResponseDTO;
import com.cricketacademy.api.service.EmailService;
import com.cricketacademy.api.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class PaymentController {

    private final PaymentService paymentService;
    private final EmailService emailService;

    @PostMapping("/create-order")
    public ResponseEntity<PaymentResponseDTO> createPaymentOrder(@RequestBody Map<String, Object> paymentRequest) {
        try {
            PaymentResponseDTO response = paymentService.createPaymentOrder(paymentRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Invalid payment request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error creating payment order: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/process")
    public ResponseEntity<PaymentResponseDTO> processPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            PaymentResponseDTO response = paymentService.processPayment(paymentData);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Invalid payment data: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error processing payment: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/verify/{gateway}")
    public ResponseEntity<PaymentResponseDTO> verifyPayment(
            @PathVariable String gateway,
            @RequestBody Map<String, Object> verificationRequest) {
        try {
            PaymentResponseDTO response = paymentService.verifyPayment(gateway, verificationRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Invalid verification request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error verifying payment: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/methods")
    public ResponseEntity<?> getAvailablePaymentMethods() {
        try {
            return ResponseEntity.ok(paymentService.getPaymentMethodsList());
        } catch (Exception e) {
            log.error("Error fetching payment methods: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/allowed/{userId}")
    public ResponseEntity<?> getAllowedMethodsForUser(@PathVariable String userId) {
        try {
            return ResponseEntity.ok(paymentService.getAllowedMethodsForUser(userId));
        } catch (Exception e) {
            log.error("Error fetching allowed methods for user {}: {}", userId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Public endpoint: frontend fetches payment config (no secrets)
    @GetMapping("/config")
    public ResponseEntity<?> getPublicPaymentConfig() {
        try {
            return ResponseEntity.ok(paymentService.getPublicConfig());
        } catch (Exception e) {
            log.error("Error fetching payment config: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Admin endpoint: update payment configuration
    @PutMapping("/config")
    public ResponseEntity<?> updatePaymentConfig(@RequestBody Map<String, Object> config) {
        try {
            Map<String, Object> updatedConfig = paymentService.updatePaymentConfig(config);
            return ResponseEntity.ok(updatedConfig);
        } catch (Exception e) {
            log.error("Error updating payment config: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/webhook/{gateway}")
    public ResponseEntity<Void> handleWebhook(
            @PathVariable String gateway,
            @RequestBody Map<String, Object> webhookData) {
        try {
            paymentService.handleWebhook(gateway, webhookData);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Razorpay specific endpoints
    @PostMapping("/razorpay/order")
    public ResponseEntity<PaymentResponseDTO> createRazorpayOrder(@RequestBody Map<String, Object> orderRequest) {
        try {
            log.info("Received Razorpay order request: {}", orderRequest);

            // Validate required fields
            if (orderRequest.get("amount") == null) {
                log.error("Amount is required for Razorpay order creation");
                PaymentResponseDTO errorResponse = PaymentResponseDTO.builder()
                        .success(false)
                        .message("Amount is required")
                        .build();
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Map<String, Object> razorpayRequest = new HashMap<>();
            razorpayRequest.put("gateway", "razorpay");
            razorpayRequest.put("amount", orderRequest.get("amount"));
            razorpayRequest.put("currency", orderRequest.getOrDefault("currency", "INR"));
            if (orderRequest.get("receipt") != null) {
                razorpayRequest.put("receipt", orderRequest.get("receipt"));
            }

            PaymentResponseDTO response = paymentService.createPaymentOrder(razorpayRequest);
            log.info("Razorpay order created successfully: {}", response.getOrderId());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Invalid request for Razorpay order: {}", e.getMessage());
            PaymentResponseDTO errorResponse = PaymentResponseDTO.builder()
                    .success(false)
                    .message("Invalid request: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (IllegalStateException e) {
            log.error("Configuration error for Razorpay: {}", e.getMessage());
            PaymentResponseDTO errorResponse = PaymentResponseDTO.builder()
                    .success(false)
                    .message("Payment gateway configuration error")
                    .build();
            return ResponseEntity.internalServerError().body(errorResponse);
        } catch (Exception e) {
            log.error("Unexpected error creating Razorpay order: {}", e.getMessage(), e);
            PaymentResponseDTO errorResponse = PaymentResponseDTO.builder()
                    .success(false)
                    .message("Failed to create payment order. Please try again.")
                    .build();
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @PostMapping("/razorpay/verify")
    public ResponseEntity<PaymentResponseDTO> verifyRazorpayPayment(
            @RequestBody Map<String, Object> verificationRequest) {
        try {
            PaymentResponseDTO response = paymentService.verifyPayment("razorpay", verificationRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error verifying Razorpay payment: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/razorpay/status/{paymentId}")
    public ResponseEntity<?> getRazorpayPaymentStatus(@PathVariable String paymentId) {
        try {
            log.info("Fetching Razorpay payment status for payment ID: {}", paymentId);

            Map<String, Object> status = paymentService.getRazorpayPaymentStatus(paymentId);

            log.info("Successfully retrieved payment status for payment ID: {}", paymentId);
            return ResponseEntity.ok(status);
        } catch (IllegalArgumentException e) {
            log.error("Invalid payment ID: {}", e.getMessage());
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Invalid payment ID: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (IllegalStateException e) {
            log.error("Razorpay configuration error: {}", e.getMessage());
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Payment gateway configuration error");
            return ResponseEntity.internalServerError().body(errorResponse);
        } catch (Exception e) {
            log.error("Error getting Razorpay payment status: {}", e.getMessage());
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Failed to fetch payment status. Please try again.");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @PostMapping("/razorpay/refund")
    public ResponseEntity<?> refundRazorpayPayment(@RequestBody Map<String, Object> refundRequest) {
        try {
            // For now, return a basic response. In production, you'd process refund via
            // Razorpay API
            Map<String, Object> refund = Map.of(
                    "success", true,
                    "refundId", "refund_" + System.currentTimeMillis(),
                    "message", "Refund processed successfully");
            return ResponseEntity.ok(refund);
        } catch (Exception e) {
            log.error("Error processing Razorpay refund: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

}
