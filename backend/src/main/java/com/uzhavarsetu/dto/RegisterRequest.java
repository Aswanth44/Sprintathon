package com.uzhavarsetu.dto;

public record RegisterRequest(

        String businessName,

        String contactPerson,

        String buyerType,

        String mobile,

        String email,

        String businessLocation,

        String password

) {
}