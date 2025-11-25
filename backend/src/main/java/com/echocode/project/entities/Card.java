package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Table(name = "cards")
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private Client client;

    @NonNull
    @Column(length = 100, nullable = false)
    private String alias; // Ej: "Visa Principal", "Mastercard Trabajo"

    @NonNull
    @Column(length = 100, nullable = false)
    private String cardholderName; // Nombre en la tarjeta

    @NonNull
    @Column(length = 19, nullable = false)
    private String cardNumber; // Número de tarjeta

    @NonNull
    @Column(length = 5, nullable = false)
    private String expirationDate; // Formato: MM/YY

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardType cardType; // VISA, MASTERCARD, etc.

    @Column(nullable = false)
    @Builder.Default
    private boolean isDefault = false; // Tarjeta por defecto
}

