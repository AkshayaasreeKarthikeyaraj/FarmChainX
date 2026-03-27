package com.farmchainX.farmchainX.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long supplierId;

    @Column(nullable = false)
    private Long retailerId;

    private Long productId; // Link to the product being ordered

    private int items; // Number of items

    private double totalAmount;

    @Column(nullable = false)
    private String status; // PENDING, PROCESSING, SHIPPED, DELIVERED

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
