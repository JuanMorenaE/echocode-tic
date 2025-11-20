package com.echocode.project.services;

import com.echocode.project.dto.external.EmployeeCountResponse;
import com.echocode.project.entities.Administrator;
import com.echocode.project.repositories.AdministratorRepository;
import com.echocode.project.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExternalBPSService {

    @Autowired
    private AdministratorRepository administratorRepository;

    @Autowired
    private ClientRepository clientRepository;

    public EmployeeCountResponse getEmployeeCount(String asOfDate) {
        LocalDateTime targetDate = asOfDate != null
                ? LocalDate.parse(asOfDate, DateTimeFormatter.ISO_LOCAL_DATE).atStartOfDay()
                : LocalDateTime.now();

        // Get all administrators
        List<Administrator> allAdministrators = administratorRepository.findAll();

        // Filter based on date
        List<Administrator> employeesAsOfDate = allAdministrators.stream()
                .filter(admin -> admin.getCreatedAt() != null && !admin.getCreatedAt().isAfter(targetDate))
                .filter(admin -> admin.getDeletedAt() == null || admin.getDeletedAt().isAfter(targetDate))
                .collect(Collectors.toList());

        Integer totalEmployees = employeesAsOfDate.size();
        Integer activeEmployees = (int) employeesAsOfDate.stream()
                .filter(admin -> admin.getDeletedAt() == null)
                .count();

        // Build employee details list
        List<EmployeeCountResponse.EmployeeInfo> employeeDetails = employeesAsOfDate.stream()
                .map(admin -> EmployeeCountResponse.EmployeeInfo.builder()
                        .document(admin.getDocument())
                        .fullName(admin.getFirstName() + " " + admin.getLastName())
                        .email(admin.getEmail())
                        .role("ADMINISTRATOR")
                        .createdAt(admin.getCreatedAt())
                        .status(admin.getDeletedAt() == null ? "ACTIVE" : "INACTIVE")
                        .build())
                .collect(Collectors.toList());

        // Statistics
        Integer deletedAdmins = (int) allAdministrators.stream()
                .filter(admin -> admin.getDeletedAt() != null)
                .count();

        EmployeeCountResponse.Statistics statistics = EmployeeCountResponse.Statistics.builder()
                .totalAdministrators(allAdministrators.size())
                .totalClients(clientRepository.count())
                .deletedUsers(deletedAdmins)
                .build();

        return EmployeeCountResponse.builder()
                .asOfDate(asOfDate != null ? asOfDate : LocalDate.now().toString())
                .totalEmployees(totalEmployees)
                .activeEmployees(activeEmployees)
                .employeeDetails(employeeDetails)
                .statistics(statistics)
                .build();
    }
}
