package com.echocode.project.services;

import com.echocode.project.entities.Client;
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

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return User.builder()
                .username(client.getEmail())
                .password(client.getPasswordHash())
                .authorities(new ArrayList<>())
                .build();
    }

    /**
     * Carga UserDetails a partir del id del cliente (userId).
     */
    public UserDetails loadUserById(Long id) throws UsernameNotFoundException {
    Client client = clientRepository.findById(id)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));

    return User.builder()
        .username(client.getEmail())
        .password(client.getPasswordHash())
        .authorities(new ArrayList<>())
        .build();
    }
}