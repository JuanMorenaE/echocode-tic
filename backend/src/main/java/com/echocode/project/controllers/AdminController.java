package com.echocode.project.controllers;

import com.echocode.project.entities.Administrator;
import com.echocode.project.repositories.AdministratorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @Autowired
    private AdministratorRepository administratorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Endpoint temporal para crear un administrador.
     * IMPORTANTE: Este endpoint debería estar protegido o eliminarse en producción.
     */

}
