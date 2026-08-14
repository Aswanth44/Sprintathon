package com.uzhavarsetu.service;

import com.uzhavarsetu.dto.FarmerRegistrationRequest;

import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

@Service
public class FarmerEmailService {

    private final JavaMailSender mailSender;

    @Value("${admin.email}")
    private String adminEmail;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public FarmerEmailService(
            JavaMailSender mailSender
    ) {
        this.mailSender = mailSender;
    }


    // =====================================================
    // SEND FARMER APPLICATION TO ADMIN
    // =====================================================

    public void sendFarmerApplicationToAdmin(

            FarmerRegistrationRequest request,

            MultipartFile identityDocument,
            MultipartFile landDocument,
            MultipartFile addressDocument,

            MultipartFile farmerIdDocument,
            MultipartFile landTaxDocument,
            MultipartFile bankDocument,
            MultipartFile farmerPhoto,

            String approvalToken

    ) throws Exception {


        // =================================================
        // CREATE EMAIL
        // =================================================

        MimeMessage message =
                mailSender.createMimeMessage();


        /*
         * true = multipart email
         *
         * Required because we are sending
         * HTML + file attachments.
         */
        MimeMessageHelper helper =
                new MimeMessageHelper(
                        message,
                        true
                );


        // =================================================
        // ADMIN EMAIL
        // =================================================

        helper.setTo(adminEmail);


        // =================================================
        // SUBJECT
        // =================================================

        helper.setSubject(
                "UzhavarSetu - New Farmer Application - "
                        + request.getFullName()
        );


        // =================================================
        // APPROVE URL
        // =================================================

        /*
         * FOR LOCAL TESTING
         *
         * Gmail and Spring Boot must be running
         * on the same computer.
         */
        String approveUrl =
                "http://localhost:8080"
                        + "/api/admin/email/approve/"
                        + approvalToken;


        // =================================================
        // REJECT URL
        // =================================================

        String rejectUrl =
                "http://localhost:8080"
                        + "/api/admin/email/reject/"
                        + approvalToken;


        // =================================================
        // HTML EMAIL BODY
        // =================================================

        String htmlBody = """

                <html>

                <body style="
                    font-family: Arial, sans-serif;
                    background-color: #f5f7f5;
                    padding: 20px;
                ">

                <div style="
                    max-width: 700px;
                    margin: auto;
                    background-color: white;
                    padding: 30px;
                    border-radius: 10px;
                    border: 1px solid #dddddd;
                ">


                <!-- HEADER -->

                <h2 style="
                    color: #176b45;
                    margin-bottom: 5px;
                ">
                    UzhavarSetu
                </h2>


                <h3 style="
                    color: #333333;
                    margin-top: 5px;
                ">
                    New Farmer Registration Application
                </h3>


                <hr>


                <!-- FARMER DETAILS -->

                <h3 style="
                    color: #176b45;
                ">
                    Farmer Details
                </h3>


                <table style="
                    width: 100%%;
                    border-collapse: collapse;
                ">


                <tr>
                    <td style="
                        padding: 8px;
                        font-weight: bold;
                    ">
                        Full Name
                    </td>

                    <td style="
                        padding: 8px;
                    ">
                        %s
                    </td>
                </tr>


                <tr>
                    <td style="
                        padding: 8px;
                        font-weight: bold;
                    ">
                        Mobile
                    </td>

                    <td style="
                        padding: 8px;
                    ">
                        %s
                    </td>
                </tr>


                <tr>
                    <td style="
                        padding: 8px;
                        font-weight: bold;
                    ">
                        Email
                    </td>

                    <td style="
                        padding: 8px;
                    ">
                        %s
                    </td>
                </tr>


                <tr>
                    <td style="
                        padding: 8px;
                        font-weight: bold;
                    ">
                        Village
                    </td>

                    <td style="
                        padding: 8px;
                    ">
                        %s
                    </td>
                </tr>


                <tr>
                    <td style="
                        padding: 8px;
                        font-weight: bold;
                    ">
                        District
                    </td>

                    <td style="
                        padding: 8px;
                    ">
                        %s
                    </td>
                </tr>


                <tr>
                    <td style="
                        padding: 8px;
                        font-weight: bold;
                    ">
                        State
                    </td>

                    <td style="
                        padding: 8px;
                    ">
                        %s
                    </td>
                </tr>


                <tr>
                    <td style="
                        padding: 8px;
                        font-weight: bold;
                    ">
                        Farm Size
                    </td>

                    <td style="
                        padding: 8px;
                    ">
                        %s acres
                    </td>
                </tr>


                </table>


                <hr>


                <!-- DOCUMENT INFORMATION -->

                <h3 style="
                    color: #176b45;
                ">
                    Documents
                </h3>


                <p>
                    The farmer's submitted documents are
                    attached to this email.
                </p>


                <p>
                    Please manually verify all documents
                    before approving this farmer.
                </p>


                <p>
                    Required documents:
                </p>


                <ul>

                    <li>
                        Identity / Government ID
                    </li>

                    <li>
                        Land Ownership Document
                    </li>

                    <li>
                        Address Proof
                    </li>

                </ul>


                <p>
                    Optional documents, if provided:
                </p>


                <ul>

                    <li>
                        Farmer Registration ID
                    </li>

                    <li>
                        Land Tax / Revenue Record
                    </li>

                    <li>
                        Bank Passbook / Cancelled Cheque
                    </li>

                    <li>
                        Farmer Photo
                    </li>

                </ul>


                <hr>


                <!-- STATUS -->

                <div style="
                    background-color: #fff3cd;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 25px;
                ">

                    <strong>
                        Application Status:
                    </strong>

                    PENDING ADMIN VERIFICATION

                </div>


                <!-- APPROVAL SECTION -->

                <h3 style="
                    color: #333333;
                ">
                    Admin Action
                </h3>


                <p>
                    After checking all the submitted
                    documents, choose one of the following:
                </p>


                <div style="
                    text-align: center;
                    margin-top: 30px;
                    margin-bottom: 30px;
                ">


                    <!-- APPROVE BUTTON -->

                    <a href="%s"
                       style="
                       display: inline-block;
                       background-color: #198754;
                       color: white;
                       padding: 14px 28px;
                       text-decoration: none;
                       border-radius: 6px;
                       font-weight: bold;
                       margin-right: 10px;
                       ">

                        APPROVE FARMER

                    </a>


                    <!-- REJECT BUTTON -->

                    <a href="%s"
                       style="
                       display: inline-block;
                       background-color: #dc3545;
                       color: white;
                       padding: 14px 28px;
                       text-decoration: none;
                       border-radius: 6px;
                       font-weight: bold;
                       margin-left: 10px;
                       ">

                        REJECT FARMER

                    </a>


                </div>


                <hr>


                <p style="
                    color: #777777;
                    font-size: 12px;
                ">

                    UzhavarSetu Farmer Verification System

                </p>


                </div>

                </body>

                </html>

                """.formatted(

                // Farmer details

                request.getFullName(),

                request.getMobile(),

                request.getEmail(),

                request.getVillage(),

                request.getDistrict(),

                request.getState(),

                request.getFarmSize(),

                // Buttons

                approveUrl,

                rejectUrl
        );


        // =================================================
        // SET HTML BODY
        // =================================================

        /*
         * VERY IMPORTANT:
         *
         * true means the email is HTML.
         */
        helper.setText(
                htmlBody,
                true
        );


        // =================================================
        // REQUIRED DOCUMENTS
        // =================================================

        addRequiredAttachment(
                helper,
                identityDocument,
                "Identity / Government ID"
        );


        addRequiredAttachment(
                helper,
                landDocument,
                "Land Ownership Document"
        );


        addRequiredAttachment(
                helper,
                addressDocument,
                "Address Proof"
        );


        // =================================================
        // OPTIONAL DOCUMENTS
        // =================================================

        addOptionalAttachment(
                helper,
                farmerIdDocument,
                "Farmer Registration ID"
        );


        addOptionalAttachment(
                helper,
                landTaxDocument,
                "Land Tax / Revenue Record"
        );


        addOptionalAttachment(
                helper,
                bankDocument,
                "Bank Passbook / Cancelled Cheque"
        );


        addOptionalAttachment(
                helper,
                farmerPhoto,
                "Farmer Photo"
        );


        // =================================================
        // SEND EMAIL
        // =================================================

        mailSender.send(message);


        // =================================================
        // CONSOLE INFORMATION
        // =================================================

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "Farmer application email sent"
        );

        System.out.println(
                "Admin email: " + adminEmail
        );

        System.out.println(
                "Farmer: "
                        + request.getFullName()
        );

        System.out.println(
                "Approve URL:"
        );

        System.out.println(
                approveUrl
        );

        System.out.println(
                "Reject URL:"
        );

        System.out.println(
                rejectUrl
        );

        System.out.println(
                "=========================================="
        );
    }


    // =====================================================
    // REQUIRED ATTACHMENT
    // =====================================================

    private void addRequiredAttachment(
            MimeMessageHelper helper,
            MultipartFile file,
            String documentName
    ) throws Exception {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    documentName + " is required."
            );
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null || fileName.isBlank()) {
            fileName = documentName;
        }

        String contentType = getSafeContentType(fileName);

        helper.addAttachment(
                fileName,
                new ByteArrayResource(file.getBytes()),
                contentType
        );

        System.out.println(
                "Attached: " + fileName +
                        " | type: " + contentType
        );
    }


    private void addOptionalAttachment(
            MimeMessageHelper helper,
            MultipartFile file,
            String documentName
    ) throws Exception {

        if (file == null || file.isEmpty()) {
            System.out.println(
                    "Optional document not uploaded: "
                            + documentName
            );
            return;
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null || fileName.isBlank()) {
            fileName = documentName;
        }

        String contentType = getSafeContentType(fileName);

        helper.addAttachment(
                fileName,
                new ByteArrayResource(file.getBytes()),
                contentType
        );

        System.out.println(
                "Attached: " + fileName +
                        " | type: " + contentType
        );
    }
    private String getSafeContentType(String fileName) {

        String lowerName =
                fileName.toLowerCase();

        if (lowerName.endsWith(".pdf")) {
            return "application/pdf";
        }

        if (lowerName.endsWith(".jpg")
                || lowerName.endsWith(".jpeg")) {
            return "image/jpeg";
        }

        if (lowerName.endsWith(".png")) {
            return "image/png";
        }

        if (lowerName.endsWith(".doc")) {
            return "application/msword";
        }

        if (lowerName.endsWith(".docx")) {
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        if (lowerName.endsWith(".xls")) {
            return "application/vnd.ms-excel";
        }

        if (lowerName.endsWith(".xlsx")) {
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }

        return "application/octet-stream";
    }
}