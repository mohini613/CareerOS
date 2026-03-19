package com.careeros.repository;

import com.careeros.model.AnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, Long> {
    List<AnalysisResult> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<AnalysisResult> findByResumeIdAndUserIdOrderByCreatedAtDesc(Long resumeId, Long userId);
}