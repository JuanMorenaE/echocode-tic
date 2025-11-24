package com.echocode.project.services;

import com.echocode.project.dto.external.EmployeeCountResponse;
import com.echocode.project.repositories.AdministratorRepository;
import com.echocode.project.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service for BPS external API
 * Returns count of funcionarios (administrators) and users (clients)
 */
@Service
public class ExternalBPSService {

    @Autowired
    private AdministratorRepository administratorRepository;

    @Autowired
    private ClientRepository clientRepository;

    public EmployeeCountResponse getEmployeeCount() {
        long totalFuncionarios = administratorRepository.count();
        long totalUsuarios = clientRepository.count();

        return EmployeeCountResponse.builder()
                .totalFuncionarios((int) totalFuncionarios)
                .totalUsuarios((int) totalUsuarios)
                .build();
    }
}
