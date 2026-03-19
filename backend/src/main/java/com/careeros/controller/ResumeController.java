package com.careeros.controller;

import com.careeros.model.Resume;
import com.careeros.repository.ResumeRepository;
import com.careeros.model.User;
import com.careeros.repository.UserRepository;
import com.careeros.security.CustomUserDetailsService;
import com.careeros.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final S3Service s3Service;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    private Long getUserId(Authentication authentication) {
        CustomUserDetailsService.CustomUserDetails userDetails =
                (CustomUserDetailsService.CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUserId();
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        try {
            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null ||
                (!contentType.equals("application/pdf") &&
                 !contentType.equals("application/msword") &&
                 !contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Only PDF and Word documents are allowed"));
            }

            // Validate file size (5MB max)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "File size must be less than 5MB"));
            }

            Long userId = getUserId(authentication);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String s3Key = s3Service.uploadFile(file, userId);

            Resume resume = new Resume();
            resume.setUser(user);
            resume.setFilename(file.getOriginalFilename());
            resume.setS3Key(s3Key);
            resume.setFileSize(file.getSize());
            resume.setContentType(contentType);

            Resume saved = resumeRepository.save(resume);

            return ResponseEntity.ok(Map.of(
                    "id", saved.getId(),
                    "filename", saved.getFilename(),
                    "uploadedAt", saved.getUploadedAt(),
                    "url", s3Service.getFileUrl(s3Key)
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Resume>> getResumes(Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(resumeRepository.findByUserIdOrderByUploadedAtDesc(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(
            Authentication authentication,
            @PathVariable Long id) {
        Long userId = getUserId(authentication);
        Resume resume = resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        s3Service.deleteFile(resume.getS3Key());
        resumeRepository.delete(resume);
        return ResponseEntity.noContent().build();
    }
}