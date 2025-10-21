package com.echocode.project.controllers;

import com.echocode.project.dto.CardRequest;
import com.echocode.project.dto.CardResponse;
import com.echocode.project.entities.Client;
import com.echocode.project.repositories.ClientRepository;
import com.echocode.project.services.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cards")
public class CardController {

    @Autowired
    private CardService cardService;

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping
    public ResponseEntity<List<CardResponse>> getAllCards(Authentication authentication) {
        try {
            long userId = getUserIdFromAuth(authentication);
            List<CardResponse> cards = cardService.getAllCardsByUser(userId);
            return ResponseEntity.ok(cards);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardResponse> getCardById(
            @PathVariable long id,
            Authentication authentication) {
        try {
            long userId = getUserIdFromAuth(authentication);
            CardResponse card = cardService.getCardById(userId, id);
            return ResponseEntity.ok(card);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<CardResponse> createCard(
            @RequestBody CardRequest request,
            Authentication authentication) {
        try {
            long userId = getUserIdFromAuth(authentication);
            CardResponse card = cardService.createCard(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(card);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CardResponse> updateCard(
            @PathVariable long id,
            @RequestBody CardRequest request,
            Authentication authentication) {
        try {
            long userId = getUserIdFromAuth(authentication);
            CardResponse card = cardService.updateCard(userId, id, request);
            return ResponseEntity.ok(card);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCard(
            @PathVariable long id,
            Authentication authentication) {
        try {
            long userId = getUserIdFromAuth(authentication);
            cardService.deleteCard(userId, id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    private long getUserIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return client.getUserId();
    }
}
