package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int productId;

    @NonNull
    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @NonNull
    @Column(nullable = false)
    private double price;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductType productType;

    @Column(length = 50)
    private String category;

    @Column(nullable = false)
    @Builder.Default
    private boolean isAvailable = true;

    @Column(length = 500)
    private String imageUrl;
}

