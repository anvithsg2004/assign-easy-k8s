package com.anvith.task_service.controller;

import com.anvith.task_service.entity.Task;
import com.anvith.task_service.entity.TaskHistory;
import com.anvith.task_service.entity.TaskStatus;
import com.anvith.task_service.entity.User;
import com.anvith.task_service.feignClient.UserServiceClient;
import com.anvith.task_service.service.TaskService;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserServiceClient userServiceClient;

    @GetMapping("/visible-tasks")
    public ResponseEntity<Page<Task>> getVisibleTasks(
            @RequestParam(required = false) TaskStatus status,
            @PageableDefault(size = 20) Pageable pageable,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userServiceClient.getUserProfile(jwt);
        if (user.getRole().equals("ROLE_ADMIN")) {
            Page<Task> tasks = taskService.getAllTask(status, pageable);
            return new ResponseEntity<>(tasks, HttpStatus.OK);
        } else {
            Page<Task> tasks = taskService.getVisibleTasksForUser(user.getId(), status, pageable);
            return new ResponseEntity<>(tasks, HttpStatus.OK);
        }
    }
    @PostMapping("/create-user")
    public ResponseEntity<?> createTask(@RequestBody Task task, @RequestHeader("Authorization") String jwt) {
        try {
            User user = userServiceClient.getUserProfile(jwt);
            Task createTask = taskService.createTask(task, user.getRole());
            return new ResponseEntity<>(createTask, HttpStatus.CREATED);
        } catch (FeignException.ServiceUnavailable e) {
            return new ResponseEntity<>("User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        } catch (FeignException.Unauthorized e) {
            return new ResponseEntity<>("Unauthorized: Invalid or missing JWT token", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating task: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/get-task/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable String id, @RequestHeader("Authorization") String jwt) {
        try {
            User user = userServiceClient.getUserProfile(jwt);
            Task task = taskService.getTaskById(id);
            return new ResponseEntity<>(task, HttpStatus.OK);
        } catch (FeignException.ServiceUnavailable e) {
            return new ResponseEntity<>("User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        } catch (FeignException.Unauthorized e) {
            return new ResponseEntity<>("Unauthorized: Invalid or missing JWT token", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving task: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/assigned-users-task/{userId}")
    public ResponseEntity<Page<Task>> assignedUsersTask(
            @PathVariable String userId,
            @RequestParam(required = false) TaskStatus status,
            @PageableDefault(size = 20) Pageable pageable,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userServiceClient.getUserProfile(jwt);
        if (!user.getId().equals(userId)) {
            throw new Exception("Unauthorized: User ID mismatch");
        }
        Page<Task> tasks = taskService.assignedUsersTask(userId, status, pageable);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @PutMapping("/{userId}/user/{taskId}/assigned")
    public ResponseEntity<?> assignTaskToUser(@PathVariable String userId, @PathVariable String taskId,
                                              @RequestHeader("Authorization") String jwt) {
        try {
            User user = userServiceClient.getUserProfile(jwt);
            if (!user.getRole().equals("ROLE_ADMIN")) {
                return new ResponseEntity<>("Only Admin can assign tasks", HttpStatus.FORBIDDEN);
            }
            Task existingTask = taskService.getTaskById(taskId);
            List<String> assignedUserIds = existingTask.getAssignedUserIds();
            if (!assignedUserIds.contains(userId)) {
                assignedUserIds.add(userId);
                existingTask.setAssignedUserIds(assignedUserIds);
                existingTask.setStatus(TaskStatus.ASSIGNED); // Ensure status is set to ASSIGNED
                Task updatedTask = taskService.updateTask(taskId, existingTask, user.getId());
                return new ResponseEntity<>(updatedTask, HttpStatus.OK);
            }
            return new ResponseEntity<>("User is already assigned to the task", HttpStatus.OK);
        } catch (FeignException.ServiceUnavailable e) {
            return new ResponseEntity<>("User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        } catch (FeignException.Unauthorized e) {
            return new ResponseEntity<>("Unauthorized: Invalid or missing JWT token", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error assigning task: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get-all-users")
    public ResponseEntity<Page<Task>> getAllTask(
            @RequestParam(required = false) TaskStatus status,
            @PageableDefault(size = 20) Pageable pageable,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userServiceClient.getUserProfile(jwt);
        Page<Task> tasks = taskService.getAllTask(status, pageable);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTask(@PathVariable String id, @RequestBody Task updatedTask,
                                        @RequestHeader("Authorization") String jwt) {
        try {
            User user = userServiceClient.getUserProfile(jwt);
            Task task = taskService.updateTask(id, updatedTask, user.getId());
            return new ResponseEntity<>(task, HttpStatus.OK);
        } catch (FeignException.ServiceUnavailable e) {
            return new ResponseEntity<>("User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        } catch (FeignException.Unauthorized e) {
            return new ResponseEntity<>("Unauthorized: Invalid or missing JWT token", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating task: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable String id, @RequestHeader("Authorization") String jwt) {
        try {
            User user = userServiceClient.getUserProfile(jwt);
            taskService.deleteTask(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (FeignException.ServiceUnavailable e) {
            return new ResponseEntity<>("User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        } catch (FeignException.Unauthorized e) {
            return new ResponseEntity<>("Unauthorized: Invalid or missing JWT token", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting task: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/complete/{id}")
    public ResponseEntity<?> completeTask(@PathVariable String id, @RequestHeader("Authorization") String jwt) {
        try {
            User user = userServiceClient.getUserProfile(jwt);
            Task task = taskService.completeTask(id);
            return new ResponseEntity<>(task, HttpStatus.OK);
        } catch (FeignException.ServiceUnavailable e) {
            return new ResponseEntity<>("User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        } catch (FeignException.Unauthorized e) {
            return new ResponseEntity<>("Unauthorized: Invalid or missing JWT token", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error completing task: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/history/{taskId}")
    public ResponseEntity<List<TaskHistory>> getTaskHistory(
            @PathVariable String taskId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userServiceClient.getUserProfile(jwt);
        List<TaskHistory> history = taskService.getTaskHistory(taskId);
        return new ResponseEntity<>(history, HttpStatus.OK);
    }
}
