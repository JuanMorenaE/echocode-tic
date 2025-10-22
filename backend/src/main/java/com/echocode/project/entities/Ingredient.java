package com.echocode.project.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    @Column(length = 20, nullable = false)
    private String ingredientName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IngredientType ingredientType;

    @ManyToOne
    @JsonBackReference
    @JsonIgnoreProperties("ingredientes")
    @JoinColumn(name = "categoryId")
    private Category category;

    private double price;

    private boolean isEnabled;
}

enum IngredientType {
    BURGER,
    PIZZA,
}