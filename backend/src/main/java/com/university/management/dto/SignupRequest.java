package com.university.management.dto;
import lombok.Data;
import java.util.UUID;

@Data
public class SignupRequest {
    private String email;
    private String password;
    private String role;
    private UUID departmentId;
}
