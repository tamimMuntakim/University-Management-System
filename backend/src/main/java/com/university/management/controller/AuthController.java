package com.university.management.controller;

import com.university.management.dto.LoginRequest;
import com.university.management.dto.SignupRequest;
import com.university.management.entity.*;
import com.university.management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private FacultyProfileRepository facultyProfileRepository;

    @Autowired
    private LoginLogRepository loginLogRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder encoder;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPasswordHash(encoder.encode(signUpRequest.getPassword()));

        String requestedRole = signUpRequest.getRole() == null ? "ROLE_STUDENT" : signUpRequest.getRole();
        
        Optional<Role> roleOpt = roleRepository.findByRoleName(requestedRole);
        Role role = roleOpt.orElseGet(() -> {
            Role newRole = new Role();
            newRole.setRoleName(requestedRole);
            return roleRepository.save(newRole);
        });
        
        user.setRole(role);
        User savedUser = userRepository.save(user);

        // Auto-create profiles based on role
        if ("ROLE_STUDENT".equals(requestedRole)) {
            StudentProfile student = new StudentProfile();
            student.setUser(savedUser);
            // Format: STU-YYYY-RANDOM (4 digits)
            String year = String.valueOf(LocalDate.now().getYear());
            String randomId = String.format("%04d", (int)(Math.random() * 10000));
            student.setStudentRegId("STU-" + year + "-" + randomId);
            
            // Set department if provided
            if (signUpRequest.getDepartmentId() != null) {
                departmentRepository.findById(signUpRequest.getDepartmentId())
                    .ifPresent(student::setDepartment);
            }
            
            studentProfileRepository.save(student);
        } else if ("ROLE_FACULTY".equals(requestedRole)) {
            FacultyProfile faculty = new FacultyProfile();
            faculty.setUser(savedUser);
            String year = String.valueOf(LocalDate.now().getYear());
            String randomId = String.format("%03d", (int)(Math.random() * 1000));
            faculty.setFacultyStaffId("FAC-" + year + "-" + randomId);
            faculty.setJoiningDate(LocalDate.now());

            // Set department if provided
            if (signUpRequest.getDepartmentId() != null) {
                departmentRepository.findById(signUpRequest.getDepartmentId())
                    .ifPresent(faculty::setDepartment);
            }

            facultyProfileRepository.save(faculty);
        }

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        System.out.println("Login attempt for email: " + loginRequest.getEmail());
        System.out.println("Password provided: " + loginRequest.getPassword());
        
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            System.out.println("User found in DB. Stored Hash: " + user.getPasswordHash());
            
            boolean isMatch = encoder.matches(loginRequest.getPassword(), user.getPasswordHash());
            System.out.println("Password match result: " + isMatch);
            
            if (isMatch) {
                // Log login attempt
                user.setLastLoginAt(LocalDateTime.now());
                userRepository.save(user);

                LoginLog log = LoginLog.builder()
                        .userId(user.getId())
                        .email(user.getEmail())
                        .build();
                loginLogRepository.save(log);

                String role = user.getRole().getRoleName();
                String email = user.getEmail();
                return ResponseEntity.ok("{\"token\": \"dummy-jwt-token\", \"role\": \"" + role + "\", \"email\": \"" + email + "\"}");
            }
        } else {
            System.out.println("User not found for email: " + loginRequest.getEmail());
        }
        return ResponseEntity.status(401).body("Error: Invalid credentials");
    }
}
