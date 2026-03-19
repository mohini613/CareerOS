package com.careeros.controller;

import com.careeros.dto.JobApplicationRequest;
import com.careeros.dto.JobApplicationResponse;
import com.careeros.dto.UpdateApplicationStatusRequest;
import com.careeros.security.CustomUserDetailsService;
import com.careeros.service.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    private Long getUserId(Authentication authentication) {
        CustomUserDetailsService.CustomUserDetails userDetails =
                (CustomUserDetailsService.CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUserId();
    }

    @GetMapping
    public ResponseEntity<List<JobApplicationResponse>> getApplications(Authentication authentication) {
        return ResponseEntity.ok(jobApplicationService.getUserApplications(getUserId(authentication)));
    }

    @PostMapping
    public ResponseEntity<JobApplicationResponse> createApplication(
            Authentication authentication,
            @Valid @RequestBody JobApplicationRequest request) {
        return ResponseEntity.ok(jobApplicationService.createApplication(getUserId(authentication), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> updateApplication(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationRequest request) {
        return ResponseEntity.ok(jobApplicationService.updateApplication(getUserId(authentication), id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplicationResponse> updateStatus(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationStatusRequest request) {
        return ResponseEntity.ok(jobApplicationService.updateStatus(getUserId(authentication), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            Authentication authentication,
            @PathVariable Long id) {
        jobApplicationService.deleteApplication(getUserId(authentication), id);
        return ResponseEntity.noContent().build();
    }
}