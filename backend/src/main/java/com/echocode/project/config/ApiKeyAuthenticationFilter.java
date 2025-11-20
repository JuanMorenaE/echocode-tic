package com.echocode.project.config;

import com.echocode.project.entities.ApiKey;
import com.echocode.project.repositories.ApiKeyRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;

@Component
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

    private static final String API_KEY_HEADER = "X-API-Key";
    private static final String EXTERNAL_API_PATH = "/api/v1/external/";

    private final ApiKeyRepository apiKeyRepository;
    private final PasswordEncoder passwordEncoder;

    public ApiKeyAuthenticationFilter(ApiKeyRepository apiKeyRepository, PasswordEncoder passwordEncoder) {
        this.apiKeyRepository = apiKeyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestPath = request.getRequestURI();

        // Only process external API requests
        if (!requestPath.startsWith(EXTERNAL_API_PATH)) {
            filterChain.doFilter(request, response);
            return;
        }

        String apiKeyHeader = request.getHeader(API_KEY_HEADER);

        if (apiKeyHeader == null || apiKeyHeader.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"API Key is required\"}");
            return;
        }

        // Determine system name from path
        String systemName = extractSystemNameFromPath(requestPath);

        if (systemName == null) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("{\"error\": \"Invalid external API endpoint\"}");
            return;
        }

        // Validate API key
        ApiKey apiKey = apiKeyRepository.findByKeyNameAndActiveTrue(systemName).orElse(null);

        if (apiKey == null) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("{\"error\": \"Invalid API Key for system\"}");
            return;
        }

        // Check if key matches
        if (!passwordEncoder.matches(apiKeyHeader, apiKey.getKeyHash())) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Invalid API Key\"}");
            return;
        }

        // Check expiration
        if (apiKey.getExpiresAt() != null && apiKey.getExpiresAt().isBefore(LocalDateTime.now())) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"API Key has expired\"}");
            return;
        }

        // Update last used timestamp
        apiKey.setLastUsedAt(LocalDateTime.now());
        apiKeyRepository.save(apiKey);

        // Set authentication context
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                systemName,
                null,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_EXTERNAL_API"))
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    private String extractSystemNameFromPath(String path) {
        if (path.startsWith("/api/v1/external/payment/")) {
            return "PAYMENT_SYSTEM";
        } else if (path.startsWith("/api/v1/external/dgi/")) {
            return "DGI";
        } else if (path.startsWith("/api/v1/external/bps/")) {
            return "BPS";
        }
        return null;
    }
}
