package com.echocode.project.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private List<OrderCreationItem> creations;
    private List<OrderProductItem> products;
    private Integer addressId;
    private Integer cardId;
    private String notes;

    @Data
    public static class OrderProductItem {
        private Integer productId;
        private Integer quantity;
    }

    @Data
    public static class OrderCreationItem {
        private Integer creationId;
        private Integer quantity;
    }
}
