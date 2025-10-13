package com.echocode.project.dto;

import com.echocode.project.entities.DocumentType;
import lombok.*;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String document;
    private DocumentType documentType;
    private Date birthdate;
}