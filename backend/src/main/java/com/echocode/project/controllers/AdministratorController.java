package com.echocode.project.controllers;

import com.echocode.project.dto.AdministratorRequest;
import com.echocode.project.dto.AuthResponse;
import com.echocode.project.dto.UpdateProfileRequest;
import com.echocode.project.entities.Administrator;
import com.echocode.project.entities.Client;
import com.echocode.project.entities.User;
import com.echocode.project.repositories.AdministratorRepository;
import com.echocode.project.repositories.ClientRepository;
import com.echocode.project.services.AdministratorService;
import com.echocode.project.services.UserService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;

import java.util.List;

@RestController
@RequestMapping("api/v1/administrator")
public class AdministratorController {

    @Autowired
    private UserService userService;

    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private AdministratorService administratorService;
    @Autowired
    private AdministratorRepository administratorRepository;

    @GetMapping
    private ResponseEntity<List<AdministratorRequest>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok().body(administratorService.getAdministrators(user));
    }

    @PostMapping("/create")
    private ResponseEntity<Administrator> create(@AuthenticationPrincipal User user, AdministratorRequest administratorRequest) {
        if (administratorRepository.getAdministratorByEmail((user.getEmail())).isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        return ResponseEntity.status(HttpStatus.CREATED).body(administratorService.create(administratorRequest));
    }
}
