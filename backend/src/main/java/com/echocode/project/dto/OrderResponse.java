package com.echocode.project.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Integer orderId;
    private String orderHash;
    private String orderStatus;
    private LocalDateTime orderDate;
    private Double total;
    private String notes;
    private AddressResponse deliveryAddress;
    private CardResponse paymentCard;
    private List<CreationResponse> creations;
    private List<OrderProductResponse> products;

    @Data
    @Builder
    public static class OrderProductResponse {
        private Integer productId;
        private String productName;
        private Integer quantity;
        private Double price;
    }
}
