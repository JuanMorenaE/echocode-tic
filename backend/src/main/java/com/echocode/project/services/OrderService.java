package com.echocode.project.services;

import com.echocode.project.dto.*;
import com.echocode.project.entities.*;
import com.echocode.project.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderProductRepository orderProductRepository;

    @Autowired
    private OrderCreationRepository orderCreationRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CreationRepository creationRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CardRepository cardRepository;

    @Transactional
    public OrderResponse createOrder(OrderRequest request, String email) {
        // 1. Buscar el cliente por email
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));

        // 2. Validar que haya al menos un item en el pedido
        boolean hasCreations = request.getCreationIds() != null && !request.getCreationIds().isEmpty();
        boolean hasProducts = request.getProducts() != null && !request.getProducts().isEmpty();

        if (!hasCreations && !hasProducts) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order must contain at least one creation or product");
        }

        // 3. Validar y obtener la dirección de entrega
        Address deliveryAddress = null;
        if (request.getAddressId() != null) {
            deliveryAddress = addressRepository.findById(request.getAddressId().longValue())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));

            // Verificar que la dirección pertenezca al cliente
            if (deliveryAddress.getUser().getUserId() != client.getUserId()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Address does not belong to the client");
            }
        }

        // 4. Validar y obtener la tarjeta de pago
        Card paymentCard = null;
        if (request.getCardId() != null) {
            paymentCard = cardRepository.findById(request.getCardId().longValue())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found"));

            // Verificar que la tarjeta pertenezca al cliente
            if (paymentCard.getClient().getUserId() != client.getUserId()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Card does not belong to the client");
            }
        }

        // 5. Obtener las creaciones y validar que pertenezcan al cliente
        List<Creation> creations = new ArrayList<>();
        if (hasCreations) {
            creations = creationRepository.findAllById(request.getCreationIds());

            if (creations.size() != request.getCreationIds().size()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Some creations were not found");
            }

            // Validar que todas las creaciones pertenezcan al cliente
            for (Creation creation : creations) {
                if (creation.getOwner() == null || creation.getOwner().getUserId() != client.getUserId()) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Creation " + creation.getCreationId() + " does not belong to the client");
                }
            }
        }

        // 6. Calcular el total del pedido
        double total = 0.0;

        // Calcular total de creaciones (sumando precios de ingredientes)
        for (Creation creation : creations) {
            double creationPrice = creation.getIngredients().stream()
                    .mapToDouble(Ingredient::getPrice)
                    .sum();
            total += creationPrice;
        }

        // Calcular total de productos
        List<OrderProduct> orderProducts = new ArrayList<>();
        if (hasProducts) {
            for (OrderRequest.OrderProductItem item : request.getProducts()) {
                Product product = productRepository.findById(item.getProductId().longValue())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Product with ID " + item.getProductId() + " not found"));

                if (!product.isAvailable()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Product " + product.getName() + " is not available");
                }

                total += product.getPrice() * item.getQuantity();
            }
        }

        // 7. Crear la orden
        Order order = Order.builder()
                .orderHash(UUID.randomUUID().toString())
                .owner(client)
                .orderDate(LocalDateTime.now())
                .orderStatus(OrderStatus.QUEUED)
                .total(total)
                .notes(request.getNotes())
                .deliveryAddress(deliveryAddress)
                .paymentCard(paymentCard)
                .build();

        Order savedOrder = orderRepository.save(order);

        // 8. Crear los OrderCreations (creaciones con cantidad)
        List<OrderCreation> orderCreations = new ArrayList<>();
        if (hasCreations) {
            for (Creation creation : creations) {
                OrderCreation orderCreation = OrderCreation.builder()
                        .order(savedOrder)
                        .creation(creation)
                        .quantity(1) // Por ahora cada creación tiene cantidad 1
                        .build();

                orderCreations.add(orderCreation);
            }
            orderCreationRepository.saveAll(orderCreations);
        }

        // 9. Crear los OrderProducts (productos con cantidad y precio al momento de la compra)
        if (hasProducts) {
            for (OrderRequest.OrderProductItem item : request.getProducts()) {
                Product product = productRepository.findById(item.getProductId().longValue()).get();

                OrderProduct orderProduct = OrderProduct.builder()
                        .order(savedOrder)
                        .product(product)
                        .quantity(item.getQuantity())
                        .priceAtPurchase(product.getPrice())
                        .build();

                orderProducts.add(orderProduct);
            }
            orderProductRepository.saveAll(orderProducts);
        }

        // 10. Construir la respuesta
        return buildOrderResponse(savedOrder, orderCreations, orderProducts);
    }

    public OrderResponse getOrderById(int orderId, String email) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        // Verificar que el pedido pertenezca al cliente
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));

        if (order.getOwner().getUserId() != client.getUserId()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to view this order");
        }

        List<OrderCreation> orderCreations = orderCreationRepository.findByOrder_OrderId(orderId);
        List<OrderProduct> orderProducts = orderProductRepository.findByOrder_OrderId(orderId);
        return buildOrderResponse(order, orderCreations, orderProducts);
    }

    public List<OrderResponse> getOrdersByClient(String email) {
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));

        List<Order> orders = orderRepository.findByOwner_UserId((int) client.getUserId());

        return orders.stream()
                .map(order -> {
                    List<OrderCreation> orderCreations = orderCreationRepository.findByOrder_OrderId(order.getOrderId());
                    List<OrderProduct> orderProducts = orderProductRepository.findByOrder_OrderId(order.getOrderId());
                    return buildOrderResponse(order, orderCreations, orderProducts);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(int orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        try {
            OrderStatus status = OrderStatus.valueOf(newStatus.toUpperCase());
            order.setOrderStatus(status);
            Order updatedOrder = orderRepository.save(order);

            List<OrderCreation> orderCreations = orderCreationRepository.findByOrder_OrderId(orderId);
            List<OrderProduct> orderProducts = orderProductRepository.findByOrder_OrderId(orderId);
            return buildOrderResponse(updatedOrder, orderCreations, orderProducts);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order status: " + newStatus);
        }
    }

    @Transactional
    public OrderResponse cancelOrder(int orderId, String email) {
        // Buscar la orden
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        // Verificar que el pedido pertenezca al cliente
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));

        if (order.getOwner().getUserId() != client.getUserId()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to cancel this order");
        }

        // Verificar que el pedido pueda ser cancelado (solo QUEUED o PREPARING)
        if (order.getOrderStatus() != OrderStatus.QUEUED && order.getOrderStatus() != OrderStatus.PREPARING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Order cannot be cancelled. Current status: " + order.getOrderStatus());
        }

        // Cancelar el pedido
        order.setOrderStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);

        List<OrderCreation> orderCreations = orderCreationRepository.findByOrder_OrderId(orderId);
        List<OrderProduct> orderProducts = orderProductRepository.findByOrder_OrderId(orderId);
        return buildOrderResponse(updatedOrder, orderCreations, orderProducts);
    }

    private OrderResponse buildOrderResponse(Order order, List<OrderCreation> orderCreations, List<OrderProduct> orderProducts) {
        // Mapear creaciones
        List<CreationResponse> creationResponses = orderCreations.stream()
                .map(oc -> mapCreationToResponse(oc.getCreation()))
                .collect(Collectors.toList());

        // Mapear productos
        List<OrderResponse.OrderProductResponse> productResponses = orderProducts.stream()
                .map(op -> OrderResponse.OrderProductResponse.builder()
                        .productId(Math.toIntExact(op.getProduct().getId()))
                        .productName(op.getProduct().getName())
                        .quantity(op.getQuantity())
                        .price(op.getPriceAtPurchase())
                        .build())
                .collect(Collectors.toList());

        // Mapear dirección
        AddressResponse addressResponse = null;
        if (order.getDeliveryAddress() != null) {
            Address addr = order.getDeliveryAddress();
            addressResponse = AddressResponse.builder()
                    .id(addr.getId())
                    .alias(addr.getAlias())
                    .street(addr.getStreet())
                    .number(addr.getNumber())
                    .apartmentNumber(addr.getApartmentNumber())
                    .city(addr.getCity())
                    .zipCode(addr.getZipCode())
                    .additionalInfo(addr.getAdditionalInfo())
                    .isDefault(addr.isDefault())
                    .build();
        }

        // Mapear tarjeta
        CardResponse cardResponse = null;
        if (order.getPaymentCard() != null) {
            Card card = order.getPaymentCard();
            String last4 = card.getCardNumber().length() >= 4
                    ? card.getCardNumber().substring(card.getCardNumber().length() - 4)
                    : card.getCardNumber();

            cardResponse = CardResponse.builder()
                    .id(card.getId())
                    .alias(card.getAlias())
                    .cardholderName(card.getCardholderName())
                    .last4Digits(last4)
                    .expirationDate(card.getExpirationDate())
                    .cardType(card.getCardType().name())
                    .isDefault(card.isDefault())
                    .build();
        }

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .orderHash(order.getOrderHash())
                .orderStatus(order.getOrderStatus().name())
                .orderDate(order.getOrderDate())
                .total(order.getTotal())
                .notes(order.getNotes())
                .deliveryAddress(addressResponse)
                .paymentCard(cardResponse)
                .creations(creationResponses)
                .products(productResponses)
                .build();
    }

    private CreationResponse mapCreationToResponse(Creation creation) {
        double totalPrice = creation.getIngredients().stream()
                .mapToDouble(Ingredient::getPrice)
                .sum();

        return CreationResponse.builder()
                .creationId(creation.getCreationId())
                .name(creation.getName())
                .creationType(creation.getCreationType().name())
                .isFavourite(creation.isFavourite())
                .ingredients(creation.getIngredients())
                .totalPrice(totalPrice)
                .build();
    }
}
