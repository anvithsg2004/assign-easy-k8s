package com.anvith.submission_service.entity;

public class User {

    private String id;
    private String password;
    private String email;
    private String role;
    private String fullName;
    private String mobile;

    // No-args constructor
    public User() {
    }

    // All-args constructor
    public User(String id, String password, String email, String role, String fullName, String mobile) {
        this.id = id;
        this.password = password;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
        this.mobile = mobile;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    // toString method

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", fullName='" + fullName + '\'' +
                ", mobile='" + mobile + '\'' +
                '}';
    }
}