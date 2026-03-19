package com.careeros.service;

import com.careeros.dto.ConversationRequest;
import com.careeros.dto.ConversationResponse;
import com.careeros.dto.MessageRequest;
import com.careeros.dto.MessageResponse;
import com.careeros.model.AIConversation;
import com.careeros.model.AIMessage;
import com.careeros.model.User;
import com.careeros.repository.AIConversationRepository;
import com.careeros.repository.AIMessageRepository;
import com.careeros.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIConversationService {

    private final AIConversationRepository conversationRepository;
    private final AIMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Value("${nvidia.api-key}")
    private String nvidiaApiKey;

    // Get all conversations for user
    public List<ConversationResponse> getUserConversations(Long userId) {
        return conversationRepository.findByUserIdOrderByStartedAtDesc(userId)
                .stream()
                .map(this::mapToConversationResponse)
                .collect(Collectors.toList());
    }

    // Start new conversation
    public ConversationResponse createConversation(Long userId, ConversationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AIConversation conversation = new AIConversation();
        conversation.setUser(user);
        conversation.setTitle(request.getTitle());
        conversation.setConversationType(
            request.getContext() != null ? request.getContext() : "GENERAL"
        );
        conversation.setIsActive(true);
        conversation.setMessageCount(0);

        return mapToConversationResponse(conversationRepository.save(conversation));
    }

    // Get messages for a conversation
    public List<MessageResponse> getMessages(Long userId, Long conversationId) {
        AIConversation conversation = conversationRepository.findByIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId())
                .stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    // Send message and get AI response
    public MessageResponse sendMessage(Long userId, Long conversationId, MessageRequest request) throws Exception {
        AIConversation conversation = conversationRepository.findByIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        // Save user message
        AIMessage userMessage = new AIMessage();
        userMessage.setConversation(conversation);
        userMessage.setRole("user");
        userMessage.setContent(request.getContent());
        messageRepository.save(userMessage);

        // Get conversation history for context
        List<AIMessage> history = messageRepository
                .findByConversationIdOrderByCreatedAtAsc(conversationId);

        // Call AI
        String aiResponse = callNvidiaAPI(history, conversation.getConversationType());

        // Save AI response
        AIMessage assistantMessage = new AIMessage();
        assistantMessage.setConversation(conversation);
        assistantMessage.setRole("assistant");
        assistantMessage.setContent(aiResponse);
        messageRepository.save(assistantMessage);

        // Update conversation message count
        conversation.setMessageCount(conversation.getMessageCount() + 2);
        conversationRepository.save(conversation);

        return mapToMessageResponse(assistantMessage);
    }

    // Delete conversation
    public void deleteConversation(Long userId, Long conversationId) {
        AIConversation conversation = conversationRepository.findByIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        conversationRepository.delete(conversation);
    }

    private String callNvidiaAPI(List<AIMessage> history, String conversationType) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        // Build system prompt based on conversation type
        String systemPrompt = buildSystemPrompt(conversationType);

        // Build messages array with history
        List<Map<String, Object>> messages = new ArrayList<>();

        // Add system message
        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemPrompt);
        messages.add(systemMessage);

        // Add conversation history
        for (AIMessage msg : history) {
            Map<String, Object> message = new HashMap<>();
            message.put("role", msg.getRole());
            message.put("content", msg.getContent());
            messages.add(message);
        }

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "meta/llama-3.2-3b-instruct");
        requestBody.put("temperature", 0.7);
        requestBody.put("top_p", 0.9);
        requestBody.put("max_tokens", 1024);
        requestBody.put("stream", false);
        requestBody.put("messages", messages);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://integrate.api.nvidia.com/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + nvidiaApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(requestBody)))
                .build();

        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("AI API error: " + response.body());
        }

        JsonNode responseJson = objectMapper.readTree(response.body());
        return responseJson.get("choices").get(0).get("message").get("content").asText();
    }

    private String buildSystemPrompt(String conversationType) {
        return switch (conversationType.toUpperCase()) {
            case "RESUME_REVIEW" -> """
                    You are an expert career coach specializing in resume optimization.
                    Help the user improve their resume, suggest better wording,
                    highlight achievements, and make it ATS-friendly.
                    Be specific and actionable in your feedback.
                    """;
            case "INTERVIEW_PREP" -> """
                    You are an expert interview coach.
                    Help the user prepare for job interviews by practicing
                    common questions, providing feedback on answers,
                    and sharing tips for different interview types.
                    """;
            case "CAREER_ADVICE" -> """
                    You are a senior career advisor with 20 years of experience.
                    Help the user make career decisions, plan their career path,
                    understand industry trends, and achieve their professional goals.
                    """;
            case "SALARY_NEGOTIATION" -> """
                    You are an expert in salary negotiation.
                    Help the user understand their market value,
                    prepare negotiation scripts, and maximize their compensation package.
                    """;
            default -> """
                    You are CareerOS AI, an intelligent career assistant.
                    Help users with job searching, career planning, resume writing,
                    interview preparation, and professional development.
                    Be helpful, encouraging, and specific in your advice.
                    """;
        };
    }

    private ConversationResponse mapToConversationResponse(AIConversation conversation) {
        ConversationResponse response = new ConversationResponse();
        response.setId(conversation.getId());
        response.setTitle(conversation.getTitle());
        response.setConversationType(conversation.getConversationType());
        response.setIsActive(conversation.getIsActive());
        response.setMessageCount(conversation.getMessageCount());
        response.setStartedAt(conversation.getStartedAt());
        response.setLastMessageAt(conversation.getLastMessageAt());
        return response;
    }

    private MessageResponse mapToMessageResponse(AIMessage message) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setRole(message.getRole());
        response.setContent(message.getContent());
        response.setCreatedAt(message.getCreatedAt());
        return response;
    }
}