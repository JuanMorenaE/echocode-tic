package com.echocode.project.repositories;

import com.echocode.project.entities.Address;
import com.echocode.project.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderCreationRepository extends JpaRepository<Order, Long>{
}