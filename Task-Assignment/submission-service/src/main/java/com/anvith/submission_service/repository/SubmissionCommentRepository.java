package com.anvith.submission_service.repository;

import com.anvith.submission_service.entity.SubmissionComment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SubmissionCommentRepository extends MongoRepository<SubmissionComment, String> {
    List<SubmissionComment> findBySubmissionId(String submissionId);
}
