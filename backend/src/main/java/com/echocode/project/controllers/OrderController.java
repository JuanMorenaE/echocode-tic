package com.echocode.project.controllers;

import com.echocode.project.dto.OrderRequest;
import com.echocode.project.dto.OrderResponse;
import com.echocode.project.repositories.AdministratorRepository;
import com.echocode.project.services.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AdministratorRepository administratorRepository;

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> createOrder(
            @RequestBody OrderRequest request,
            Authentication authentication
    ) {
        if (authentication == null) {
            logger.warn("createOrder called without authentication - request rejected");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();
        logger.info("createOrder called by {} with {} creations and {} products",
                email,
                request.getCreationIds() != null ? request.getCreationIds().size() : 0,
                request.getProducts() != null ? request.getProducts().size() : 0);

        OrderResponse response = orderService.createOrder(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable int id,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();
        OrderResponse response = orderService.getOrderById(id, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();
        List<OrderResponse> orders = orderService.getOrdersByClient(email);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders(Authentication authentication) {
        if (authentication == null) {
            logger.warn("getAllOrders called without authentication - request rejected");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();

        // Verificar que el usuario sea administrador
        boolean isAdmin = administratorRepository.existsByEmail(email);
        if (!isAdmin) {
            logger.warn("getAllOrders called by non-admin user: {}", email);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        logger.info("getAllOrders called by admin: {}", email);
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> body,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String newStatus = body.get("status");
        if (newStatus == null || newStatus.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        logger.info("updateOrderStatus called for order {} with new status {}",
                id, newStatus);

        OrderResponse response = orderService.updateOrderStatus(id, newStatus);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/orders/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable int id,
            Authentication authentication
    ) {
        if (authentication == null) {
            logger.warn("cancelOrder called without authentication - request rejected");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();
        logger.info("cancelOrder called by {} for order {}", email, id);

        OrderResponse response = orderService.cancelOrder(id, email);
        return ResponseEntity.ok(response);
    }
}
