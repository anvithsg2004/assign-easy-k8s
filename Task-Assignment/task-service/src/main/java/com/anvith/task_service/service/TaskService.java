package com.anvith.task_service.service;

import com.anvith.task_service.entity.Task;
import com.anvith.task_service.entity.TaskHistory;
import com.anvith.task_service.entity.TaskStatus;
import com.anvith.task_service.repository.TaskHistoryRepository;
import com.anvith.task_service.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskHistoryRepository taskHistoryRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public Task createTask(Task task, String requestRole) throws Exception {
        if (!requestRole.equals("ROLE_ADMIN")) {
            throw new Exception("Only Admin can create the class.");
        }
        if (task.getAssignedUserIds() != null && !task.getAssignedUserIds().isEmpty()) {
            task.setStatus(TaskStatus.ASSIGNED);
        } else {
            // Decide if tasks open to all should also be ASSIGNED immediately or stay PENDING
            // For now, let's assume they also become ASSIGNED if you want them submittable right away
            task.setStatus(TaskStatus.ASSIGNED);
            // Or, if they should require an explicit assignment step later:
            // task.setStatus(TaskStatus.PENDING);
        }
        task.setCreatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public Task getTaskById(String id) throws Exception { // Changed Long to String
        return taskRepository.findById(id).orElseThrow(() -> new Exception("Task Not Found with ID: " + id));
    }

    public Page<Task> getAllTask(TaskStatus status, Pageable pageable) {
        if (status != null) {
            return taskRepository.findByStatus(status, pageable);
        }
        return taskRepository.findAll(pageable); // Return all tasks if no status filter
    }

    public Task updateTask(String id, Task updatedTask, String userId) throws Exception {
        Task existingTask = getTaskById(id);
        if (updatedTask.getTitle() != null && !updatedTask.getTitle().equals(existingTask.getTitle())) {
            taskHistoryRepository.save(new TaskHistory(id, "title", existingTask.getTitle(), updatedTask.getTitle()));
            existingTask.setTitle(updatedTask.getTitle());
        }
        if (updatedTask.getImage() != null) {
            taskHistoryRepository.save(new TaskHistory(id, "image", existingTask.getImage(), updatedTask.getImage()));
            existingTask.setImage(updatedTask.getImage());
        }
        if (updatedTask.getDescription() != null) {
            taskHistoryRepository.save(new TaskHistory(id, "description", existingTask.getDescription(), updatedTask.getDescription()));
            existingTask.setDescription(updatedTask.getDescription());
        }
        if (updatedTask.getStatus() != null && !updatedTask.getStatus().equals(existingTask.getStatus())) {
            taskHistoryRepository.save(new TaskHistory(id, "status", existingTask.getStatus().toString(), updatedTask.getStatus().toString()));
            existingTask.setStatus(updatedTask.getStatus());
        } else if (existingTask.getStatus() != TaskStatus.DONE) {
            // Ensure the task remains ASSIGNED unless explicitly set to DONE
            existingTask.setStatus(TaskStatus.ASSIGNED);
        }
        if (updatedTask.getDeadline() != null) {
            taskHistoryRepository.save(new TaskHistory(id, "deadline", existingTask.getDeadline().toString(), updatedTask.getDeadline().toString()));
            existingTask.setDeadline(updatedTask.getDeadline());
        }
        if (updatedTask.getAssignedUserIds() != null) {
            String oldAssigned = existingTask.getAssignedUserIds() != null ? String.join(",", existingTask.getAssignedUserIds()) : "None";
            String newAssigned = updatedTask.getAssignedUserIds() != null ? String.join(",", updatedTask.getAssignedUserIds()) : "None";
            taskHistoryRepository.save(new TaskHistory(id, "assignedUserIds", oldAssigned, newAssigned));
            existingTask.setAssignedUserIds(updatedTask.getAssignedUserIds());
        }
        return taskRepository.save(existingTask);
    }

    public Page<Task> getVisibleTasksForUser(String userId, TaskStatus status, Pageable pageable) {
        Query query = new Query();
        Criteria criteria = new Criteria().orOperator(
                Criteria.where("assignedUserIds").is(userId),
                Criteria.where("assignedUserIds").size(0)
        );
        if (status != null) {
            criteria.and("status").is(status);
        } else {
            criteria.and("status").in(TaskStatus.ASSIGNED, TaskStatus.DONE);
        }
        query.addCriteria(criteria);
        query.with(pageable);

        List<Task> tasks = mongoTemplate.find(query, Task.class);
        long count = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Task.class);
        return new PageImpl<>(tasks, pageable, count);
    }

    public void deleteTask(String id) throws Exception { // Changed Long to String
        getTaskById(id);
        taskRepository.deleteById(id);
    }

    public Task assignedTaskToUser(String userId, String taskId) throws Exception {
        Task task = getTaskById(taskId);
        List<String> assignedUserIds = task.getAssignedUserIds();
        if (!assignedUserIds.contains(userId)) {
            assignedUserIds.add(userId);
            task.setAssignedUserIds(assignedUserIds);
            task.setStatus(TaskStatus.ASSIGNED); // Ensure status is set to ASSIGNED
            taskHistoryRepository.save(new TaskHistory(taskId, "assignedUserIds",
                    String.join(",", assignedUserIds), String.join(",", assignedUserIds) + "," + userId));
        }
        return taskRepository.save(task);
    }

    public Page<Task> assignedUsersTask(String userId, TaskStatus status, Pageable pageable) {
        Page<Task> allTasks = taskRepository.findByAssignedUserIdsContaining(userId, pageable);
        return allTasks.map(task -> {
            if (status != null && !task.getStatus().equals(status)) {
                return null;
            }
            return task;
        });
    }

    public Task completeTask(String taskId) throws Exception { // Changed Long to String
        Task task = getTaskById(taskId);
        task.setStatus(TaskStatus.DONE);
        return taskRepository.save(task);
    }

    public List<TaskHistory> getTaskHistory(String taskId) throws Exception {
        getTaskById(taskId); // Validate task exists
        return taskHistoryRepository.findByTaskId(taskId);
    }
}
