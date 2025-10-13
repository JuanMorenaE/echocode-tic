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
    @Enumerated(EnumType.STRING)
    @Column(name = "creation_type")
    private CreationType creationType;

    @ManyToOne
    @JoinColumn(name = "pizza_size_id")
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
