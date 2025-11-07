package com.echocode.project.entities;

import com.echocode.project.enums.IngredientType;
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
    private long id;

    @Column(length = 20, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IngredientType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IngredientCategory category;

    private double price;

    @Column(nullable = false)
    private int quantity = 1;

    private boolean isEnabled;
}

enum IngredientCategory {
    MASA,
    SALSA,
    QUESO,
    TOPPING,
    PAN,
    CARNE,
    ADEREZO,
    TAMAÑO,
}