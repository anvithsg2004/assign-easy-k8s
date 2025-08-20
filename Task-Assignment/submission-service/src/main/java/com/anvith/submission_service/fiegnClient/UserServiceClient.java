package com.anvith.submission_service.fiegnClient;

import com.anvith.submission_service.entity.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "user-service-client", url = "https://user-service-hhho.onrender.com")
public interface UserServiceClient {

    @GetMapping("/api/user/profile")
    User getUserProfile(@RequestHeader("Authorization") String authHeader);

    @GetMapping("/api/user/all")
    List<User> getAllUsers();
}
