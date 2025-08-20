package com.anvith.submission_service.controller;

import com.anvith.submission_service.entity.Submission;
import com.anvith.submission_service.entity.SubmissionComment;
import com.anvith.submission_service.entity.SubmissionStatus;
import com.anvith.submission_service.entity.User;
import com.anvith.submission_service.fiegnClient.TaskServiceClient;
import com.anvith.submission_service.fiegnClient.UserServiceClient;
import com.anvith.submission_service.serivces.SubmissionService;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/submission")
public class SubmissionController {

    @Autowired
    private UserServiceClient userServiceClient;

    @Autowired
    private TaskServiceClient taskServiceClient;

    @Autowired
    private SubmissionService submissionService;

    @PostMapping("/submit-task")
    public ResponseEntity<?> submitTask(
            @RequestParam String taskId,
            @RequestParam String gitHubLink,
            @RequestHeader("Authorization") String jwt
    ) {
        try {
            User user = userServiceClient.getUserProfile(jwt);
            Submission submission = submissionService.submitTask(taskId, gitHubLink, user.getId(), jwt);
            return new ResponseEntity<>(submission, HttpStatus.CREATED);
        } catch (FeignException.ServiceUnavailable e) {
            return new ResponseEntity<>("User or Task service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        } catch (FeignException.Unauthorized e) {
            return new ResponseEntity<>("Unauthorized: Invalid or missing JWT token", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error submitting task: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get-all-submissions")
    public ResponseEntity<Page<Submission>> getAllSubmissions(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userServiceClient.getUserProfile(jwt);
        Page<Submission> submissions = submissionService.getAllTaskSubmission(jwt, pageable);
        return new ResponseEntity<>(submissions, HttpStatus.OK);
    }

    @GetMapping("/get-task-submissions-by-task-id/{taskId}")
    public ResponseEntity<Page<Submission>> getTaskSubmissionsByTaskId(
            @PathVariable String taskId,
            @PageableDefault(size = 20) Pageable pageable,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userServiceClient.getUserProfile(jwt);
        Page<Submission> submissions = submissionService.getTaskSubmissionsByTaskId(taskId, jwt, pageable);
        return new ResponseEntity<>(submissions, HttpStatus.OK);
    }

    @PutMapping("/accept-decline-submission/{submissionId}")
    public ResponseEntity<Submission> acceptDeclineSubmission(
            @PathVariable String submissionId,
            @RequestParam("status") String status,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        // Validate status
        try {
            SubmissionStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new Exception("Invalid status: " + status + ". Must be PENDING, ACCEPTED, or REJECTED");
        }

        User user = userServiceClient.getUserProfile(jwt);
        Submission submission = submissionService.acceptDeclineSubmission(submissionId, status, jwt);
        return new ResponseEntity<>(submission, HttpStatus.OK);
    }

    @PostMapping("/comment/{submissionId}")
    public ResponseEntity<SubmissionComment> addComment(
            @PathVariable String submissionId,
            @RequestParam String comment,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userServiceClient.getUserProfile(jwt);
        SubmissionComment submissionComment = submissionService.addComment(submissionId, comment, user.getId());
        return new ResponseEntity<>(submissionComment, HttpStatus.CREATED);
    }

    @GetMapping("/comments/{submissionId}")
    public ResponseEntity<List<SubmissionComment>> getCommentsBySubmissionId(
            @PathVariable String submissionId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userServiceClient.getUserProfile(jwt);
        List<SubmissionComment> comments = submissionService.getCommentsBySubmissionId(submissionId, jwt);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
}
