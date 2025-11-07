package com.echocode.project.services;

import com.echocode.project.entities.Administrator;
import com.echocode.project.entities.Client;
import com.echocode.project.repositories.AdministratorRepository;
import com.echocode.project.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AdministratorRepository administratorRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Intentar buscar como administrador primero
        var adminOptional = administratorRepository.findByEmail(email);
        if (adminOptional.isPresent()) {
            Administrator admin = adminOptional.get();
            return User.builder()
                    .username(admin.getEmail())
                    .password(admin.getPasswordHash())
                    .authorities(new ArrayList<>())
                    .build();
        }

        // Si no es admin, buscar como cliente
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return User.builder()
                .username(client.getEmail())
                .password(client.getPasswordHash())
                .authorities(new ArrayList<>())
                .build();
    }

    /**
     * Carga UserDetails a partir del id del usuario (userId).
     * Primero intenta en administrators, luego en clients.
     */
    public UserDetails loadUserById(Long id) throws UsernameNotFoundException {
        // Intentar buscar como administrador primero
        var adminOptional = administratorRepository.findById(id);
        if (adminOptional.isPresent()) {
            Administrator admin = adminOptional.get();
            return User.builder()
                    .username(admin.getEmail())
                    .password(admin.getPasswordHash())
                    .authorities(new ArrayList<>())
                    .build();
        }

        // Si no es admin, buscar como cliente
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));

        return User.builder()
                .username(client.getEmail())
                .password(client.getPasswordHash())
                .authorities(new ArrayList<>())
                .build();
    }
}