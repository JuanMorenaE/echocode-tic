package com.echocode.project.controllers;

import com.echocode.project.dto.external.SalesTicketsResponse;
import com.echocode.project.services.ApiAccessLogService;
import com.echocode.project.services.ExternalDGIService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * External API for DGI (Tax Authority) Integration
 *
 * Authentication: Requires X-API-Key header with valid DGI key
 *
 * Purpose: Provides tax-related data for compliance and reporting
 */
@RestController
@RequestMapping("/api/v1/external/dgi")
public class ExternalDGIController {

    @Autowired
    private ExternalDGIService externalDGIService;

    @Autowired
    private ApiAccessLogService apiAccessLogService;

    /**
     * Get all sales tickets (delivered orders) for a specific date
     *
     * @param date The date to query (format: YYYY-MM-DD)
     * @return Sales summary and detailed ticket information for tax reporting
     *
     * Example Request:
     * GET /api/v1/external/dgi/sales-tickets?date=2025-11-20
     * Headers: X-API-Key: your_dgi_api_key
     *
     * Example Response:
     * {
     *   "date": "2025-11-20",
     *   "totalOrders": 150,
     *   "totalRevenue": 45600.00,
     *   "tickets": [
     *     {
     *       "orderId": 123,
     *       "orderHash": "uuid-string",
     *       "orderDate": "2025-11-20T14:30:00",
     *       "total": 350.00,
     *       "status": "DELIVERED",
     *       "client": {
     *         "document": "12345678",
     *         "fullName": "Juan Pérez"
     *       },
     *       "items": [
     *         {
     *           "type": "CREATION",
     *           "name": "Pizza Personalizada",
     *           "quantity": 2,
     *           "unitPrice": 150.00,
     *           "subtotal": 300.00
     *         }
     *       ],
     *       "paymentMethod": {
     *         "cardType": "VISA",
     *         "last4Digits": "1234"
     *       }
     *     }
     *   ]
     * }
     */
    @GetMapping("/sales-tickets")
    public ResponseEntity<SalesTicketsResponse> getSalesTickets(
            @RequestParam String date,
            HttpServletRequest httpRequest) {
        SalesTicketsResponse response = externalDGIService.getSalesTickets(date);
        apiAccessLogService.logApiAccess("DGI", httpRequest, 200);
        return ResponseEntity.ok(response);
    }
}
