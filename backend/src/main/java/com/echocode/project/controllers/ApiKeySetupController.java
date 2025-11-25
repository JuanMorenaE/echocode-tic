package com.echocode.project.controllers;

import com.echocode.project.entities.ApiKey;
import com.echocode.project.repositories.ApiKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * TEMPORARY Controller for API Key Setup
 *
 * This controller should be REMOVED after initial setup in production
 *
 * Use this to generate and insert API keys for external systems
 */
@RestController
@RequestMapping("/api/v1/setup")
public class ApiKeySetupController {

    @Autowired
    private ApiKeyRepository apiKeyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Generate and insert all 3 API keys at once
     *
     * Call this endpoint ONCE to setup all external API keys
     *
     * Example: POST http://localhost:8080/api/v1/setup/generate-all-keys
     */
    @PostMapping("/generate-all-keys")
    public ResponseEntity<Map<String, Object>> generateAllKeys() {
        Map<String, Object> response = new HashMap<>();

        // Check if keys already exist
        if (apiKeyRepository.findByKeyNameAndActiveTrue("PAYMENT_SYSTEM").isPresent()) {
            response.put("error", "API keys already exist. Delete existing keys first or use /regenerate endpoint.");
            return ResponseEntity.badRequest().body(response);
        }

        // Generate unique keys
        String paymentKey = "payment_prod_2025_" + UUID.randomUUID().toString().substring(0, 16);
        String dgiKey = "dgi_prod_2025_" + UUID.randomUUID().toString().substring(0, 16);
        String bpsKey = "bps_prod_2025_" + UUID.randomUUID().toString().substring(0, 16);

        // Hash the keys
        String paymentHash = passwordEncoder.encode(paymentKey);
        String dgiHash = passwordEncoder.encode(dgiKey);
        String bpsHash = passwordEncoder.encode(bpsKey);

        // Create and save API keys
        ApiKey paymentApiKey = ApiKey.builder()
                .keyName("PAYMENT_SYSTEM")
                .keyHash(paymentHash)
                .active(true)
                .description("API Key para sistema de procesamiento de pagos")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusYears(1))
                .build();

        ApiKey dgiApiKey = ApiKey.builder()
                .keyName("DGI")
                .keyHash(dgiHash)
                .active(true)
                .description("API Key para Dirección General Impositiva")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusYears(1))
                .build();

        ApiKey bpsApiKey = ApiKey.builder()
                .keyName("BPS")
                .keyHash(bpsHash)
                .active(true)
                .description("API Key para Banco de Previsión Social")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusYears(1))
                .build();

        apiKeyRepository.save(paymentApiKey);
        apiKeyRepository.save(dgiApiKey);
        apiKeyRepository.save(bpsApiKey);

        // Prepare response with plain keys (SAVE THESE SECURELY!)
        Map<String, String> keys = new HashMap<>();
        keys.put("PAYMENT_SYSTEM", paymentKey);
        keys.put("DGI", dgiKey);
        keys.put("BPS", bpsKey);

        response.put("success", true);
        response.put("message", "API keys generated and saved successfully!");
        response.put("keys", keys);
        response.put("warning", "IMPORTANT: Save these keys securely. They cannot be retrieved again!");
        response.put("note", "Use these keys in the X-API-Key header when calling external APIs");

        return ResponseEntity.ok(response);
    }

    /**
     * List all API keys (without showing the actual keys)
     */
    @GetMapping("/list-keys")
    public ResponseEntity<Map<String, Object>> listKeys() {
        var allKeys = apiKeyRepository.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("count", allKeys.size());
        response.put("keys", allKeys.stream().map(key -> Map.of(
            "id", key.getId(),
            "keyName", key.getKeyName(),
            "active", key.isActive(),
            "description", key.getDescription() != null ? key.getDescription() : "",
            "createdAt", key.getCreatedAt().toString(),
            "expiresAt", key.getExpiresAt() != null ? key.getExpiresAt().toString() : "never",
            "lastUsedAt", key.getLastUsedAt() != null ? key.getLastUsedAt().toString() : "never used"
        )).toList());

        return ResponseEntity.ok(response);
    }

    /**
     * Delete all API keys (for testing/reset purposes)
     */
    @DeleteMapping("/delete-all-keys")
    public ResponseEntity<Map<String, String>> deleteAllKeys() {
        apiKeyRepository.deleteAll();

        Map<String, String> response = new HashMap<>();
        response.put("success", "true");
        response.put("message", "All API keys deleted");

        return ResponseEntity.ok(response);
    }
}
