package com.echocode.project.dto.external;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SalesTicketsResponse {
    private String date;
    private Integer totalOrders;
    private Double totalRevenue;
    private List<TicketInfo> tickets;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TicketInfo {
        private Integer orderId;
        private String orderHash;
        private LocalDateTime orderDate;
        private Double total;
        private String status;
        private ClientInfo client;
        private List<ItemInfo> items;
        private PaymentInfo paymentMethod;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClientInfo {
        private String document;
        private String fullName;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ItemInfo {
        private String type; // CREATION or PRODUCT
        private String name;
        private Integer quantity;
        private Double unitPrice;
        private Double subtotal;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaymentInfo {
        private String cardType;
        private String last4Digits;
    }
}
