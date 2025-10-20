package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Table(name = "creations")
public class Creation
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int creationId;

    private int ownerId;

    private boolean isFavourite;

    @NonNull
    @Enumerated(EnumType.STRING)
    private CreationType creationType;

    @ManyToOne
    private PizzaSize pizzaSize;

    @ManyToMany
    @JoinTable(
        name = "creation_ingredients",
        joinColumns = @JoinColumn(name = "creation_id"),
        inverseJoinColumns = @JoinColumn(name = "ingredient_id")
    )
    private List<Ingredient> ingredients = new ArrayList<>();
}

enum CreationType {
    BURGER,
    PIZZA,
}
