package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Global error controller to handle error responses
 */
@RestController
@Slf4j
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<ApiResponse<String>> handleError(HttpServletRequest request) {
        Integer statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");
        String errorMessage = (String) request.getAttribute("javax.servlet.error.message");
        String requestUri = (String) request.getAttribute("javax.servlet.error.request_uri");

        if (statusCode == null) {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR.value();
        }

        if (errorMessage == null) {
            errorMessage = "An error occurred";
        }

        log.debug("Error occurred - Status: {}, Message: {}, URI: {}", statusCode, errorMessage, requestUri);

        HttpStatus status = HttpStatus.valueOf(statusCode);
        ApiResponse<String> response = ApiResponse.error(errorMessage);

        return ResponseEntity.status(status).body(response);
    }
}