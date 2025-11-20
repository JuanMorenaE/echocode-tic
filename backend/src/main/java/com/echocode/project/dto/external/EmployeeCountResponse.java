package com.echocode.project.dto.external;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeCountResponse {
    private String asOfDate;
    private Integer totalEmployees;
    private Integer activeEmployees;
    private List<EmployeeInfo> employeeDetails;
    private Statistics statistics;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class EmployeeInfo {
        private String document;
        private String fullName;
        private String email;
        private String role;
        private LocalDateTime createdAt;
        private String status;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Statistics {
        private Integer totalAdministrators;
        private Long totalClients;
        private Integer deletedUsers;
    }
}
