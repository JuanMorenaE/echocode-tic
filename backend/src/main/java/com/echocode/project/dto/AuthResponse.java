package com.echocode.project.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String cedula;
    private String birthdate;
    private String message;
}