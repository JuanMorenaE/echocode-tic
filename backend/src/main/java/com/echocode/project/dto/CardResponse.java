package com.echocode.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CardResponse {
    private long id;
    private String alias;
    private String cardholderName;
    private String last4Digits; // Solo últimos 4 dígitos por seguridad
    private String expirationDate;
    private String cardType;
    @JsonProperty("isDefault")
    private boolean isDefault;
}
