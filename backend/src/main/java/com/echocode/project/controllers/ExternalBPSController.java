package com.echocode.project.controllers;

import com.echocode.project.dto.external.EmployeeCountResponse;
import com.echocode.project.services.ApiAccessLogService;
import com.echocode.project.services.ExternalBPSService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * External API for BPS (Social Security) Integration
 *
 * Authentication: Requires X-API-Key header with valid BPS key
 *
 * Purpose: Provides employee count and workforce data for social security compliance
 */
@RestController
@RequestMapping("/api/v1/external/bps")
public class ExternalBPSController {

    @Autowired
    private ExternalBPSService externalBPSService;

    @Autowired
    private ApiAccessLogService apiAccessLogService;

    /**
     * Get employee count and details
     *
     * @param asOfDate Optional date to query historical data (format: YYYY-MM-DD)
     *                 If not provided, returns current data
     * @return Employee count, details, and system statistics
     *
     * Example Request:
     * GET /api/v1/external/bps/employee-count
     * Headers: X-API-Key: your_bps_api_key
     *
     * Or with date parameter:
     * GET /api/v1/external/bps/employee-count?asOfDate=2025-01-01
     * Headers: X-API-Key: your_bps_api_key
     *
     * Example Response:
     * {
     *   "asOfDate": "2025-11-20",
     *   "totalEmployees": 25,
     *   "activeEmployees": 23,
     *   "employeeDetails": [
     *     {
     *       "document": "12345678",
     *       "fullName": "María González",
     *       "email": "maria@burgum.com",
     *       "role": "ADMINISTRATOR",
     *       "createdAt": "2024-01-15T10:00:00",
     *       "status": "ACTIVE"
     *     }
     *   ],
     *   "statistics": {
     *     "totalAdministrators": 25,
     *     "totalClients": 1500,
     *     "deletedUsers": 2
     *   }
     * }
     */
    @GetMapping("/employee-count")
    public ResponseEntity<EmployeeCountResponse> getEmployeeCount(
            @RequestParam(required = false) String asOfDate,
            HttpServletRequest httpRequest) {
        EmployeeCountResponse response = externalBPSService.getEmployeeCount(asOfDate);
        apiAccessLogService.logApiAccess("BPS", httpRequest, 200);
        return ResponseEntity.ok(response);
    }
}
