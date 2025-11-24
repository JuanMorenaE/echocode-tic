package com.echocode.project.controllers;

import com.echocode.project.dto.AddressRequest;
import com.echocode.project.dto.AddressResponse;
import com.echocode.project.entities.Client;
import com.echocode.project.repositories.ClientRepository;
import com.echocode.project.services.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getAllAddresses(Authentication authentication) {
        try {
            long userId = getUserIdFromAuth(authentication);
            List<AddressResponse> addresses = addressService.getAllAddressesByUser(userId);
            return ResponseEntity.ok(addresses);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> getAddressById(
            @PathVariable long id,
            Authentication authentication) {
        try {
            long userId = getUserIdFromAuth(authentication);
            AddressResponse address = addressService.getAddressById(userId, id);
            return ResponseEntity.ok(address);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createAddress(
            @RequestBody AddressRequest request,
            Authentication authentication) {
        try {
            long userId = getUserIdFromAuth(authentication);
            AddressResponse address = addressService.createAddress(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(address);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable long id,
            @RequestBody AddressRequest request,
            Authentication authentication) {
        try {
            long userId = getUserIdFromAuth(authentication);
            AddressResponse address = addressService.updateAddress(userId, id, request);
            return ResponseEntity.ok(address);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable long id,
            Authentication authentication) {
        try {
            long userId = getUserIdFromAuth(authentication);
            addressService.deleteAddress(userId, id);
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
