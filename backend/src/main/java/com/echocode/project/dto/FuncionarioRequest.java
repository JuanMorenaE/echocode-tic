package com.echocode.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FuncionarioRequest {
    private String document;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String password;
    private String address;
}
