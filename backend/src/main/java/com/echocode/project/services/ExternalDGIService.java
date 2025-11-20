package com.echocode.project.services;

import com.echocode.project.dto.external.SalesTicketsResponse;
import com.echocode.project.entities.*;
import com.echocode.project.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExternalDGIService {

    @Autowired
    private OrderRepository orderRepository;

    public SalesTicketsResponse getSalesTickets(String date) {
        // Parse date
        LocalDate targetDate = LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);
        LocalDateTime startOfDay = targetDate.atStartOfDay();
        LocalDateTime endOfDay = targetDate.atTime(LocalTime.MAX);

        // Get all orders for the date
        List<Order> orders = orderRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.DELIVERED)
                .filter(order -> !order.getOrderDate().isBefore(startOfDay) && !order.getOrderDate().isAfter(endOfDay))
                .collect(Collectors.toList());

        // Calculate totals
        Integer totalOrders = orders.size();
        Double totalRevenue = orders.stream().mapToDouble(Order::getTotal).sum();

        // Build ticket list
        List<SalesTicketsResponse.TicketInfo> tickets = orders.stream()
                .map(this::mapOrderToTicket)
                .collect(Collectors.toList());

        return SalesTicketsResponse.builder()
                .date(date)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .tickets(tickets)
                .build();
    }

    private SalesTicketsResponse.TicketInfo mapOrderToTicket(Order order) {
        Client client = order.getOwner();

        // Build items list
        List<SalesTicketsResponse.ItemInfo> items = new ArrayList<>();

        // Add creations
        if (order.getOrderCreations() != null) {
            for (OrderCreation oc : order.getOrderCreations()) {
                Creation creation = oc.getCreation();
                double unitPrice = calculateCreationPrice(creation);
                items.add(SalesTicketsResponse.ItemInfo.builder()
                        .type("CREATION")
                        .name(creation.getName() != null ? creation.getName() : creation.getCreationType().toString())
                        .quantity(oc.getQuantity())
                        .unitPrice(unitPrice)
                        .subtotal(unitPrice * oc.getQuantity())
                        .build());
            }
        }

        // Add products
        if (order.getOrderProducts() != null) {
            for (OrderProduct op : order.getOrderProducts()) {
                Product product = op.getProduct();
                items.add(SalesTicketsResponse.ItemInfo.builder()
                        .type("PRODUCT")
                        .name(product.getName())
                        .quantity(op.getQuantity())
                        .unitPrice(op.getPriceAtPurchase())
                        .subtotal(op.getPriceAtPurchase() * op.getQuantity())
                        .build());
            }
        }

        // Payment info
        SalesTicketsResponse.PaymentInfo paymentInfo = null;
        if (order.getPaymentCard() != null) {
            Card card = order.getPaymentCard();
            String last4 = card.getCardNumber().length() >= 4
                ? card.getCardNumber().substring(card.getCardNumber().length() - 4)
                : card.getCardNumber();
            paymentInfo = SalesTicketsResponse.PaymentInfo.builder()
                    .cardType(card.getCardType().toString())
                    .last4Digits(last4)
                    .build();
        }

        return SalesTicketsResponse.TicketInfo.builder()
                .orderId(order.getOrderId())
                .orderHash(order.getOrderHash())
                .orderDate(order.getOrderDate())
                .total(order.getTotal())
                .status(order.getOrderStatus().toString())
                .client(SalesTicketsResponse.ClientInfo.builder()
                        .document(client.getDocument())
                        .fullName(client.getFirstName() + " " + client.getLastName())
                        .build())
                .items(items)
                .paymentMethod(paymentInfo)
                .build();
    }

    private double calculateCreationPrice(Creation creation) {
        // Calculate price based on ingredients
        if (creation.getIngredients() == null || creation.getIngredients().isEmpty()) {
            return 0.0;
        }
        return creation.getIngredients().stream()
                .mapToDouble(ingredient -> ingredient.getPrice() * ingredient.getQuantity())
                .sum();
    }
}
