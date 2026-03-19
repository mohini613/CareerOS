package com.careeros.controller;

import com.careeros.dto.ConversationRequest;
import com.careeros.dto.ConversationResponse;
import com.careeros.dto.MessageRequest;
import com.careeros.dto.MessageResponse;
import com.careeros.security.CustomUserDetailsService;
import com.careeros.service.AIConversationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class AIConversationController {

    private final AIConversationService conversationService;

    private Long getUserId(Authentication authentication) {
        CustomUserDetailsService.CustomUserDetails userDetails =
                (CustomUserDetailsService.CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUserId();
    }

    @GetMapping
    public ResponseEntity<List<ConversationResponse>> getConversations(
            Authentication authentication) {
        return ResponseEntity.ok(
                conversationService.getUserConversations(getUserId(authentication))
        );
    }

    @PostMapping
    public ResponseEntity<ConversationResponse> createConversation(
            Authentication authentication,
            @Valid @RequestBody ConversationRequest request) {
        return ResponseEntity.ok(
                conversationService.createConversation(getUserId(authentication), request)
        );
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(
            Authentication authentication,
            @PathVariable Long id) {
        return ResponseEntity.ok(
                conversationService.getMessages(getUserId(authentication), id)
        );
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<?> sendMessage(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody MessageRequest request) {
        try {
            return ResponseEntity.ok(
                    conversationService.sendMessage(getUserId(authentication), id, request)
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConversation(
            Authentication authentication,
            @PathVariable Long id) {
        conversationService.deleteConversation(getUserId(authentication), id);
        return ResponseEntity.noContent().build();
    }
}