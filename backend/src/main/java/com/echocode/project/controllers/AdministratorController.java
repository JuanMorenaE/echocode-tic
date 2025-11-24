package com.echocode.project.controllers;

import com.echocode.project.dto.AdministratorRequest;
import com.echocode.project.dto.FuncionarioRequest;
import com.echocode.project.entities.Administrator;
import com.echocode.project.entities.Product;
import com.echocode.project.entities.User;
import com.echocode.project.exceptions.ForbiddenException;
import com.echocode.project.repositories.AdministratorRepository;
import com.echocode.project.repositories.ClientRepository;
import com.echocode.project.services.AdministratorService;
import com.echocode.project.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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
    private ResponseEntity<List<AdministratorRequest>> getAll() {
        return ResponseEntity.ok().body(administratorService.getAdministrators());
    }

    @PostMapping("/create")
    private ResponseEntity<Administrator> create(@AuthenticationPrincipal UserDetails user, @RequestBody FuncionarioRequest funcionarioRequest)
    {
        checkAdmin(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(administratorService.create(funcionarioRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdministratorRequest> update(@AuthenticationPrincipal UserDetails user, @RequestBody AdministratorRequest administrator) {
        checkAdmin(user);

        AdministratorRequest updatedAdministrator = administratorService.update(administrator);
        return ResponseEntity.ok(updatedAdministrator);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        checkAdmin(user);

        administratorService.delete(id);
        return ResponseEntity.noContent().build();
    }

    public void checkAdmin(UserDetails userDetails) {
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));

        if (!isAdmin) {
            throw new ForbiddenException("You are not allowed to access this resource");
        }
    }
}
