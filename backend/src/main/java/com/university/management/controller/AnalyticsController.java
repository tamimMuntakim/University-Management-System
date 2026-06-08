package com.university.management.controller;

import com.university.management.dto.AnalyticsDTO;
import com.university.management.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<AnalyticsDTO> getAnalytics() {
        log.info("Fetching admin analytics data");
        try {
            AnalyticsDTO stats = analyticsService.getAdminAnalytics();
            log.info("Admin analytics data fetched successfully");
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Critical error while fetching analytics: {}", e.getMessage(), e);
            throw e;
        }
    }
}
