package com.echocode.project.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CardRequest {
    private String alias;
    private String cardholderName;
    private String cardNumber;
    private String expirationDate; // MM/YY
    private String cardType; // VISA, MASTERCARD, etc.
    private Boolean isDefault;
}
