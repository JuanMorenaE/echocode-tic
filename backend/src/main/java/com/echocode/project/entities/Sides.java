package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "sides")

public class Sides {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private long id;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private String price;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(name = "side_category")
    private CreationType sideCategory;

}
