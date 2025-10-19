package com.cricketacademy.api.service;

import com.cricketacademy.api.dto.PaymentResponseDTO;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.paypal.core.PayPalEnvironment;
import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.orders.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final EmailService emailService;

    @Value("${app.payment.razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${app.payment.razorpay.key-secret}")
    private String razorpayKeySecret;

    @Value("${app.payment.razorpay.base-url:http://localhost:8080}")
    private String razorpayBaseUrl;

    @Value("${app.payment.currency:INR}")
    private String currency;

    private void validateRazorpayCredentials() {
        if (razorpayKeyId == null || razorpayKeyId.isBlank()) {
            log.error("Razorpay key ID is not configured");
            throw new IllegalStateException("Razorpay key ID is not configured");
        }
        if (razorpayKeySecret == null || razorpayKeySecret.isBlank()) {
            log.error("Razorpay key secret is not configured");
            throw new IllegalStateException("Razorpay key secret is not configured");
        }
    }

    public PaymentResponseDTO createPaymentOrder(Map<String, Object> paymentRequest) {
        String gateway = (String) paymentRequest.get("gateway");

        try {
            if ("razorpay".equalsIgnoreCase(gateway)) {
                return createRazorpayOrder(paymentRequest);
            } else {
                throw new IllegalArgumentException("Unsupported payment gateway: " + gateway);
            }
        } catch (Exception e) {
            log.error("Error creating payment order", e);
            throw new RuntimeException("Failed to create payment order", e);
        }
    }

    public PaymentResponseDTO processPayment(Map<String, Object> paymentData) {
        try {
            // Extract payment method and other details
            String method = (String) paymentData.get("method");
            String bookingId = (String) paymentData.get("bookingId");
            String coachingId = (String) paymentData.get("coachingId");
            String transactionId = (String) paymentData.get("transactionId");
            Number amount = (Number) paymentData.get("amount");

            if (method == null || amount == null) {
                throw new IllegalArgumentException("Payment method and amount are required");
            }

            // TODO: Add actual payment processing logic here
            // For example, verify transaction with gateway, update booking/coaching payment
            // status, etc.

            // For demonstration, assume payment is successful if transactionId is present
            boolean success = transactionId != null && !transactionId.isEmpty();

            // Update booking or coaching payment status if applicable
            if (bookingId != null && !bookingId.isEmpty()) {
                // TODO: Update booking payment status in database
                log.info("Updating payment status for bookingId: {}", (Object) bookingId);
            } else if (coachingId != null && !coachingId.isEmpty()) {
                // TODO: Update coaching payment status in database
                log.info("Updating payment status for coachingId: {}", (Object) coachingId);
            }

            // Send email notification for transaction status
            sendTransactionEmail(paymentData, success, transactionId, amount, method);

            return PaymentResponseDTO.builder()
                    .success(success)
                    .message(success ? "Payment processed successfully" : "Payment failed")
                    .transactionId(transactionId)
                    .amount(BigDecimal.valueOf(amount.doubleValue()))
                    .method(method)
                    .build();

        } catch (Exception e) {
            log.error("Error processing payment", e);
            throw new RuntimeException("Failed to process payment", e);
        }
    }

    public PaymentResponseDTO verifyPayment(String gateway, Map<String, Object> verificationRequest) {
        try {
            if ("razorpay".equalsIgnoreCase(gateway)) {
                return verifyRazorpayPayment(verificationRequest);
            } else {
                throw new IllegalArgumentException("Unsupported payment gateway: " + gateway);
            }
        } catch (Exception e) {
            log.error("Error verifying payment", e);
            throw new RuntimeException("Failed to verify payment", e);
        }
    }

    public Map<String, List<String>> getAvailablePaymentMethods() {
        Map<String, List<String>> methods = new HashMap<>();
        methods.put("razorpay", List.of("card", "upi", "netbanking", "wallet"));
        return methods;
    }

    // Get payment methods in frontend-expected format
    public List<Map<String, Object>> getPaymentMethodsList() {
        List<Map<String, Object>> methods = new ArrayList<>();

        // Cash payment (offline)
        methods.add(Map.of(
                "key", "CASH",
                "label", "Cash (Offline)",
                "type", "OFFLINE"));

        // Card/UPI via Razorpay (online)
        methods.add(Map.of(
                "key", "CARD_RAZORPAY",
                "label", "Card/UPI (Razorpay)",
                "type", "ONLINE",
                "provider", "RAZORPAY"));

        return methods;
    }

    // Get allowed payment methods for a specific user
    public List<Map<String, Object>> getAllowedMethodsForUser(String userId) {
        // TODO: Implement user-specific filtering based on user
        // permissions/restrictions
        // For now, return all available methods
        return getPaymentMethodsList();
    }

    public void handleWebhook(String gateway, Map<String, Object> webhookData) {
        try {
            if ("razorpay".equalsIgnoreCase(gateway)) {
                handleRazorpayWebhook(webhookData);
            } else {
                throw new IllegalArgumentException("Unsupported payment gateway: " + gateway);
            }
        } catch (Exception e) {
            log.error("Error processing webhook", e);
            throw new RuntimeException("Failed to process webhook", e);
        }
    }

    private PaymentResponseDTO createRazorpayOrder(Map<String, Object> request) throws RazorpayException {
        try {
            log.info("Creating Razorpay order with request: {}", (Object) request);

            // Validate Razorpay credentials
            validateRazorpayCredentials();

            // Test credential validity by attempting to create client
            RazorpayClient razorpay;
            try {
                razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
                log.debug("Razorpay client initialized successfully");
            } catch (Exception e) {
                log.error("Failed to initialize Razorpay client with provided credentials: {}", e.getMessage());
                throw new IllegalStateException("Invalid Razorpay credentials: " + e.getMessage(), e);
            }

            JSONObject orderRequest = new JSONObject();
            Object amountObj = request.get("amount");
            if (amountObj == null) {
                throw new IllegalArgumentException("Amount is required for order creation");
            }

            // Ensure amount is a valid number
            long amount;
            if (amountObj instanceof Number) {
                amount = ((Number) amountObj).longValue();
            } else if (amountObj instanceof String) {
                try {
                    amount = Long.parseLong((String) amountObj);
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("Invalid amount format: " + amountObj);
                }
            } else {
                throw new IllegalArgumentException("Amount must be a number or string");
            }

            orderRequest.put("amount", amount);
            orderRequest.put("currency", currency);

            // Only add receipt if it's not null
            Object receipt = request.get("receipt");
            if (receipt != null) {
                orderRequest.put("receipt", receipt.toString());
            }

            orderRequest.put("payment_capture", 1);

            log.debug("Creating Razorpay order with amount: {}, currency: {}", amount, currency);
            com.razorpay.Order order = razorpay.orders.create(orderRequest);
            log.info("Razorpay order created successfully with ID: {}", (Object) order.get("id"));

            // Convert amount to BigDecimal safely
            BigDecimal amountValue;
            Object razorpayAmountObj = order.get("amount");
            if (razorpayAmountObj instanceof Number) {
                amountValue = BigDecimal.valueOf(((Number) razorpayAmountObj).longValue());
            } else if (razorpayAmountObj instanceof String) {
                try {
                    amountValue = new BigDecimal((String) razorpayAmountObj);
                } catch (NumberFormatException e) {
                    log.warn("Invalid amount format from Razorpay: {}, using original amount", razorpayAmountObj);
                    amountValue = BigDecimal.valueOf(amount);
                }
            } else {
                log.warn("Unexpected amount type from Razorpay: {}, using original amount",
                        razorpayAmountObj != null ? razorpayAmountObj.getClass() : "null");
                amountValue = BigDecimal.valueOf(amount);
            }

            return PaymentResponseDTO.builder()
                    .success(true)
                    .transactionId(order.get("id"))
                    .orderId(order.get("id"))
                    .amount(amountValue)
                    .currency(order.get("currency"))
                    .build();
        } catch (RazorpayException e) {
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Unknown Razorpay error";
            log.error("Razorpay API error: {}", errorMessage, e);

            // Check for specific error types based on message content
            if (errorMessage.contains("authentication") || errorMessage.contains("invalid key")) {
                log.error("Razorpay authentication failed - please check API credentials");
                throw new RazorpayException("Authentication failed - invalid API credentials: " + errorMessage);
            } else if (errorMessage.contains("bad request") || errorMessage.contains("invalid")) {
                throw new RazorpayException("Invalid request parameters: " + errorMessage);
            } else if (errorMessage.contains("gateway") || errorMessage.contains("server")) {
                throw new RazorpayException("Razorpay gateway error - please try again later: " + errorMessage);
            } else {
                throw new RazorpayException("Razorpay error: " + errorMessage);
            }
        } catch (IllegalStateException e) {
            log.error("Configuration error: {}", e.getMessage());
            throw e; // Re-throw as-is since we already logged it
        } catch (IllegalArgumentException e) {
            log.error("Invalid request parameters: {}", e.getMessage());
            throw e; // Re-throw as-is
        } catch (Exception e) {
            log.error("Unexpected error creating Razorpay order: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage(), e);
        }
    }

    private PaymentResponseDTO verifyRazorpayPayment(Map<String, Object> request) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        String paymentId = (String) request.get("payment_id");
        String orderId = (String) request.get("order_id");
        String signature = (String) request.get("signature");

        // Verify payment signature
        JSONObject attributes = new JSONObject();
        attributes.put("razorpay_payment_id", paymentId);
        attributes.put("razorpay_order_id", orderId);
        attributes.put("razorpay_signature", signature);

        boolean isValid = Utils.verifyPaymentSignature(attributes, razorpayKeySecret);

        if (!isValid) {
            throw new SecurityException("Invalid payment signature");
        }

        // Get payment details
        com.razorpay.Payment payment = razorpay.payments.fetch(paymentId);

        // Convert amount to BigDecimal safely
        BigDecimal amountValue;
        Object paymentAmountObj = payment.get("amount");
        if (paymentAmountObj instanceof Number) {
            amountValue = BigDecimal.valueOf(((Number) paymentAmountObj).longValue());
        } else if (paymentAmountObj instanceof String) {
            try {
                amountValue = new BigDecimal((String) paymentAmountObj);
            } catch (NumberFormatException e) {
                log.warn("Invalid amount format from Razorpay payment: {}", paymentAmountObj);
                amountValue = BigDecimal.ZERO;
            }
        } else {
            log.warn("Unexpected amount type from Razorpay payment: {}",
                    paymentAmountObj != null ? paymentAmountObj.getClass() : "null");
            amountValue = BigDecimal.ZERO;
        }

        return PaymentResponseDTO.builder()
                .success(true)
                .transactionId(paymentId)
                .amount(amountValue)
                .currency(payment.get("currency"))
                .status(payment.get("status"))
                .build();
    }

    public Map<String, Object> getRazorpayPaymentStatus(String paymentId) throws RazorpayException {
        try {
            log.info("Fetching Razorpay payment status for payment ID: {}", paymentId);

            // Validate Razorpay credentials
            validateRazorpayCredentials();

            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            // Fetch payment details from Razorpay
            com.razorpay.Payment payment = razorpay.payments.fetch(paymentId);

            Map<String, Object> status = new HashMap<>();
            status.put("status", payment.get("status"));
            status.put("amount", payment.get("amount"));
            status.put("currency", payment.get("currency"));
            status.put("orderId", payment.get("order_id"));
            status.put("method", payment.get("method"));
            status.put("email", payment.get("email"));
            status.put("contact", payment.get("contact"));
            status.put("createdAt", payment.get("created_at"));

            log.info("Successfully fetched payment status for payment ID: {}", paymentId);
            return status;

        } catch (RazorpayException e) {
            log.error("Razorpay API error fetching payment status: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error fetching Razorpay payment status: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch payment status", e);
        }
    }

    private void handleRazorpayWebhook(Map<String, Object> webhookData) {
        try {
            String payload = webhookData.toString();
            String signature = (String) webhookData.get("razorpay_signature");

            boolean isValid = Utils.verifyWebhookSignature(payload, signature, razorpayKeySecret);

            if (!isValid) {
                throw new SecurityException("Invalid webhook signature");
            }

            String event = (String) webhookData.get("event");
            JSONObject payloadData = new JSONObject((Map) webhookData.get("payload"));

            switch (event) {
                case "payment.captured":
                    // Handle successful payment
                    break;
                case "payment.failed":
                    // Handle failed payment
                    break;
                default:
                    log.info("Received unhandled webhook event: {}", (Object) event);
            }
        } catch (Exception e) {
            log.error("Error processing Razorpay webhook", e);
            throw new RuntimeException("Failed to process webhook", e);
        }
    }

    // Public config for frontend (no secrets)
    public Map<String, Object> getPublicConfig() {
        Map<String, Object> cfg = new HashMap<>();

        Map<String, Object> gateways = new HashMap<>();
        gateways.put("razorpay", Map.of(
                "enabled", razorpayKeyId != null && !razorpayKeyId.isBlank(),
                "keyId", razorpayKeyId));

        // Global enabled payment methods
        Map<String, Boolean> globalEnabled = new HashMap<>();
        globalEnabled.put("CASH", true);
        globalEnabled.put("CARD_RAZORPAY", true);

        cfg.put("currency", currency);
        cfg.put("gateways", gateways);
        cfg.put("methods", getAvailablePaymentMethods());
        cfg.put("globalEnabled", globalEnabled);
        cfg.put("perUserAllowed", new HashMap<String, Object>());
        cfg.put("restrictions", new HashMap<String, Object>());
        return cfg;
    }

    // Update payment configuration (for admin management)
    public Map<String, Object> updatePaymentConfig(Map<String, Object> newConfig) {
        try {
            // For now, we'll log the update - in production, this should persist to
            // database
            log.info("Updating payment configuration: {}", (Object) newConfig);

            // TODO: Implement persistence logic here
            // This could involve saving to database, updating properties, etc.

            // Return the updated config
            return getPublicConfig();
        } catch (Exception e) {
            log.error("Error updating payment config", e);
            throw new RuntimeException("Failed to update payment configuration", e);
        }
    }

    private void sendTransactionEmail(Map<String, Object> paymentData, boolean success, String transactionId,
            Number amount, String method) {
        try {
            String email = (String) paymentData.get("email");
            if (email == null || email.trim().isEmpty()) {
                log.warn("No email provided for transaction notification");
                return;
            }

            String bookingId = (String) paymentData.get("bookingId");
            String coachingId = (String) paymentData.get("coachingId");

            String subject;
            String body;

            if (success) {
                subject = "Payment Successful - Cricket Academy";
                body = String.format(
                        "Dear Customer,\n\n" +
                                "Your payment has been processed successfully!\n\n" +
                                "Transaction Details:\n" +
                                "Transaction ID: %s\n" +
                                "Amount: ₹%.2f\n" +
                                "Payment Method: %s\n" +
                                "%s" +
                                "\nThank you for choosing Cricket Academy!\n\n" +
                                "Best regards,\n" +
                                "Cricket Academy Team",
                        transactionId,
                        amount.doubleValue(),
                        method,
                        (bookingId != null ? "Booking ID: " + bookingId + "\n" : "") +
                                (coachingId != null ? "Coaching ID: " + coachingId + "\n" : ""));
            } else {
                subject = "Payment Failed - Cricket Academy";
                body = String.format(
                        "Dear Customer,\n\n" +
                                "Unfortunately, your payment could not be processed.\n\n" +
                                "Transaction Details:\n" +
                                "Transaction ID: %s\n" +
                                "Amount: ₹%.2f\n" +
                                "Payment Method: %s\n" +
                                "%s" +
                                "\nPlease try again or contact our support team for assistance.\n\n" +
                                "Best regards,\n" +
                                "Cricket Academy Team",
                        transactionId != null ? transactionId : "N/A",
                        amount.doubleValue(),
                        method,
                        (bookingId != null ? "Booking ID: " + bookingId + "\n" : "") +
                                (coachingId != null ? "Coaching ID: " + coachingId + "\n" : ""));
            }

            emailService.send(email, subject, body);
            log.info("Transaction email sent to {} for transaction {}", email, transactionId);

        } catch (Exception e) {
            log.error("Failed to send transaction email: {}", e.getMessage());
            // Don't throw exception to avoid breaking payment flow
        }
    }
}
