package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
@Table(name = "administrators")
public class Administrator extends User {
    // Administrator no tiene campos adicionales por ahora
    // Hereda todos los campos de User: id, hash, email, password, firstName, lastName, phoneNumber, cedula, dirección
}
