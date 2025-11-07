package com.echocode.project.services;

import com.echocode.project.dto.AddressRequest;
import com.echocode.project.dto.AddressResponse;
import com.echocode.project.entities.Address;
import com.echocode.project.entities.User;
import com.echocode.project.repositories.AddressRepository;
import com.echocode.project.repositories.ClientRepository;
import com.echocode.project.repositories.OrderCreationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service

public class OrderCreationService {
    @Autowired
    private OrderCreationRepository orderCreationRepository;
}
