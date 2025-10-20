package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@SuperBuilder
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Table(name = "clients")
public class Client extends User
{
    @Temporal(TemporalType.DATE)
    private Date birthdate;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Card> cards = new ArrayList<>();
}
