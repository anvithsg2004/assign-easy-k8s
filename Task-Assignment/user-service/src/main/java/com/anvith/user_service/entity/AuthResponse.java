package com.anvith.user_service.entity;

public class AuthResponse {

    private String jwt;
    private String message;
    private Boolean status;

    // No-args constructor
    public AuthResponse() {
    }

    // All-args constructor
    public AuthResponse(String jwt, String message, Boolean status) {
        this.jwt = jwt;
        this.message = message;
        this.status = status;
    }

    // Getters and Setters

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    // toString method

    @Override
    public String toString() {
        return "AuthResponse{" +
                "jwt='" + jwt + '\'' +
                ", message='" + message + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
