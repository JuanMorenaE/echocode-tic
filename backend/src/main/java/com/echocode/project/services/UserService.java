package com.echocode.project.services;

import com.echocode.project.dto.AuthResponse;
import com.echocode.project.dto.UpdateProfileRequest;
import com.echocode.project.entities.Client;
import com.echocode.project.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
public class UserService {

    @Autowired
    private ClientRepository clientRepository;

    @Transactional
    public AuthResponse updateProfile(long userId, UpdateProfileRequest request) {
        Client client = clientRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Actualizar campos
        if (request.getFirstName() != null) {
            client.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            client.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            // Verificar que el email no esté en uso por otro usuario
            if (!client.getEmail().equals(request.getEmail())) {
                boolean emailExists = clientRepository.existsByEmail(request.getEmail());
                if (emailExists) {
                    throw new RuntimeException("Email already in use");
                }
                client.setEmail(request.getEmail());
            }
        }
        if (request.getPhoneNumber() != null) {
            client.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getCedula() != null) {
            client.setDocument(request.getCedula());
        }
        if (request.getBirthdate() != null && !request.getBirthdate().isEmpty()) {
            try {
                LocalDate birthdate = LocalDate.parse(request.getBirthdate(), DateTimeFormatter.ISO_LOCAL_DATE);
                client.setBirthdate(birthdate);
            } catch (DateTimeParseException e) {
                throw new RuntimeException("Invalid birthdate format. Use yyyy-MM-dd");
            }
        }

        client = clientRepository.save(client);

        // Formatear birthdate para la respuesta
        String birthdateStr = null;
        if (client.getBirthdate() != null) {
            birthdateStr = client.getBirthdate().format(DateTimeFormatter.ISO_LOCAL_DATE);
        }

        return AuthResponse.builder()
                .email(client.getEmail())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .phoneNumber(client.getPhoneNumber())
                .cedula(client.getDocument())
                .birthdate(birthdateStr)
                .message("Profile updated successfully")
                .build();
    }
}
