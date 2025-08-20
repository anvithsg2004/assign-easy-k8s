package com.anvith.submission_service.fiegnClient;

import com.anvith.submission_service.entity.Task;
import com.anvith.submission_service.entity.TaskStatus;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "task-service-client", url = "https://task-service-j8cy.onrender.com")
public interface TaskServiceClient {

    @PostMapping("/api/tasks/create-user")
    Task createTask(@RequestBody Task task, @RequestHeader("Authorization") String jwt);

    @GetMapping("/api/tasks/get-task/{id}")
    Task getTaskById(@PathVariable("id") String id, @RequestHeader("Authorization") String jwt);

    @GetMapping("/api/tasks/assigned-users-task/{userId}")
    List<Task> getAssignedTasksByUserId(@PathVariable("userId") String userId,
                                        @RequestParam(required = false) TaskStatus status,
                                        @RequestHeader("Authorization") String jwt);

    @PutMapping("/api/tasks/{userId}/user/{taskId}/assigned")
    Task assignTaskToUser(@PathVariable("userId") String userId,
                          @PathVariable("taskId") String taskId,
                          @RequestHeader("Authorization") String jwt);

    @GetMapping("/api/tasks/get-all-users")
    List<Task> getAllTasks(@RequestParam(required = false) TaskStatus status,
                           @RequestHeader("Authorization") String jwt);

    @PutMapping("/api/tasks/update/{id}")
    Task updateTask(@PathVariable("id") String id,
                    @RequestBody Task updatedTask,
                    @RequestHeader("Authorization") String jwt);

    @DeleteMapping("/api/tasks/delete/{id}")
    void deleteTask(@PathVariable("id") String id, @RequestHeader("Authorization") String jwt);

    @PutMapping("/api/tasks/complete/{id}")
    Task completeTask(@PathVariable("id") String id, @RequestHeader("Authorization") String jwt);
}
