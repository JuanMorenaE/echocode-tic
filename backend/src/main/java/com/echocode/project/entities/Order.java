package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Builder
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int orderId;

    @Column(length = 36)
    private String orderHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clientId", insertable = false, updatable = false)
    private Client client;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "order_creations", joinColumns = @JoinColumn(name = "orderId"), inverseJoinColumns = @JoinColumn(name = "creationId"))
    private List<Creation> creations;

    @NonNull
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime orderDate;

    @NonNull
    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private double total;


}

enum OrderStatus {
    QUEUED,
    PREPARING,
    ON_THE_WAY,
    DELIVERED,
    CANCELLED,
}

