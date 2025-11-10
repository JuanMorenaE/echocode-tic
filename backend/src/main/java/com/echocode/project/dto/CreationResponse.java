package com.echocode.project.dto;

import com.echocode.project.entities.Ingredient;
import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreationResponse {
    private int creationId;
    private String name;
    private String creationType;
    private boolean isFavourite;
    private List<Ingredient> ingredients;
    private double totalPrice;
}
