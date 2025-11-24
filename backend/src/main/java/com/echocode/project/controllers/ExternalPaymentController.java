package com.echocode.project.controllers;

import com.echocode.project.dto.external.CardOwnerResponse;
import com.echocode.project.services.ExternalPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * External API for Payment System Integration
 *
 * PUBLIC API - No authentication required
 *
 * Purpose: Allows payment processors to verify card ownership
 */
@RestController
@RequestMapping("/api/v1/external/payment")
public class ExternalPaymentController {

    @Autowired
    private ExternalPaymentService externalPaymentService;

    /**
     * Get card owner information by card number
     *
     * GET /api/v1/external/payment/card-owner?cardNumber=1234567890123456
     *
     * Returns: Card owner details
     */
    @GetMapping("/card-owner")
    public ResponseEntity<CardOwnerResponse> getCardOwner(@RequestParam String cardNumber) {
        CardOwnerResponse response = externalPaymentService.getCardOwnerInfo(cardNumber);
        return ResponseEntity.ok(response);
    }
}
