package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Setter @Getter
@NoArgsConstructor @AllArgsConstructor
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 100, nullable = false)
    private String alias; // Ej: "Casa", "Trabajo", "Apartamento"

    @Column(length = 200, nullable = false)
    private String street; // Calle

    @Column(length = 20, nullable = false)
    private String number; // Número de puerta

    @Column(length = 100)
    private String apartmentNumber; // Número de apartamento

    @Column(length = 100, nullable = false)
    private String city; // Ciudad

    @Column(length = 20, nullable = false)
    private String zipCode; // Código postal

    @Column(length = 500)
    private String additionalInfo; // Información adicional (ej: "Portón verde")

    @Column(nullable = false)
    @Builder.Default
    private boolean isDefault = false; // Dirección por defecto
}




