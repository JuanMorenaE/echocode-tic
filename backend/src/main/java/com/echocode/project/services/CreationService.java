package com.echocode.project.services;

import com.echocode.project.entities.Creation;
import com.echocode.project.exceptions.CreationNotFoundException;
import com.echocode.project.repositories.CreationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreationService {

    @Autowired
    private CreationRepository creationRepository;

    public List<Creation> getAllCreations() {
        return creationRepository.findAll();
    }

    public List<Creation> getAllCreationsFromClient(long clientId) {
        return creationRepository.findAllByOwner_UserId(clientId);
    }

    public Creation getCreationById(int creationId) throws CreationNotFoundException {
        if (existsCreationById(creationId))
            throw new CreationNotFoundException("No creation found with ID: " + creationId + ".");

        return creationRepository.getCreationByCreationId(creationId);
    }

    public Creation addCreation(Creation creation) {
        return creationRepository.save(creation);
    }

    public boolean existsCreationById(int creationId) {
        return creationRepository.existsById(creationId);
    }
}
