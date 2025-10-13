package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "ingredients")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_id")
    private int ingredientId;

    @Column(name = "ingredient_name")
    private String ingredientName;

    @Column(name = "ingredient_type")
    private String ingredientType;

    @Column(name = "category")
    private String category;

    @Column(name = "price")
    private double price;

    @Column(name = "is_enabled")
    private boolean isEnabled;
}
