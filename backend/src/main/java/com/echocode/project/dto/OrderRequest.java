package com.echocode.project.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private List<Integer> creationIds;
    private List<OrderProductItem> products;
    private Integer addressId;
    private Integer cardId;
    private String notes;

    @Data
    public static class OrderProductItem {
        private Integer productId;
        private Integer quantity;
    }
}
