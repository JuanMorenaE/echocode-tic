package com.echocode.project.services;

import com.echocode.project.dto.AuthResponse;
import com.echocode.project.dto.LoginRequest;
import com.echocode.project.dto.RegisterRequest;
import com.echocode.project.entities.Administrator;
import com.echocode.project.entities.Client;
import com.echocode.project.entities.User;
import com.echocode.project.repositories.AdministratorRepository;
import com.echocode.project.repositories.ClientRepository;
import com.echocode.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AdministratorRepository administratorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {

        // Verificar si el email ya existe
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Verificar si el documento ya existe
        if (userRepository.findByDocument(request.getCedula()).isPresent()) {
            throw new RuntimeException("Document already registered");
        }

        // Parsear birthdate si existe
        LocalDate birthdate = null;
        if (request.getBirthdate() != null && !request.getBirthdate().isEmpty()) {
            try {
                birthdate = LocalDate.parse(request.getBirthdate());
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid birthdate format (yyyy-MM-dd)");
            }
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
                .birthdate(birthdate)
                .build();

        userRepository.save(client);

        try {
            userRepository.save(client);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error");
        }

        // Generar token con role CLIENT
        String jwtToken = jwtService.generateToken(
                new HashMap<>(),
                client.getEmail(),
                client.getUserId(),
                "CLIENT"
        );

        return AuthResponse.builder()
                .token(jwtToken)
                .email(client.getEmail())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .phoneNumber(client.getPhoneNumber())
                .cedula(client.getDocument())
                .birthdate(birthdate != null ? birthdate.toString() : null)
                .role("CLIENT")
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

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = user instanceof Administrator ? "ADMIN" : "CLIENT";

        // Generar token.
        String jwtToken = jwtService.generateToken(
                new HashMap<>(),
                user.getEmail(),
                user.getUserId(),
                role
        );

        AuthResponse.AuthResponseBuilder response = AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .cedula(user.getDocument())
                .role(role)
                .message("Login successful");

        // Formatear birthdate para la respuesta solo si es Cliente.
        if (user instanceof Client client){
            LocalDate birthdate = client.getBirthdate();
            response.birthdate(birthdate != null ? birthdate.toString() : null);
        }

        return response.build();
    }
}