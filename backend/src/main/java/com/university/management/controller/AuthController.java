package com.university.management.controller;

import com.university.management.dto.LoginRequest;
import com.university.management.dto.SignupRequest;
import com.university.management.entity.FacultyProfile;
import com.university.management.entity.Role;
import com.university.management.entity.StudentProfile;
import com.university.management.entity.User;
import com.university.management.repository.FacultyProfileRepository;
import com.university.management.repository.RoleRepository;
import com.university.management.repository.StudentProfileRepository;
import com.university.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
            student.setStudentRegId("S-" + System.currentTimeMillis()); // Temporary ID
            studentProfileRepository.save(student);
        } else if ("ROLE_FACULTY".equals(requestedRole)) {
            FacultyProfile faculty = new FacultyProfile();
            faculty.setUser(savedUser);
            faculty.setFacultyStaffId("F-" + System.currentTimeMillis()); // Temporary ID
            faculty.setJoiningDate(LocalDate.now());
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
                String role = user.getRole().getRoleName();
                return ResponseEntity.ok("{\"token\": \"dummy-jwt-token\", \"role\": \"" + role + "\"}");
            }
        } else {
            System.out.println("User not found for email: " + loginRequest.getEmail());
        }
        return ResponseEntity.status(401).body("Error: Invalid credentials");
    }
}
