package com.echocode.project.dto.external;

import lombok.*;

/**
 * Simple response for BPS API
 * Returns count of funcionarios and users
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeCountResponse {
    private Integer totalFuncionarios;  // Administrators
    private Integer totalUsuarios;      // Clients
}
