package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Entity
@Setter
@Getter
@NoArgsConstructor
@SuperBuilder
@Table(name = "directions")


public class Directions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "number")
    private long number;


    @Column(name = "street_name")
    private String street_name;

    @Column(name = "owner")
    private short owner;

}




