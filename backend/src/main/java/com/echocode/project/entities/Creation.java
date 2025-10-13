package com.echocode.project.entities;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Creation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int creationId;

    private int ownerId;

    private boolean isFavourite;

    @NonNull
    private CreationType creationType;

    private PizzaSize pizzaSize;

    List<Ingredient> ingredients = new ArrayList<>();
}

enum CreationType {
    BURGER,
    PIZZA,
}
