package com.cricketacademy.api.service;

import com.cricketacademy.api.dto.PaymentResponseDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class PaymentServiceTest {

    @Autowired
    private PaymentService paymentService;

    @Test
    public void testRazorpayPaymentFlow() {
        // Test order creation
        Map<String, Object> orderRequest = new HashMap<>();
        orderRequest.put("gateway", "razorpay");
        orderRequest.put("amount", 1000);
        orderRequest.put("receipt", "test_rcpt_001");
        
        PaymentResponseDTO orderResponse = paymentService.createPaymentOrder(orderRequest);
        assertTrue(orderResponse.isSuccess());
        assertNotNull(orderResponse.getTransactionId());

        // Test payment verification (simulated)
        Map<String, Object> verificationRequest = new HashMap<>();
        verificationRequest.put("payment_id", "pay_test_" + System.currentTimeMillis());
        verificationRequest.put("order_id", orderResponse.getTransactionId());
        verificationRequest.put("signature", "simulated_signature");
        
        PaymentResponseDTO verificationResponse = paymentService.verifyPayment("razorpay", verificationRequest);
        assertTrue(verificationResponse.isSuccess());
    }

    @Test
    public void testPayPalPaymentFlow() {
        // Test order creation
        Map<String, Object> orderRequest = new HashMap<>();
        orderRequest.put("gateway", "paypal");
        orderRequest.put("amount", "10.00");
        orderRequest.put("currency", "USD");
        
        PaymentResponseDTO orderResponse = paymentService.createPaymentOrder(orderRequest);
        assertTrue(orderResponse.isSuccess());
        assertNotNull(orderResponse.getTransactionId());

        // Test payment verification (simulated)
        Map<String, Object> verificationRequest = new HashMap<>();
        verificationRequest.put("order_id", orderResponse.getTransactionId());
        
        PaymentResponseDTO verificationResponse = paymentService.verifyPayment("paypal", verificationRequest);
        assertTrue(verificationResponse.isSuccess());
    }

    @Test
    public void testGetPaymentMethods() {
        var methods = paymentService.getAvailablePaymentMethods();
        assertTrue(methods.containsKey("razorpay"));
        assertTrue(methods.containsKey("paypal"));
        assertTrue(methods.get("razorpay").contains("card"));
        assertTrue(methods.get("paypal").contains("card"));
    }
}
