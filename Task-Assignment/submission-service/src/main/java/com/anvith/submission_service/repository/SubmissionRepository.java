package com.anvith.submission_service.repository;

import com.anvith.submission_service.entity.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SubmissionRepository extends MongoRepository<Submission, String> {
    List<Submission> findByTaskId(String taskId);
    Page<Submission> findAll(Pageable pageable); // Add pagination
    Page<Submission> findByTaskId(String taskId, Pageable pageable); // Add pagination
}
