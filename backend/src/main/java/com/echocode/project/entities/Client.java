package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
@Table(name = "clients")
public class Client extends User {
    @Temporal(TemporalType.DATE)
    @Column(name = "birthdate")
    private Date birthdate;

    @ElementCollection
    @CollectionTable(name = "client_addresses", joinColumns = @JoinColumn(name = "client_id"))
    @Column(name = "address")
    private List<String> addresses;

    @OneToMany(mappedBy = "client")
    private List<Card> cards;
}
