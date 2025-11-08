package com.echocode.project.controllers;

import com.echocode.project.dto.CreationRequest;
import com.echocode.project.dto.CreationResponse;
import com.echocode.project.entities.Client;
import com.echocode.project.entities.Creation;
import com.echocode.project.repositories.ClientRepository;
import com.echocode.project.services.CreationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/creations")
public class CreationController {

    @Autowired
    CreationService creationService;

    private static final Logger logger = LoggerFactory.getLogger(CreationController.class);

    @Autowired
    ClientRepository clientRepository;

    @GetMapping
    public List<Creation> getAllCreations() {
        return creationService.getAllCreations();
    }

    @GetMapping("/{id}")
    public Creation getCreationByCreationId(@PathVariable int id){
        return creationService.getCreationById(id);
    }

    @GetMapping("/client/{id}")
    public List<Creation> getCreationByClientId(@PathVariable int id){
        return creationService.getAllCreationsFromClient(id);
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<CreationResponse>> getMyFavorites(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        Long clientId = getUserIdFromEmail(email);
        List<CreationResponse> favorites = creationService.getFavoritesFromClient(clientId);
        return ResponseEntity.ok(favorites);
    }

    @PostMapping
    public ResponseEntity<CreationResponse> createCreation(
            @RequestBody CreationRequest request,
            Authentication authentication
    ) {
        // Ahora siempre requerimos autenticación
        if (authentication == null) {
            logger.warn("createCreation called without authentication - request rejected");
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        logger.info("createCreation called by {} with request name='{}' type='{}' fav={}", email, request.getName(), request.getCreationType(), request.getIsFavourite());
        CreationResponse response = creationService.createCreation(request, email);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCreation(
            @PathVariable int id,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        Long clientId = getUserIdFromEmail(email);

        logger.info("deleteCreation called by {} for creation id={}", email, id);
        creationService.deleteCreation(id, clientId);

        return ResponseEntity.noContent().build();
    }

    // Helper method - obtiene el ID del cliente desde su email
    private Long getUserIdFromEmail(String email) {
    return clientRepository.findByEmail(email)
        .map(Client::getUserId)
        .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Client not found with email: " + email));
    }
}
