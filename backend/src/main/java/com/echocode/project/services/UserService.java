package com.echocode.project.services;

import com.echocode.project.dto.AuthResponse;
import com.echocode.project.dto.UpdateProfileRequest;
import com.echocode.project.entities.Client;
import com.echocode.project.entities.User;
import com.echocode.project.repositories.ClientRepository;
import com.echocode.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public AuthResponse updateProfile(long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Actualizar campos
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            // Verificar que el email no esté en uso por otro usuario
            if (!user.getEmail().equals(request.getEmail())) {
                boolean emailExists = userRepository.existsByEmail((request.getEmail()));
                if (emailExists) {
                    throw new RuntimeException("Email already in use");
                }
                user.setEmail(request.getEmail());
            }
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getCedula() != null) {
            user.setDocument(request.getCedula());
        }
        if (user instanceof Client client && request.getBirthdate() != null && !request.getBirthdate().isEmpty()) {
            try {
                LocalDate birthdate = LocalDate.parse(request.getBirthdate(), DateTimeFormatter.ISO_LOCAL_DATE);
                client.setBirthdate(birthdate);
            } catch (DateTimeParseException e) {
                throw new RuntimeException("Invalid birthdate format. Use yyyy-MM-dd");
            }
        }

        user = userRepository.save(user);

        // Formatear birthdate para la respuesta
        String birthdateStr = null;
        if (user instanceof Client client && client.getBirthdate() != null) {
            birthdateStr = client.getBirthdate().toString();
        }

        return AuthResponse.builder()
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .cedula(user.getDocument())
                .birthdate(birthdateStr)
                .message("Profile updated successfully")
                .build();
    }
}
