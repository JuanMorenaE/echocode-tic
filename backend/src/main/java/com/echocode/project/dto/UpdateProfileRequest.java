package com.echocode.project.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String cedula;
    private String birthdate; // formato: yyyy-MM-dd
}
