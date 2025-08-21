package com.anvith.submission_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GatewayHealthController {

    @GetMapping("/gateway/health")
    public String healthCheck() {
        return "API Gateway is up and running!";
    }
}
