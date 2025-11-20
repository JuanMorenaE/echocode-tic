package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "api_access_logs")
@Getter @Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApiAccessLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String systemName; // e.g., "PAYMENT_SYSTEM", "DGI", "BPS"

    @Column(nullable = false, length = 255)
    private String endpoint;

    @Column(length = 10)
    private String method; // GET, POST, etc.

    @Column(columnDefinition = "TEXT")
    private String requestParams;

    private Integer responseStatus;

    @Column(nullable = false)
    private LocalDateTime accessedAt;

    @Column(length = 45)
    private String ipAddress;

    @PrePersist
    protected void onCreate() {
        if (accessedAt == null) {
            accessedAt = LocalDateTime.now();
        }
    }
}
