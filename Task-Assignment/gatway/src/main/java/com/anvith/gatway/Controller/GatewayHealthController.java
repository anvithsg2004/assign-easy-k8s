package com.anvith.gatway.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GatewayHealthController {

    @GetMapping("/gateway/health")
    public String healthCheck() {
        return "API Gateway is up and running!";
    }
}
