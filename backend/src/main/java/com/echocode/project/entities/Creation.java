package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Builder
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "creations")
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
