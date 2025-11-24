package com.echocode.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.core.userdetails.UserDetailsService;

@Slf4j
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authenticationProvider) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(http))
                .authorizeHttpRequests(auth -> auth
                        // Auth endpoints - public
                        .requestMatchers("/api/v1/auth/**").permitAll()

                        // Setup endpoints - public (TEMPORARY - remove in production)
                        .requestMatchers("/api/v1/setup/**").permitAll()

                        // External API endpoints - authenticated via API key (handled by ApiKeyAuthenticationFilter)
                        .requestMatchers("/api/v1/external/**").permitAll()

                        // Categories - public read, authenticated write
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                        .requestMatchers("/api/v1/categories/**").authenticated()

                        // Ingredients - public read for browse, authenticated write
                        .requestMatchers(HttpMethod.GET, "/api/v1/ingredients/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/ingredients/type").permitAll()
                        .requestMatchers("/api/v1/ingredients/**").authenticated()

                        // Products - public read, authenticated write
                        .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                        .requestMatchers("/api/v1/products/**").authenticated()

                        // Creations - require authentication (users create their own)
                        .requestMatchers(HttpMethod.GET, "/api/v1/creations/**").permitAll()
                        .requestMatchers("/api/v1/creations/**").authenticated()

                        // Addresses, Cards, Orders - require authentication
                        .requestMatchers("/api/v1/addresses/**").authenticated()
                        .requestMatchers("/api/v1/cards/**").authenticated()
                        .requestMatchers("/api/v1/orders/**").authenticated()
                        .requestMatchers("/api/v1/users/**").authenticated()

                        // Admin endpoints - require authentication (role check in controller)
                        .requestMatchers("/api/v1/admin/**").authenticated()
                        .requestMatchers("/api/v1/administrator/**").authenticated()

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(apiKeyAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }
}