package com.echocode.project.entities;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class Administrator extends User {
    public Administrator(long id, String hash, String email, String password, String firstName, String lastName, String phoneNumber) {
        super(id, hash, email, password, firstName, lastName, phoneNumber);
    }
}
