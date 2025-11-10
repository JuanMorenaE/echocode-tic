package com.echocode.project.services;

import com.echocode.project.dto.AddressResponse;
import com.echocode.project.dto.AdministratorRequest;
import com.echocode.project.entities.Address;
import com.echocode.project.entities.Administrator;
import com.echocode.project.entities.User;
import com.echocode.project.repositories.AddressRepository;
import com.echocode.project.repositories.AdministratorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdministratorService {

    @Autowired
    private AdministratorRepository administratorRepository;

    @Autowired
    private AddressService addressService;

    public List<AdministratorRequest> getAdministrators(User user){
        List<Administrator> administrators = administratorRepository.findAll();
        List<AdministratorRequest> administratorRequests = new ArrayList<>();

        for(Administrator administrator : administrators){
            List<AddressResponse> adminAddresses = addressService.getAllAddressesByUser(administrator.getUserId());
            administratorRequests.add(
                    AdministratorRequest.builder()
                            .firstName(administrator.getFirstName())
                            .lastName(administrator.getLastName())
                            .email(administrator.getEmail())
                            .phone(administrator.getPhoneNumber())
                            .role("Funcionario")
                            .address(adminAddresses.getFirst())
                            .build()
            );
        }

        return administratorRequests;
    }
}
