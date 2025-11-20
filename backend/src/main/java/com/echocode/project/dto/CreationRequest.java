package com.echocode.project.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreationRequest {
    private String name;
    private String creationType; // "BURGER" o "PIZZA"
    private Boolean isFavourite;
    private List<Long> ingredientIds;
}
