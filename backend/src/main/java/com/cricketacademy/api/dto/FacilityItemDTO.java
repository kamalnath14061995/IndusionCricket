package com.cricketacademy.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class FacilityItemDTO {
    private Long id; // optional for update
    private String title;
    private String description;
    private String imageUrl;
    private List<String> features;
    private Integer sortOrder;
}