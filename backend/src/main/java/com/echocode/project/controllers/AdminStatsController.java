package com.echocode.project.controllers;

import com.echocode.project.dto.AdminStatsResponse;
import com.echocode.project.services.AdminStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/stats")
public class AdminStatsController {

    @Autowired
    private AdminStatsService adminStatsService;

    @GetMapping
    public ResponseEntity<AdminStatsResponse> getStats() {
        AdminStatsResponse stats = adminStatsService.getStats();
        return ResponseEntity.ok(stats);
    }
}
