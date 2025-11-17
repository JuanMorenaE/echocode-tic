package com.echocode.project.services;

import com.echocode.project.dto.AddressResponse;
import com.echocode.project.dto.AdministratorRequest;
import com.echocode.project.dto.FuncionarioRequest;
import com.echocode.project.entities.Address;
import com.echocode.project.entities.Administrator;
import com.echocode.project.entities.User;
import com.echocode.project.repositories.AddressRepository;
import com.echocode.project.repositories.AdministratorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdministratorService {

    @Autowired
    private AdministratorRepository administratorRepository;

    @Autowired
    private AddressService addressService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<AdministratorRequest> getAdministrators(){
        List<Administrator> administrators = administratorRepository.findAll();
        List<AdministratorRequest> administratorRequests = new ArrayList<>();

        for(Administrator administrator : administrators){
            List<AddressResponse> adminAddresses = addressService.getAllAddressesByUser(administrator.getUserId());
            AddressResponse address = adminAddresses.isEmpty() ? null : adminAddresses.getFirst();

            administratorRequests.add(
                    AdministratorRequest.builder()
                            .document(administrator.getDocument())
                            .firstName(administrator.getFirstName())
                            .lastName(administrator.getLastName())
                            .email(administrator.getEmail())
                            .phoneNumber(administrator.getPhoneNumber())
                            .address(address)
                            .build()
            );
        }

        return administratorRequests;
    }

    public Administrator create(FuncionarioRequest funcionarioRequest){
        Administrator administrator = Administrator.builder()
                .document(funcionarioRequest.getDocument())
                .firstName(funcionarioRequest.getFirstName())
                .lastName(funcionarioRequest.getLastName())
                .phoneNumber(funcionarioRequest.getPhoneNumber())
                .email(funcionarioRequest.getEmail())
                .passwordHash(passwordEncoder.encode(funcionarioRequest.getPassword()))
                .build();

        return administratorRepository.save(administrator);
    }
}
