package com.echocode.project.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressRequest {
    private String alias;
    private String street;
    private String number;
    private String apartmentNumber;
    private String city;
    private String zipCode;
    private String additionalInfo;
    private Boolean isDefault;
}
