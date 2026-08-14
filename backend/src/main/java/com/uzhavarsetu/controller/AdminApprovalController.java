package com.uzhavarsetu.controller;

import com.uzhavarsetu.service.AdminApprovalService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/email")
public class AdminApprovalController {

    private final AdminApprovalService approvalService;


    public AdminApprovalController(
            AdminApprovalService approvalService
    ) {
        this.approvalService =
                approvalService;
    }


    // =====================================================
    // APPROVE
    // =====================================================

    @GetMapping("/approve/{token}")
    public ResponseEntity<?> approve(
            @PathVariable String token
    ) {

        approvalService.approveFarmer(
                token
        );


        return ResponseEntity.ok(
                """
                <html>
                <body style="font-family:Arial;text-align:center;padding:50px">

                <h1 style="color:green">
                Farmer Approved Successfully
                </h1>

                <p>
                The farmer account has been activated.
                </p>

                <p>
                Login credentials have been sent
                to the farmer's email.
                </p>

                </body>
                </html>
                """
        );
    }


    // =====================================================
    // REJECT
    // =====================================================

    @GetMapping("/reject/{token}")
    public ResponseEntity<?> reject(
            @PathVariable String token
    ) {

        approvalService.rejectFarmer(
                token
        );


        return ResponseEntity.ok(
                """
                <html>
                <body style="font-family:Arial;text-align:center;padding:50px">

                <h1 style="color:red">
                Farmer Application Rejected
                </h1>

                <p>
                The farmer application has been rejected.
                </p>

                </body>
                </html>
                """
        );
    }
}