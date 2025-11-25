package com.echocode.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponse {
    private long id;
    private String alias;
    private String street;
    private String number;
    private String apartmentNumber;
    private String city;
    private String zipCode;
    private String additionalInfo;
    @JsonProperty("isDefault")
    private boolean isDefault;
}
