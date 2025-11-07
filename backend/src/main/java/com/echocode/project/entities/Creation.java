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

    @Column(length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ownerId")
    private Client owner;

    private boolean isFavourite;

    @NonNull
    @Enumerated(EnumType.STRING)
    private CreationType creationType;

    @ManyToOne
    @JoinColumn(name = "id")
    private PizzaSize pizzaSize;

    @ManyToMany
    @JoinTable(
        name = "creation_ingredients",
        joinColumns = @JoinColumn(name = "creationId"),
        inverseJoinColumns = @JoinColumn(name = "ingredientId")
    )
    private List<Ingredient> ingredients = new ArrayList<>();
}

