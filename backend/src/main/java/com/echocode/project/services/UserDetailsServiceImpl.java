package com.echocode.project.services;

import com.echocode.project.entities.Administrator;
import com.echocode.project.entities.Client;
import com.echocode.project.repositories.AdministratorRepository;
import com.echocode.project.repositories.ClientRepository;
import com.echocode.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.echocode.project.entities.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        String role = user instanceof Administrator ? "ADMIN" : "CLIENT";

        return User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(role)
                .build();
    }

    /**
     * Carga UserDetails a partir del id del usuario (userId).
     */
    public UserDetails loadUserById(Long id) throws UsernameNotFoundException {
        com.echocode.project.entities.User user = userRepository.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));

        String role = user instanceof Administrator ? "ADMIN" : "CLIENT";

        return User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(role)
                .build();
    }
}