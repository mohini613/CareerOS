package com.careeros.service;

import com.careeros.model.AnalysisResult;
import com.careeros.model.Resume;
import com.careeros.model.User;
import com.careeros.repository.AnalysisResultRepository;
import com.careeros.repository.ResumeRepository;
import com.careeros.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIAnalyzerService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final AnalysisResultRepository analysisResultRepository;
    private final S3Client s3Client;
    private final ObjectMapper objectMapper;

    @Value("${nvidia.api-key}")
    private String nvidiaApiKey;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public AnalysisResult analyzeResume(Long userId, Long resumeId, String jobDescription,
                                         String jobTitle, String companyName) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        String resumeText = downloadResumeFromS3(resume.getS3Key());
        String prompt = buildPrompt(resumeText, jobDescription, jobTitle, companyName);
        String aiResponse = callNvidiaAPI(prompt);
        return parseAndSaveResult(user, resume, jobDescription, jobTitle, companyName, aiResponse);
    }

    private String downloadResumeFromS3(String s3Key) throws Exception {
    GetObjectRequest getObjectRequest = GetObjectRequest.builder()
            .bucket(bucketName)
            .key(s3Key)
            .build();
    byte[] bytes = s3Client.getObjectAsBytes(getObjectRequest).asByteArray();
    
    // Extract readable text only, remove binary/special chars
    String rawText = new String(bytes, StandardCharsets.UTF_8)
            .replaceAll("[^\\x20-\\x7E\\n\\r\\t]", " ")  // keep only printable ASCII
            .replaceAll("\\s+", " ")                       // collapse whitespace
            .trim();

    // Limit to 3000 characters to stay within token limits
    if (rawText.length() > 3000) {
        rawText = rawText.substring(0, 3000);
    }

    return rawText;
}

    private String buildPrompt(String resumeText, String jobDescription,
                            String jobTitle, String companyName) {
    return String.format("""
            Analyze this resume against the job description. Reply ONLY with valid JSON, no explanation.
            
            RESUME: %s
            
            JOB: %s at %s - %s
            
            JSON format:
            {"matchScore":85,"strengths":"skill1,skill2","weaknesses":"gap1,gap2","suggestions":"tip1,tip2","missingKeywords":"kw1,kw2","summary":"One sentence assessment."}
            """,
            resumeText.substring(0, Math.min(resumeText.length(), 1500)),
            jobTitle != null ? jobTitle : "N/A",
            companyName != null ? companyName : "N/A",
            jobDescription.substring(0, Math.min(jobDescription.length(), 500)));
}

    private String callNvidiaAPI(String prompt) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "meta/llama-3.2-3b-instruct");
        requestBody.put("temperature", 0.2);
        requestBody.put("top_p", 0.7);
requestBody.put("max_tokens", 2048);
        requestBody.put("stream", false);
        requestBody.put("messages", List.of(message));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://integrate.api.nvidia.com/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + nvidiaApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(requestBody)))
                .build();

        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("NVIDIA API error: " + response.body());
        }

        JsonNode responseJson = objectMapper.readTree(response.body());
        return responseJson.get("choices").get(0).get("message").get("content").asText();
    }

    private AnalysisResult parseAndSaveResult(User user, Resume resume,
            String jobDescription, String jobTitle, String companyName,
            String aiResponse) throws Exception {

        String cleanResponse = aiResponse
                .replaceAll("```json\\s*", "")
                .replaceAll("```\\s*", "")
                .trim();

        JsonNode json = objectMapper.readTree(cleanResponse);

        AnalysisResult result = new AnalysisResult();
        result.setUser(user);
        result.setResume(resume);
        result.setJobDescription(jobDescription);
        result.setJobTitle(jobTitle);
        result.setCompanyName(companyName);
        result.setMatchScore(json.get("matchScore").asInt());
        result.setStrengths(json.get("strengths").asText());
        result.setWeaknesses(json.get("weaknesses").asText());
        result.setSuggestions(json.get("suggestions").asText());
        result.setMissingKeywords(json.get("missingKeywords").asText());
        result.setFullAnalysis(json.get("summary").asText());

        return analysisResultRepository.save(result);
    }
}