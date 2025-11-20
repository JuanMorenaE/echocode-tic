package com.echocode.project.dto.external;

import com.echocode.project.entities.CardType;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CardOwnerResponse {
    private String cardholderName;
    private CardType cardType;
    private String expirationDate;
    private boolean isValid;
    private ClientInfo client;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClientInfo {
        private String fullName;
        private String document;
        private String email;
        private String phoneNumber;
    }
}
