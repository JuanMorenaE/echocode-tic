package com.echocode.project.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminStatsResponse {
    // Stats cards
    private Double totalSales;
    private Integer totalOrders;
    private Integer totalClients;

    // Recent delivered orders
    private List<DeliveredOrderDto> deliveredOrders;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DeliveredOrderDto {
        private Integer orderId;
        private String clientName;
        private Double total;
        private LocalDateTime orderDate;
    }
}
