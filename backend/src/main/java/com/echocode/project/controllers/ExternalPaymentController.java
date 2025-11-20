package com.echocode.project.controllers;

import com.echocode.project.dto.external.CardOwnerRequest;
import com.echocode.project.dto.external.CardOwnerResponse;
import com.echocode.project.services.ApiAccessLogService;
import com.echocode.project.services.ExternalPaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * External API for Payment System Integration
 *
 * Authentication: Requires X-API-Key header with valid PAYMENT_SYSTEM key
 *
 * Purpose: Allows payment processors to verify card ownership and validate card data
 */
@RestController
@RequestMapping("/api/v1/external/payment")
public class ExternalPaymentController {

    @Autowired
    private ExternalPaymentService externalPaymentService;

    @Autowired
    private ApiAccessLogService apiAccessLogService;

    /**
     * Get card owner information by card number
     *
     * @param request Contains the full card number
     * @return Card owner details including cardholder name, client info, and validation status
     *
     * Example Request:
     * POST /api/v1/external/payment/card-owner
     * Headers: X-API-Key: your_payment_api_key
     * Body: { "cardNumber": "1234567890123456" }
     *
     * Example Response:
     * {
     *   "cardholderName": "JOHN DOE",
     *   "cardType": "VISA",
     *   "expirationDate": "12/25",
     *   "isValid": true,
     *   "client": {
     *     "fullName": "John Doe",
     *     "document": "12345678",
     *     "email": "john@example.com",
     *     "phoneNumber": "+598123456"
     *   }
     * }
     */
    @PostMapping("/card-owner")
    public ResponseEntity<CardOwnerResponse> getCardOwner(
            @RequestBody CardOwnerRequest request,
            HttpServletRequest httpRequest) {
        CardOwnerResponse response = externalPaymentService.getCardOwnerInfo(request.getCardNumber());
        apiAccessLogService.logApiAccess("PAYMENT_SYSTEM", httpRequest, 200);
        return ResponseEntity.ok(response);
    }
}
