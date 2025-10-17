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
    @Column(name = "ingredientid")
    private int ingredientId;

    @Column(name = "ingredientname")
    private String ingredientName;

    @Column(name = "ingredienttype")
    private String ingredientType;

    @Column(name = "category")
    private String category;

    @Column(name = "price")
    private double price;

    @Column(name = "is_enabled")
    private boolean isEnabled;
}
