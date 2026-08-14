package com.uzhavarsetu.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {


    // =========================================
    // Validation errors
    // =========================================

    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<Map<String, Object>>
    handleValidationException(
            MethodArgumentNotValidException exception
    ) {

        Map<String, Object> response =
                new HashMap<>();


        Map<String, String> errors =
                new HashMap<>();


        exception
                .getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );


        response.put(
                "success",
                false
        );


        response.put(
                "message",
                "Validation failed"
        );


        response.put(
                "errors",
                errors
        );


        return ResponseEntity
                .badRequest()
                .body(response);
    }


    // =========================================
    // Business errors
    // =========================================

    @ExceptionHandler(
            IllegalArgumentException.class
    )
    public ResponseEntity<Map<String, Object>>
    handleIllegalArgumentException(
            IllegalArgumentException exception
    ) {

        Map<String, Object> response =
                new HashMap<>();


        response.put(
                "success",
                false
        );


        response.put(
                "message",
                exception.getMessage()
        );


        return ResponseEntity
                .status(
                        HttpStatus.BAD_REQUEST
                )
                .body(response);
    }


    // =========================================
    // Unexpected errors
    // =========================================

    @ExceptionHandler(
            Exception.class
    )
    public ResponseEntity<Map<String, Object>>
    handleGeneralException(
            Exception exception
    ) {

        Map<String, Object> response =
                new HashMap<>();


        response.put(
                "success",
                false
        );


        // Do NOT expose exception.getMessage()
        // to the client for unexpected errors.

        response.put(
                "message",
                "Internal server error"
        );


        return ResponseEntity
                .status(
                        HttpStatus.INTERNAL_SERVER_ERROR
                )
                .body(response);
    }
}