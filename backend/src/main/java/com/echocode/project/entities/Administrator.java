package com.echocode.project.entities;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class Administrator extends User {
    Administrator(long id, String hash, String email, String password, String firstName, String lastName, String phoneNumber) {
        super(id, hash, email, password, firstName, lastName, phoneNumber);
    }
}
