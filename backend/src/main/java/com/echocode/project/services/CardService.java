package com.echocode.project.services;

import com.echocode.project.dto.CardRequest;
import com.echocode.project.dto.CardResponse;
import com.echocode.project.entities.Card;
import com.echocode.project.entities.CardType;
import com.echocode.project.entities.Client;
import com.echocode.project.repositories.CardRepository;
import com.echocode.project.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Transactional(readOnly = true)
    public List<CardResponse> getAllCardsByUser(long userId) {
        return cardRepository.findByClient_UserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CardResponse getCardById(long userId, long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (card.getClient().getUserId() != userId) {
            throw new RuntimeException("Card does not belong to user");
        }

        return mapToResponse(card);
    }

    @Transactional
    public CardResponse createCard(long userId, CardRequest request) {
        Client client = clientRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verificar si es la primera tarjeta del usuario
        List<Card> existingCards = cardRepository.findByClient_UserId(userId);
        boolean isFirstCard = existingCards.isEmpty();

        // Si es la primera tarjeta, debe ser predeterminada
        boolean shouldBeDefault = isFirstCard || (request.getIsDefault() != null && request.getIsDefault());

        // Si debe ser default, quitar default de las demás
        if (shouldBeDefault && !isFirstCard) {
            removeDefaultFromOtherCards(userId);
        }

        Card card = Card.builder()
                .client(client)
                .alias(request.getAlias())
                .cardholderName(request.getCardholderName())
                .cardNumber(request.getCardNumber()) // En producción debería encriptarse
                .expirationDate(request.getExpirationDate())
                .cardType(CardType.valueOf(request.getCardType()))
                .isDefault(shouldBeDefault)
                .build();

        card = cardRepository.save(card);
        return mapToResponse(card);
    }

    @Transactional
    public CardResponse updateCard(long userId, long cardId, CardRequest request) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (card.getClient().getUserId() != userId) {
            throw new RuntimeException("Card does not belong to user");
        }

        // Si se marca como default, quitar default de las demás
        if (request.getIsDefault() != null && request.getIsDefault() && !card.isDefault()) {
            removeDefaultFromOtherCards(userId);
        }

        card.setAlias(request.getAlias());
        card.setCardholderName(request.getCardholderName());
        card.setCardNumber(request.getCardNumber());
        card.setExpirationDate(request.getExpirationDate());
        card.setCardType(CardType.valueOf(request.getCardType()));
        card.setDefault(request.getIsDefault() != null && request.getIsDefault());

        card = cardRepository.save(card);
        return mapToResponse(card);
    }

    @Transactional
    public void deleteCard(long userId, long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (card.getClient().getUserId() != userId) {
            throw new RuntimeException("Card does not belong to user");
        }

        cardRepository.delete(card);
    }

    private void removeDefaultFromOtherCards(long userId) {
        List<Card> cards = cardRepository.findByClient_UserId(userId);
        cards.forEach(c -> {
            if (c.isDefault()) {
                c.setDefault(false);
                cardRepository.save(c);
            }
        });
    }

    private CardResponse mapToResponse(Card card) {
        // Extraer solo los últimos 4 dígitos por seguridad
        String last4 = card.getCardNumber().length() >= 4
                ? card.getCardNumber().substring(card.getCardNumber().length() - 4)
                : card.getCardNumber();

        return CardResponse.builder()
                .id(card.getId())
                .alias(card.getAlias())
                .cardholderName(card.getCardholderName())
                .last4Digits(last4)
                .expirationDate(card.getExpirationDate())
                .cardType(card.getCardType().name())
                .isDefault(card.isDefault())
                .build();
    }
}
