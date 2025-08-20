package com.anvith.task_service.repository;

import com.anvith.task_service.entity.TaskHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskHistoryRepository extends MongoRepository<TaskHistory, String> {
    List<TaskHistory> findByTaskId(String taskId);
}
