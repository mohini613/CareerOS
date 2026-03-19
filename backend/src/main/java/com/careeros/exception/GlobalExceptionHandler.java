package com.careeros.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(fieldName, message);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", 400);
        response.put("error", "Validation Failed");
        response.put("errors", errors);

        return ResponseEntity.badRequest().body(response);
    }

    // Handle not found errors
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (ex.getMessage() != null) {
            if (ex.getMessage().contains("not found")) {
                status = HttpStatus.NOT_FOUND;
            } else if (ex.getMessage().contains("already exists") ||
                       ex.getMessage().contains("already registered")) {
                status = HttpStatus.CONFLICT;
            } else if (ex.getMessage().contains("unauthorized") ||
                       ex.getMessage().contains("Invalid token")) {
                status = HttpStatus.UNAUTHORIZED;
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", status.value());
        response.put("error", status.getReasonPhrase());
        response.put("message", ex.getMessage());

        return ResponseEntity.status(status).body(response);
    }

    // Handle file size exceeded
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxUploadSize(
            MaxUploadSizeExceededException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", 400);
        response.put("error", "File Too Large");
        response.put("message", "File size must be less than 5MB");

        return ResponseEntity.badRequest().body(response);
    }

    // Handle illegal arguments
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(
            IllegalArgumentException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", 400);
        response.put("error", "Bad Request");
        response.put("message", ex.getMessage());

        return ResponseEntity.badRequest().body(response);
    }
}