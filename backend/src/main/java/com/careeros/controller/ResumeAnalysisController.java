package com.careeros.controller;

import com.careeros.model.AnalysisResult;
import com.careeros.repository.AnalysisResultRepository;
import com.careeros.security.CustomUserDetailsService;
import com.careeros.service.AIAnalyzerService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeAnalysisController {

    private final AIAnalyzerService aiAnalyzerService;
    private final AnalysisResultRepository analysisResultRepository;

    private Long getUserId(Authentication authentication) {
        CustomUserDetailsService.CustomUserDetails userDetails =
                (CustomUserDetailsService.CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUserId();
    }

    @PostMapping("/{resumeId}/analyze")
    public ResponseEntity<?> analyzeResume(
            Authentication authentication,
            @PathVariable Long resumeId,
            @RequestBody AnalyzeRequest request) {
        try {
            Long userId = getUserId(authentication);
            AnalysisResult result = aiAnalyzerService.analyzeResume(
                    userId,
                    resumeId,
                    request.getJobDescription(),
                    request.getJobTitle(),
                    request.getCompanyName()
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{resumeId}/analysis")
    public ResponseEntity<List<AnalysisResult>> getAnalysisHistory(
            Authentication authentication,
            @PathVariable Long resumeId) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(
                analysisResultRepository.findByResumeIdAndUserIdOrderByCreatedAtDesc(resumeId, userId)
        );
    }

    @GetMapping("/analysis/all")
    public ResponseEntity<List<AnalysisResult>> getAllAnalysis(Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(
                analysisResultRepository.findByUserIdOrderByCreatedAtDesc(userId)
        );
    }

    @Data
    static class AnalyzeRequest {
        private String jobDescription;
        private String jobTitle;
        private String companyName;
    }
}