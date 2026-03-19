package com.careeros.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class JobApplicationRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    private String jobUrl;
    private String location;
    private String jobType;
    private String salaryRange;
    private LocalDate applicationDate;
    private LocalDate followUpDate;
    private LocalDateTime interviewDate;
    private String notes;
}