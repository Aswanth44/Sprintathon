package com.uzhavarsetu.controller;

import com.uzhavarsetu.dto.FarmerRegistrationRequest;
import com.uzhavarsetu.service.FarmerService;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/farmer")
public class FarmerController {

    private final FarmerService farmerService;

    public FarmerController(
            FarmerService farmerService
    ) {
        this.farmerService = farmerService;
    }

    @PostMapping(
            value = "/register",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> registerFarmer(MultipartHttpServletRequest request) {
        String fullName = firstNonBlank(request.getParameter("fullName"), request.getParameter("name"), request.getParameter("full_name"));
        String mobile = firstNonBlank(request.getParameter("mobile"), request.getParameter("phone"));
        String email = firstNonBlank(request.getParameter("email"));
        String village = firstNonBlank(request.getParameter("village"));
        String district = firstNonBlank(request.getParameter("district"));
        String state = firstNonBlank(request.getParameter("state"));
        String farmSizeRaw = firstNonBlank(request.getParameter("farmSize"), request.getParameter("landSize"), request.getParameter("farm_size"));

        Double farmSize = null;
        if (farmSizeRaw != null) {
            try {
                farmSize = Double.parseDouble(farmSizeRaw);
            } catch (NumberFormatException ignored) {
                farmSize = null;
            }
        }

        Map<String, MultipartFile> files = request.getFileMap();
        MultipartFile identityDocument = firstFile(files, "identityDocument", "identityProof", "idDocument", "govtId", "governmentId", "identityProofDocument");
        MultipartFile landDocument = firstFile(files, "landDocument", "landProof", "landOwnershipDocument", "landRecord" );
        MultipartFile addressDocument = firstFile(files, "addressDocument", "addressProof", "residentProof", "addressProofDocument");
        MultipartFile farmerIdDocument = firstFile(files, "farmerIdDocument", "farmerId", "farmerIdProof");
        MultipartFile landTaxDocument = firstFile(files, "landTaxDocument", "landTaxProof", "landTaxRecord");
        MultipartFile bankDocument = firstFile(files, "bankDocument", "bankProof", "bankPassbook", "cancelledCheque");
        MultipartFile farmerPhoto = firstFile(files, "farmerPhoto", "photo", "profilePhoto");

        FarmerRegistrationRequest dto = new FarmerRegistrationRequest();
        dto.setFullName(fullName);
        dto.setMobile(mobile);
        dto.setEmail(email);
        dto.setVillage(village);
        dto.setDistrict(district);
        dto.setState(state);
        dto.setFarmSize(farmSize);

        return registerFarmerInternal(
                dto,
                identityDocument,
                landDocument,
                addressDocument,
                farmerIdDocument,
                landTaxDocument,
                bankDocument,
                farmerPhoto
        );
    }

    @PostMapping(
            value = "/register",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> registerFarmerJson(
            @RequestBody FarmerRegistrationRequest request
    ) {
        return registerFarmerInternal(
                request,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
    }

    private ResponseEntity<?> registerFarmerInternal(
            FarmerRegistrationRequest request,
            MultipartFile identityDocument,
            MultipartFile landDocument,
            MultipartFile addressDocument,
            MultipartFile farmerIdDocument,
            MultipartFile landTaxDocument,
            MultipartFile bankDocument,
            MultipartFile farmerPhoto
    ) {
        if (request == null) {
            throw new IllegalArgumentException("Farmer registration data is required.");
        }

        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Full name is required.");
        }

        if (request.getMobile() == null || request.getMobile().trim().isEmpty()) {
            throw new IllegalArgumentException("Mobile number is required.");
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required.");
        }

        if (request.getVillage() == null || request.getVillage().trim().isEmpty()) {
            throw new IllegalArgumentException("Village is required.");
        }

        if (request.getDistrict() == null || request.getDistrict().trim().isEmpty()) {
            throw new IllegalArgumentException("District is required.");
        }

        if (request.getState() == null || request.getState().trim().isEmpty()) {
            throw new IllegalArgumentException("State is required.");
        }

        if (request.getFarmSize() == null || request.getFarmSize() <= 0) {
            throw new IllegalArgumentException("Farm size must be greater than zero.");
        }

        if (identityDocument == null || identityDocument.isEmpty()) {
            throw new IllegalArgumentException("Identity document is required.");
        }

        if (landDocument == null || landDocument.isEmpty()) {
            throw new IllegalArgumentException("Land document is required.");
        }

        if (addressDocument == null || addressDocument.isEmpty()) {
            throw new IllegalArgumentException("Address document is required.");
        }

        farmerService.registerFarmer(
                request,
                identityDocument,
                landDocument,
                addressDocument,
                farmerIdDocument,
                landTaxDocument,
                bankDocument,
                farmerPhoto
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "success", true,
                        "message", "Farmer registration submitted successfully. Waiting for verification."
                ));
    }

    private String firstNonBlank(String... values) {
        return Arrays.stream(values)
                .filter(value -> value != null && !value.trim().isEmpty())
                .findFirst()
                .orElse(null);
    }

    private MultipartFile firstFile(Map<String, MultipartFile> files, String... names) {
        for (String name : names) {
            MultipartFile file = files.get(name);
            if (file != null) {
                return file;
            }
        }
        return null;
    }
}