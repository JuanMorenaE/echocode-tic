package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Builder
@Setter @Getter
@NoArgsConstructor @AllArgsConstructor
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @NonNull
    @Column(length = 60)
    private String name;
}




