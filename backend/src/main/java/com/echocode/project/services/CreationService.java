package com.echocode.project.services;

import com.echocode.project.dto.CreationRequest;
import com.echocode.project.dto.CreationResponse;
import com.echocode.project.entities.Client;
import com.echocode.project.entities.Creation;
import com.echocode.project.entities.CreationType;
import com.echocode.project.entities.Ingredient;
import com.echocode.project.exceptions.CreationNotFoundException;
import com.echocode.project.repositories.ClientRepository;
import com.echocode.project.repositories.CreationRepository;
import com.echocode.project.repositories.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CreationService {

    @Autowired
    private CreationRepository creationRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    public List<Creation> getAllCreations() {
        return creationRepository.findAll();
    }

    public List<Creation> getAllCreationsFromClient(long clientId) {
        return creationRepository.findAllByOwner_UserId(clientId);
    }

    public List<CreationResponse> getFavoritesFromClient(long clientId) {
        List<Creation> favorites = creationRepository.findAllByOwner_UserIdAndIsFavouriteTrue(clientId);
        return favorites.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Creation getCreationById(int creationId) throws CreationNotFoundException {
        if (!existsCreationById(creationId))
            throw new CreationNotFoundException("No creation found with ID: " + creationId + ".");

        return creationRepository.getCreationByCreationId(creationId);
    }

    public CreationResponse createCreation(CreationRequest request, String email) {
        // Buscar el cliente por email
    Client client = clientRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));

        // Validar ingredientIds
        if (request.getIngredientIds() == null || request.getIngredientIds().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ingredientIds is required");

        // Buscar los ingredientes
        List<Ingredient> ingredients = ingredientRepository.findAllById(request.getIngredientIds());

        // Crear la Creation
        CreationType type;
        try {
            type = CreationType.valueOf(request.getCreationType());
        } catch (IllegalArgumentException | NullPointerException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid creation type: " + request.getCreationType());
        }

        Creation creation = Creation.builder()
                .name(request.getName())
                .creationType(type)
                .isFavourite(Boolean.TRUE.equals(request.getIsFavourite())) // Maneja null como false
                .owner(client)
                .ingredients(ingredients)
                .build();

        Creation savedCreation = creationRepository.save(creation);

        return mapToResponse(savedCreation);
    }

    // ELIMINADO: Ya no permitimos crear creaciones sin owner
    // Todas las creaciones deben tener un usuario autenticado

    public Creation addCreation(Creation creation) {
        return creationRepository.save(creation);
    }

    public boolean existsCreationById(int creationId) {
        return creationRepository.existsById(creationId);
    }

    public void deleteCreation(int creationId, long clientId) {
        Creation creation = creationRepository.findById(creationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Creation not found"));

        // Verificar que la creación pertenezca al cliente
        if (creation.getOwner() == null || creation.getOwner().getUserId() != clientId) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete this creation");
        }

        creationRepository.delete(creation);
    }

    private CreationResponse mapToResponse(Creation creation) {
        double totalPrice = creation.getIngredients().stream()
                .mapToDouble(Ingredient::getPrice)
                .sum();

        return CreationResponse.builder()
                .creationId(creation.getCreationId())
                .name(creation.getName())
                .creationType(creation.getCreationType().name())
                .isFavourite(creation.isFavourite())
                .ingredients(creation.getIngredients())
                .totalPrice(totalPrice)
                .build();
    }
}
