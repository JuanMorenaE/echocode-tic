package com.echocode.project.services;

import com.echocode.project.dto.AuthResponse;
import com.echocode.project.dto.LoginRequest;
import com.echocode.project.dto.RegisterRequest;
import com.echocode.project.entities.Administrator;
import com.echocode.project.entities.Client;
import com.echocode.project.repositories.AdministratorRepository;
import com.echocode.project.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Service
public class AuthService {

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
        if (clientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Parsear birthdate si existe
        Date birthdate = null;
        if (request.getBirthdate() != null && !request.getBirthdate().isEmpty()) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                birthdate = sdf.parse(request.getBirthdate());
            } catch (Exception e) {
                throw new RuntimeException("Invalid birthdate format. Use yyyy-MM-dd");
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

        clientRepository.save(client);

        // Generar token con role CLIENT
        String jwtToken = jwtService.generateToken(new java.util.HashMap<>(), client.getEmail(), client.getUserId(), "CLIENT");

        // Formatear birthdate para la respuesta
        String birthdateStr = null;
        if (client.getBirthdate() != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            birthdateStr = sdf.format(client.getBirthdate());
        }

        return AuthResponse.builder()
                .token(jwtToken)
                .email(client.getEmail())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .phoneNumber(client.getPhoneNumber())
                .cedula(client.getDocument())
                .birthdate(birthdateStr)
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

        // Intentar buscar como administrador primero
        var adminOptional = administratorRepository.findByEmail(request.getEmail());
        if (adminOptional.isPresent()) {
            Administrator admin = adminOptional.get();
            String jwtToken = jwtService.generateToken(new java.util.HashMap<>(), admin.getEmail(), admin.getUserId(), "ADMIN");

            return AuthResponse.builder()
                    .token(jwtToken)
                    .email(admin.getEmail())
                    .firstName(admin.getFirstName())
                    .lastName(admin.getLastName())
                    .phoneNumber(admin.getPhoneNumber())
                    .cedula(admin.getDocument())
                    .role("ADMIN")
                    .message("Login successful")
                    .build();
        }

        // Si no es admin, buscar como cliente
        Client client = clientRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generar token con role CLIENT
        String jwtToken = jwtService.generateToken(new java.util.HashMap<>(), client.getEmail(), client.getUserId(), "CLIENT");

        // Formatear birthdate para la respuesta
        String birthdateStr = null;
        if (client.getBirthdate() != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            birthdateStr = sdf.format(client.getBirthdate());
        }

        return AuthResponse.builder()
                .token(jwtToken)
                .email(client.getEmail())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .phoneNumber(client.getPhoneNumber())
                .cedula(client.getDocument())
                .birthdate(birthdateStr)
                .role("CLIENT")
                .message("Login successful")
                .build();
    }
}