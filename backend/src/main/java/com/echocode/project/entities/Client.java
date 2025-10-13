package com.echocode.project.entities;

import lombok.*;

import java.util.Date;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Client extends User {
    private String document;

    private Date birthdate;
    private List<String> addresses;
    private List<Card> cards;

    Client(long id, String hash, String email, String password, String firstName, String lastName, String phoneNumber) {
        super(id, hash, email, password, firstName, lastName, phoneNumber);
    }
}

