package com.anvith.submission_service.serivces;

import com.anvith.submission_service.entity.*;
import com.anvith.submission_service.fiegnClient.TaskServiceClient;
import com.anvith.submission_service.fiegnClient.UserServiceClient;
import com.anvith.submission_service.repository.SubmissionCommentRepository;
import com.anvith.submission_service.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private TaskServiceClient taskServiceClient;

    @Autowired
    private UserServiceClient userServiceClient;

    @Autowired
    private SubmissionCommentRepository commentRepository;

    public Submission submitTask(String taskId, String gitHubLink, String userId, String jwt) throws Exception {
        Task task = taskServiceClient.getTaskById(taskId, jwt);
        if (task == null) {
            throw new Exception("Task Not Found with ID: " + taskId);
        }
        if (task.getStatus() != TaskStatus.ASSIGNED) {
            throw new Exception("Task is not in ASSIGNED state. Current status: " + task.getStatus());
        }

        boolean isAssignedToUser = false;
        List<String> assignedIds = task.getAssignedUserIds();
        if (assignedIds == null || assignedIds.isEmpty()) {
            isAssignedToUser = true; // Task is open to all users
        } else if (assignedIds.contains(userId)) {
            isAssignedToUser = true; // Task is explicitly assigned to the user
        }

        if (!isAssignedToUser) {
            throw new Exception("Task is not assigned to this user.");
        }

        Submission submission = new Submission();
        submission.setTaskId(taskId);
        submission.setUserId(userId);
        submission.setGitHubLink(gitHubLink);
        submission.setSubmissionTime(LocalDateTime.now());
        return submissionRepository.save(submission);
    }

    public Submission getTaskSubmissionById(String submissionId, String jwt) throws Exception {
        return submissionRepository.findById(submissionId)
                .orElseThrow(() -> new Exception("Task Submission Not Found with ID: " + submissionId));
    }

    public Page<Submission> getAllTaskSubmission(String jwt, Pageable pageable) {
        return submissionRepository.findAll(pageable);
    }

    public Page<Submission> getTaskSubmissionsByTaskId(String taskId, String jwt, Pageable pageable) {
        return submissionRepository.findByTaskId(taskId, pageable);
    }

    public SubmissionComment addComment(String submissionId, String comment, String userId) throws Exception {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new Exception("Submission Not Found with ID: " + submissionId));

        SubmissionComment submissionComment = new SubmissionComment();
        submissionComment.setSubmissionId(submissionId);
        submissionComment.setComment(comment);
        submissionComment.setComment(userId);
        submissionComment.setCreatedAt(LocalDateTime.now());

        return commentRepository.save(submissionComment);
    }

    public Submission acceptDeclineSubmission(String submissionId, String statusStr, String jwt) throws Exception {
        Submission submission = getTaskSubmissionById(submissionId, jwt);
        SubmissionStatus status = SubmissionStatus.valueOf(statusStr.toUpperCase());
        submission.setStatus(status);

        if (status == SubmissionStatus.ACCEPTED) {
            taskServiceClient.completeTask(submission.getTaskId(), jwt); // Completes task if accepted
        }

        return submissionRepository.save(submission);
    }

    public List<SubmissionComment> getCommentsBySubmissionId(String submissionId, String jwt) throws Exception {
        getTaskSubmissionById(submissionId, jwt); // Validate submission exists
        return commentRepository.findBySubmissionId(submissionId);
    }
    public Submission updateSubmissionStatus(String submissionId, String status, String jwt) throws Exception {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new Exception("Submission Not Found with ID: " + submissionId));

        SubmissionStatus submissionStatus;
        try {
            submissionStatus = SubmissionStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new Exception("Invalid status: " + status);
        }

        submission.setStatus(submissionStatus);
        submission = submissionRepository.save(submission);

        // If submission is ACCEPTED, update the task status to DONE
        if (submissionStatus == SubmissionStatus.ACCEPTED) {
            try {
                taskServiceClient.completeTask(submission.getTaskId(), jwt);
            } catch (Exception e) {
                throw new Exception("Failed to update task status to DONE: " + e.getMessage());
            }
        }

        return submission;
    }

    public Page<Submission> getAllSubmissions(Pageable pageable) {
        return submissionRepository.findAll(pageable);
    }

    public List<Submission> getTaskSubmissions(String taskId) {
        return submissionRepository.findByTaskId(taskId);
    }

    public List<SubmissionComment> getComments(String submissionId) {
        return commentRepository.findBySubmissionId(submissionId);
    }

}
