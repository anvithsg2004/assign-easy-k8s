package com.anvith.submission_service.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Task {

    private String id;
    private String title;
    private String description;
    private String image;
    private List<String> assignedUserIds = new ArrayList<>();
    private List<String> tags = new ArrayList<>();
    private TaskStatus status;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;

    public List<String> getAssignedUserIds() {
        return assignedUserIds;
    }

    public void setAssignedUserIds(List<String> assignedUserIds) {
        this.assignedUserIds = assignedUserIds;
    }

    public Task() {
    }

    public Task(String id,
                String description,
                String title,
                String image,
                List<String> assignedUserIds,
                List<String> tags,
                TaskStatus status,
                LocalDateTime deadline,
                LocalDateTime createdAt) {
        this.id = id;
        this.description = description;
        this.title = title;
        this.image = image;
        this.assignedUserIds = assignedUserIds;
        this.tags = tags;
        this.status = status;
        this.deadline = deadline;
        this.createdAt = createdAt;
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
