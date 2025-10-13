package com.echocode.project.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private int orderId;

    @Column(name = "order_hash", unique = true)
    private String orderHash;

    @Column(name = "client_id")
    private int clientId;

    @OneToOne
    @JoinColumn(name = "CLIENT_ID", insertable = false, updatable = false)
    private Client client;

    @ElementCollection
    @CollectionTable(name = "order_products", joinColumns = @JoinColumn(name = "order_id"))
    @Column(name = "product_id")
    private List<Integer> productsList;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "order_date")
    private Date orderDate;

    @Column(name = "order_status")
    private Order_status orderStatus;

    @Column(name = "total")
    private double total;


}

enum Order_status {
    QUEUED,
    PREPARING,
    ON_THE_WAY,
    DELIVERED,
    CANCELLED,
}

