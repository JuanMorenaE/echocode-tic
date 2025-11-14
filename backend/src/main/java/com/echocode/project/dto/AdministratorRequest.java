package com.echocode.project.dto;

import com.echocode.project.entities.Address;
import com.echocode.project.entities.Administrator;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdministratorRequest {
    private String document;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String password;
    private AddressResponse address;
}
