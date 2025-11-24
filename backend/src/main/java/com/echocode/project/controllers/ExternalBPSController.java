package com.echocode.project.controllers;

import com.echocode.project.dto.external.EmployeeCountResponse;
import com.echocode.project.services.ExternalBPSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * External API for BPS (Banco de Previsión Social)
 *
 * PUBLIC API - No authentication required
 *
 * Purpose: Returns count of employees (funcionarios) and users
 */
@RestController
@RequestMapping("/api/v1/external/bps")
public class ExternalBPSController {

    @Autowired
    private ExternalBPSService externalBPSService;

    /**
     * Get count of employees and users
     *
     * GET /api/v1/external/bps/employee-count
     *
     * Returns: Count of funcionarios (administrators) and users (clients)
     */
    @GetMapping("/employee-count")
    public ResponseEntity<EmployeeCountResponse> getEmployeeCount() {
        EmployeeCountResponse response = externalBPSService.getEmployeeCount();
        return ResponseEntity.ok(response);
    }
}
