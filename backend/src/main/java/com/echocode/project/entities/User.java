package com.echocode.project.entities;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public abstract class User {
    private long id;
    private String hash;

    private String email;
    private String password;

    private String firstName;
    private String lastName;
    private String phoneNumber;

    public String GetFullName() {
        return  firstName + " " + lastName;
    }
}
