package com.anvith.task_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "TASK_HISTORY")
public class TaskHistory {
    @Id
    private String id;
    private String taskId;
    private String fieldChanged;
    private String oldValue;
    private String newValue;
    private LocalDateTime changedAt;

    // Default constructor
    public TaskHistory() {}

    // Parameterized constructor
    public TaskHistory(String taskId, String fieldChanged, String oldValue, String newValue) {
        this.taskId = taskId;
        this.fieldChanged = fieldChanged;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.changedAt = LocalDateTime.now();
    }

    // Getters and Setters
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

    public String getFieldChanged() {
        return fieldChanged;
    }

    public void setFieldChanged(String fieldChanged) {
        this.fieldChanged = fieldChanged;
    }

    public String getOldValue() {
        return oldValue;
    }

    public void setOldValue(String oldValue) {
        this.oldValue = oldValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    @Override
    public String toString() {
        return "TaskHistory{" +
                "id='" + id + '\'' +
                ", taskId='" + taskId + '\'' +
                ", fieldChanged='" + fieldChanged + '\'' +
                ", oldValue='" + oldValue + '\'' +
                ", newValue='" + newValue + '\'' +
                ", changedAt=" + changedAt +
                '}';
    }
}
