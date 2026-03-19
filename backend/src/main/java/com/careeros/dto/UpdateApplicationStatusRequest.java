package com.careeros.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateApplicationStatusRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "APPLIED|SCREENING|INTERVIEW|TECHNICAL|OFFER|REJECTED|WITHDRAWN|ACCEPTED",
             message = "Invalid status")
    private String status;
}