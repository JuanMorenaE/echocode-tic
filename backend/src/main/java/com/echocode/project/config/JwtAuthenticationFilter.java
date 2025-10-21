package com.echocode.project.config;

import com.echocode.project.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Si no hay header Authorization o no empieza con "Bearer ", continuar
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extraer el token (remover "Bearer " del inicio)
        jwt = authHeader.substring(7);

        try {
            // Intentamos extraer un claim inmutable userId (si el token lo trae)
            Long userId = jwtService.extractClaim(jwt, claims -> {
                Object v = claims.get("userId");
                if (v instanceof Number) return ((Number) v).longValue();
                if (v instanceof String) {
                    try { return Long.parseLong((String) v); } catch (Exception ex) { return null; }
                }
                return null;
            });

            // Si hay userId y no hay autenticación establecida, intentar cargar por id
            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = null;
                try {
                    // Intentar llamar al método específico (impl) para cargar por id
                    if (this.userDetailsService instanceof com.echocode.project.services.UserDetailsServiceImpl) {
                        userDetails = ((com.echocode.project.services.UserDetailsServiceImpl) this.userDetailsService).loadUserById(userId);
                    }
                } catch (Exception ex) {
                    logger.debug("Cannot load user by id {}: {}");
                }

                // Si logramos userDetails y token es válido respecto al username, autenticar
                if (userDetails != null && jwtService.isTokenValid(jwt, userDetails.getUsername())) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            // Si no se autenticó por userId, fallback a email (compatibilidad hacia atrás)
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                userEmail = jwtService.extractEmail(jwt);
                if (userEmail != null) {
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                    if (jwtService.isTokenValid(jwt, userDetails.getUsername())) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
        } catch (Exception e) {
            // Si hay algún error al procesar el token, simplemente continuar sin autenticar
            logger.error("Cannot set user authentication: {}", e);
        }

        filterChain.doFilter(request, response);
    }
}
