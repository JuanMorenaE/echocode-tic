package com.echocode.project.services;

import com.echocode.project.dto.external.CardOwnerResponse;
import com.echocode.project.entities.Card;
import com.echocode.project.entities.Client;
import com.echocode.project.repositories.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class ExternalPaymentService {

    @Autowired
    private CardRepository cardRepository;

    public CardOwnerResponse getCardOwnerInfo(String cardNumber) {
        Card card = cardRepository.findByCardNumber(cardNumber)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found"));

        Client client = card.getClient();

        // Validate card expiration
        boolean isValid = isCardValid(card.getExpirationDate());

        return CardOwnerResponse.builder()
                .cardholderName(card.getCardholderName())
                .cardType(card.getCardType())
                .expirationDate(card.getExpirationDate())
                .isValid(isValid)
                .client(CardOwnerResponse.ClientInfo.builder()
                        .fullName(client.getFirstName() + " " + client.getLastName())
                        .document(client.getDocument())
                        .email(client.getEmail())
                        .phoneNumber(client.getPhoneNumber())
                        .build())
                .build();
    }

    private boolean isCardValid(String expirationDate) {
        try {
            // Format: MM/YY
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yy");
            LocalDate expDate = LocalDate.parse("01/" + expirationDate, DateTimeFormatter.ofPattern("dd/MM/yy"));
            // Card is valid if expiration is after current month
            return expDate.isAfter(LocalDate.now().withDayOfMonth(1));
        } catch (Exception e) {
            return false;
        }
    }
}
