package com.careeros.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConversationResponse {
    private Long id;
    private String title;
    private String conversationType;
    private Boolean isActive;
    private Integer messageCount;
    private LocalDateTime startedAt;
    private LocalDateTime lastMessageAt;
}