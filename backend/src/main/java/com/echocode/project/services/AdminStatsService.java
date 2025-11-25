package com.echocode.project.services;

import com.echocode.project.dto.AdminStatsResponse;
import com.echocode.project.entities.Order;
import com.echocode.project.entities.OrderStatus;
import com.echocode.project.repositories.ClientRepository;
import com.echocode.project.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminStatsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ClientRepository clientRepository;

    public AdminStatsResponse getStats() {
        // Get all orders
        List<Order> allOrders = orderRepository.findAll();

        // Filter only delivered orders for stats
        List<Order> deliveredOrdersList = allOrders.stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.DELIVERED)
                .collect(Collectors.toList());

        // Calculate total sales (sum of DELIVERED order totals only)
        Double totalSales = deliveredOrdersList.stream()
                .mapToDouble(Order::getTotal)
                .sum();

        // Count total DELIVERED orders
        Integer totalOrders = deliveredOrdersList.size();

        // Count total clients
        Integer totalClients = (int) clientRepository.count();

        // Get delivered orders (most recent first, limit 10)
        List<AdminStatsResponse.DeliveredOrderDto> deliveredOrders = deliveredOrdersList.stream()
                .sorted((o1, o2) -> o2.getOrderDate().compareTo(o1.getOrderDate()))
                .limit(10)
                .map(order -> AdminStatsResponse.DeliveredOrderDto.builder()
                        .orderId(order.getOrderId())
                        .clientName(order.getOwner().getFirstName() + " " + order.getOwner().getLastName())
                        .total(order.getTotal())
                        .orderDate(order.getOrderDate())
                        .build())
                .collect(Collectors.toList());

        return AdminStatsResponse.builder()
                .totalSales(totalSales)
                .totalOrders(totalOrders)
                .totalClients(totalClients)
                .deliveredOrders(deliveredOrders)
                .build();
    }
}
