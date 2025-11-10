package com.echocode.project.repositories;

import com.echocode.project.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByOwner_UserId(int userId);
    Optional<Order> findByOrderHash(String orderHash);
    List<Order> findByOrderStatusOrderByOrderDateDesc(String orderStatus);
}
