package com.cricketacademy.api.dto;

import lombok.Data;

@Data
public class VerifyOtpRequest {
    private String token;
    private String otp;
}
