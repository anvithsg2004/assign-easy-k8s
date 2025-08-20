package com.anvith.task_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "TASKS")
public class Task {

    @Id
    private String id; // Changed to String to match MongoDB ObjectId
    private String title;
    private String description;
    private String image;
    private List<String> assignedUserIds = new ArrayList<>();
    private List<String> tags = new ArrayList<>();
    private TaskStatus status;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;

    public String getCompletedByUserId() {
        return completedByUserId;
    }

    public void setCompletedByUserId(String completedByUserId) {
        this.completedByUserId = completedByUserId;
    }

    private String completedByUserId;

    public Task() {
    }

    public Task(String id, String title, String description, String image, List<String> tags, String completedByUserId, LocalDateTime createdAt, LocalDateTime deadline, TaskStatus status, List<String> assignedUserIds) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.image = image;
        this.tags = tags;
        this.completedByUserId = completedByUserId;
        this.createdAt = createdAt;
        this.deadline = deadline;
        this.status = status;
        this.assignedUserIds = assignedUserIds;
    }

    public List<String> getAssignedUserIds() {
        return assignedUserIds;
    }

    public void setAssignedUserIds(List<String> assignedUserIds) {
        this.assignedUserIds = assignedUserIds;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
