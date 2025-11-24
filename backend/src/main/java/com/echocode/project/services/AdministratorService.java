package com.echocode.project.services;

import com.echocode.project.dto.AddressResponse;
import com.echocode.project.dto.AdministratorRequest;
import com.echocode.project.dto.FuncionarioRequest;
import com.echocode.project.entities.Address;
import com.echocode.project.entities.Administrator;
import com.echocode.project.entities.Product;
import com.echocode.project.entities.User;
import com.echocode.project.repositories.AddressRepository;
import com.echocode.project.repositories.AdministratorRepository;
import com.echocode.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdministratorService {

    @Autowired
    private AdministratorRepository administratorRepository;

    @Autowired
    private AddressService addressService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public List<AdministratorRequest> getAdministrators(){
        List<Administrator> administrators = administratorRepository.findAll();
        List<AdministratorRequest> administratorRequests = new ArrayList<>();

        for(Administrator administrator : administrators){
            List<AddressResponse> adminAddresses = addressService.getAllAddressesByUser(administrator.getUserId());
            AddressResponse address = adminAddresses.isEmpty() ? null : adminAddresses.getFirst();

            administratorRequests.add(
                    AdministratorRequest.builder()
                            .id(administrator.getUserId())
                            .document(administrator.getDocument())
                            .firstName(administrator.getFirstName())
                            .lastName(administrator.getLastName())
                            .email(administrator.getEmail())
                            .phoneNumber(administrator.getPhoneNumber())
                            .address(address)
                            .build()
            );
        }

        return administratorRequests;
    }

    public Administrator create(FuncionarioRequest funcionarioRequest){
        System.out.println(funcionarioRequest.getDocument());
        Administrator administrator = Administrator.builder()
                .document(funcionarioRequest.getDocument())
                .firstName(funcionarioRequest.getFirstName())
                .lastName(funcionarioRequest.getLastName())
                .phoneNumber(funcionarioRequest.getPhoneNumber())
                .email(funcionarioRequest.getEmail())
                .passwordHash(passwordEncoder.encode(funcionarioRequest.getPassword()))
                .build();

        return administratorRepository.save(administrator);
    }

    public AdministratorRequest update(AdministratorRequest request) {
        Administrator admin = administratorRepository.findById(request.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Administrator not found."));

        // Validar email único
        if (request.getEmail() != null && !request.getEmail().equals(admin.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already in use.");
            }
            admin.setEmail(request.getEmail());
        }

        // Validar documento único
        if (request.getDocument() != null && !request.getDocument().equals(admin.getDocument())) {
            if (userRepository.findByDocument(request.getDocument()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Document already in use.");
            }
            admin.setDocument(request.getDocument());
        }

        // Nombres
        if (request.getFirstName() != null)
            admin.setFirstName(request.getFirstName());

        if (request.getLastName() != null)
            admin.setLastName(request.getLastName());

        // Teléfono
        if (request.getPhoneNumber() != null)
            admin.setPhoneNumber(request.getPhoneNumber());

        // Password → hashear si lo envía
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            admin.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        Administrator saved = administratorRepository.save(admin);

        return AdministratorRequest.builder()
                .id(saved.getUserId())
                .email(saved.getEmail())
                .document(saved.getDocument())
                .firstName(saved.getFirstName())
                .lastName(saved.getLastName())
                .phoneNumber(saved.getPhoneNumber())
                .build();
    }
}
