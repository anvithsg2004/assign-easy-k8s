package com.anvith.task_service.entity;

import java.time.LocalDateTime;

public class Submission {

    private String id; // Changed from Long to String

    private String taskId;

    private String gitHubLink;

    private String userId; // Already String, consistent with User entity's id

    private SubmissionStatus status = SubmissionStatus.PENDING;

    private LocalDateTime submissionTime;

    // No-args constructor
    public Submission() {
    }

    // Getters and Setters

    public SubmissionStatus getStatus() {
        return status;
    }

    public void setStatus(SubmissionStatus status) {
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getGitHubLink() {
        return gitHubLink;
    }

    public void setGitHubLink(String gitHubLink) {
        this.gitHubLink = gitHubLink;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public LocalDateTime getSubmissionTime() {
        return submissionTime;
    }

    public void setSubmissionTime(LocalDateTime submissionTime) {
        this.submissionTime = submissionTime;
    }
}
