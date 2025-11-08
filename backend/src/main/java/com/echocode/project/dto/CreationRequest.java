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
    private Boolean isFavourite; // Usar Boolean (wrapper) en lugar de boolean primitivo
    private List<Long> ingredientIds;
}
