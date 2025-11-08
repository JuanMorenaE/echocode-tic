package com.echocode.project.repositories;

import com.echocode.project.entities.OrderCreation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderCreationRepository extends JpaRepository<OrderCreation, Long> {
    List<OrderCreation> findByOrder_OrderId(int orderId);
}
