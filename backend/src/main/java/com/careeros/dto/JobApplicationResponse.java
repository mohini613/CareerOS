package com.careeros.dto;
import com.careeros.dto.JobApplicationResponse;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class JobApplicationResponse {
    private Long id;
    private String companyName;
    private String jobTitle;
    private String status;
    private String jobUrl;
    private String location;
    private String jobType;
    private String salaryRange;
    private LocalDate applicationDate;
    private LocalDate followUpDate;
    private LocalDateTime interviewDate;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
}