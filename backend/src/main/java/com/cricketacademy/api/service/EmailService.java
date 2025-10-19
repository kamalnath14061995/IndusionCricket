package com.cricketacademy.api.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:no-reply@cricketacademy.com}")
    private String from;

    public void send(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {} with subject '{}'", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email");
        }
    }

    public void sendVerificationEmail(String to, String otp) {
        String subject = "Verify Your Email - Cricket Academy";
        String body = String.format(
                "Hello,\n\n" +
                        "Thank you for registering with Cricket Academy! To complete your registration, please verify your email address.\n\n"
                        +
                        "Your verification code is: %s\n\n" +
                        "This code will expire in 30 minutes.\n\n" +
                        "If you did not register for this account, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "Cricket Academy Team",
                otp);

        send(to, subject, body);
    }

}