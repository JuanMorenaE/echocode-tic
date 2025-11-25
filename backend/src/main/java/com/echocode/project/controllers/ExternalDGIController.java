package com.echocode.project.controllers;

import com.echocode.project.dto.external.SalesTicketsResponse;
import com.echocode.project.services.ExternalDGIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * External API for DGI (Dirección General Impositiva)
 *
 * PUBLIC API - No authentication required
 *
 * Purpose: Returns all sales tickets for a given date
 */
@RestController
@RequestMapping("/api/v1/external/dgi")
public class ExternalDGIController {

    @Autowired
    private ExternalDGIService externalDGIService;

    /**
     * Get all sales tickets for a specific date
     *
     * GET /api/v1/external/dgi/sales-tickets?date=2025-11-20
     *
     * Returns: List of sales tickets (delivered orders)
     */
    @GetMapping("/sales-tickets")
    public ResponseEntity<SalesTicketsResponse> getSalesTickets(@RequestParam String date) {
        SalesTicketsResponse response = externalDGIService.getSalesTickets(date);
        return ResponseEntity.ok(response);
    }
}
