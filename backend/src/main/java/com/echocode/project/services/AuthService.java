package com.echocode.project.services;

import com.echocode.project.dto.AuthResponse;
import com.echocode.project.dto.LoginRequest;
import com.echocode.project.dto.RegisterRequest;
import com.echocode.project.entities.Client;
import com.echocode.project.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Verificar si el email ya existe
        if (clientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Crear el cliente
        Client client = Client.builder()
                .userHash(UUID.randomUUID().toString())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .document(request.getCedula())
                .birthdate(request.getBirthdate())
                .build();

        clientRepository.save(client);

        // Generar token
        String jwtToken = jwtService.generateToken(client.getEmail());

        return AuthResponse.builder()
                .token(jwtToken)
                .email(client.getEmail())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .message("User registered successfully")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // Autenticar
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Buscar el cliente
        Client client = clientRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generar token
        String jwtToken = jwtService.generateToken(client.getEmail());

        return AuthResponse.builder()
                .token(jwtToken)
                .email(client.getEmail())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .message("Login successful")
                .build();
    }
}