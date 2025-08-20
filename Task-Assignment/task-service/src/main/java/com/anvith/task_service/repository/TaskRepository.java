package com.anvith.task_service.repository;

import com.anvith.task_service.entity.Task;
import com.anvith.task_service.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByAssignedUserIdsContaining(String userId); // Updated method
    Page<Task> findAll(Pageable pageable);
    Page<Task> findByAssignedUserIdsContaining(String userId, Pageable pageable); // Updated method
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
    Page<Task> findByCompletedByUserIdAndStatus(String userId, TaskStatus status, Pageable pageable);
}
