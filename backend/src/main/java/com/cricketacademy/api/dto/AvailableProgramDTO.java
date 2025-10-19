package com.cricketacademy.api.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableProgramDTO {

    private Long id;

    @NotBlank(message = "Program name is required")
    @Size(min = 2, max = 255, message = "Program name must be between 2 and 255 characters")
    private String programName;

    private String description;

    @Size(max = 100, message = "Duration must be less than 100 characters")
    private String duration;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @Size(max = 50, message = "Level must be less than 50 characters")
    private String level;

    @Size(max = 100, message = "Category must be less than 100 characters")
    private String category;

    @Size(max = 10, message = "Icon must be less than 10 characters")
    private String icon;

    @Size(max = 100, message = "Age group must be less than 100 characters")
    private String ageGroup;

    private String focusAreas;

    @Size(max = 100, message = "Format must be less than 100 characters")
    private String format;

    private Boolean isSuggested = false;

    private Boolean isActive = true;

    private Set<Long> coachIds;
}
