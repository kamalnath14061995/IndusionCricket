package com.cricketacademy.api.controller;

import com.cricketacademy.api.service.GoogleReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private GoogleReviewService googleReviewService;

    @GetMapping("/google")
    public ResponseEntity<List<Map<String, Object>>> getGoogleReviews() {
        List<Map<String, Object>> reviews = googleReviewService.getGoogleReviews();
        return ResponseEntity.ok(reviews);
    }
}