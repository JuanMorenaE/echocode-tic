package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@SuperBuilder
@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Table(name = "users")
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long userId;

    @Column(unique = true)
    private String userHash;

    @NonNull
    @Column(unique = true)
    private String document;

    @Column(length = 200, unique = true, nullable = false)
    private String email;

    @Column( length = 36, nullable = false)
    private String passwordHash;

    @Column(length = 36)
    private String firstName;

    @Column(length = 36)
    private String lastName;

    @Column(length = 20)
    private String phoneNumber;

//    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Address> addressess

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
