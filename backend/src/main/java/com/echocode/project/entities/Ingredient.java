package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Table(name = "ingredients")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ingredientId;

    @NonNull
    @Column(length = 20)
    private String ingredientName;

    @NonNull
    private IngredientType ingredientType;

    @NonNull
    private String category;

    private double price;

    private boolean isEnabled;
}

enum IngredientType {
    BURGER,
    PIZZA,
}