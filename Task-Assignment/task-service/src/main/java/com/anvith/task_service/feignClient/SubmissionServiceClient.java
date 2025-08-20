package com.anvith.task_service.feignClient;

import com.anvith.task_service.entity.Submission;
import com.anvith.task_service.entity.SubmissionComment;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "submission-service-client", url = "https://submission-service-a04o.onrender.com")
public interface SubmissionServiceClient {

    @PostMapping("/api/submission/submit-task")
    Submission submitTask(
            @RequestParam String taskId,
            @RequestParam String gitHubLink,
            @RequestHeader("Authorization") String jwt
    );

    @GetMapping("/api/submission/get-all-submissions")
    Page<Submission> getAllSubmissions(
            @RequestHeader("Authorization") String jwt,
            Pageable pageable
    );

    @GetMapping("/api/submission/get-task-submissions-by-task-id/{taskId}")
    Page<Submission> getTaskSubmissionsByTaskId(
            @PathVariable("taskId") String taskId,
            @RequestHeader("Authorization") String jwt,
            Pageable pageable
    );

    @PutMapping("/api/submission/accept-decline-submission/{submissionId}")
    Submission acceptDeclineSubmission(
            @PathVariable("submissionId") String submissionId,
            @RequestParam("status") String status,
            @RequestHeader("Authorization") String jwt
    );

    @PostMapping("/api/submission/comment/{submissionId}")
    SubmissionComment addComment(
            @PathVariable("submissionId") String submissionId,
            @RequestParam("comment") String comment,
            @RequestHeader("Authorization") String jwt
    );

    @GetMapping("/api/submission/comments/{submissionId}")
    List<SubmissionComment> getCommentsBySubmissionId(
            @PathVariable("submissionId") String submissionId,
            @RequestHeader("Authorization") String jwt
    );

    @GetMapping("/api/submission/accepted-task-ids/{userId}")
    List<String> getAcceptedTaskIdsForUser(
            @PathVariable("userId") String userId,
            @RequestHeader("Authorization") String jwt
    );
}
