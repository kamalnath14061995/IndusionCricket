package com.cricketacademy.api.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDTO {
    private boolean success;
    private String message;
    private String transactionId;
    private String orderId;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String method;
}
