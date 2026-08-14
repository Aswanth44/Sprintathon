package com.uzhavarsetu.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FarmerDocumentStorageService {

    private final Path uploadDirectory;

    public FarmerDocumentStorageService(
            @Value("${farmer.documents.path:uploads/farmers}") String uploadPath
    ) {
        this.uploadDirectory = Paths.get(uploadPath)
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not create document upload directory"
            );
        }
    }

    public String saveDocument(
            MultipartFile file,
            String documentType,
            String email
    ) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    documentType + " document is required"
            );
        }

        // Maximum 5 MB
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException(
                    documentType + " document must be less than 5 MB"
            );
        }

        String originalName = file.getOriginalFilename();

        if (originalName == null || originalName.isBlank()) {
            throw new IllegalArgumentException(
                    "Invalid " + documentType + " file"
            );
        }

        String extension = getExtension(originalName);

        // Only allow these extensions
        if (!extension.matches(
                "\\.(pdf|jpg|jpeg|png)"
        )) {
            throw new IllegalArgumentException(
                    documentType +
                            " must be PDF, JPG, JPEG or PNG"
            );
        }

        // Generate safe filename.
        // Never use user's original filename directly.
        String safeEmail = email
                .replaceAll("[^a-zA-Z0-9]", "_");

        String generatedName =
                safeEmail
                        + "_"
                        + documentType.toLowerCase()
                        + "_"
                        + UUID.randomUUID()
                        + extension;

        Path destination =
                uploadDirectory.resolve(generatedName)
                        .normalize();

        // Security: make sure destination remains inside upload directory
        if (!destination.startsWith(uploadDirectory)) {
            throw new IllegalArgumentException(
                    "Invalid file path"
            );
        }

        try {

            Files.copy(
                    file.getInputStream(),
                    destination,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return destination.toString();

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save " + documentType + " document"
            );
        }
    }


    private String getExtension(String filename) {

        int index = filename.lastIndexOf('.');

        if (index == -1) {
            return "";
        }

        return filename
                .substring(index)
                .toLowerCase();
    }
}