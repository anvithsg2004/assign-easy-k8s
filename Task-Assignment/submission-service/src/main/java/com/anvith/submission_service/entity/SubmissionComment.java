package com.anvith.submission_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "SUBMISSION_COMMENTS")
public class SubmissionComment {
    @Id
    private String id;
    private String submissionId;
    private String userId;
    private String comment;
    private LocalDateTime createdAt;

    // No-arg constructor
    public SubmissionComment() {}

    // Constructor with fields (except id)
    public SubmissionComment(String submissionId, String userId, String comment) {
        this.submissionId = submissionId;
        this.userId = userId;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(String submissionId) {
        this.submissionId = submissionId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Optional: for logging/debugging
    @Override
    public String toString() {
        return "SubmissionComment{" +
                "id='" + id + '\'' +
                ", submissionId='" + submissionId + '\'' +
                ", userId='" + userId + '\'' +
                ", comment='" + comment + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
