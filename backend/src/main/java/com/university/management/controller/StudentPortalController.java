package com.university.management.controller;

import com.university.management.entity.StudentProfile;
import com.university.management.entity.User;
import com.university.management.repository.EnrollmentRepository;
import com.university.management.repository.StudentProfileRepository;
import com.university.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentPortalController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    private String getEmailFromAuth(Authentication auth, String headerEmail) {
        if (auth != null && auth.getName() != null && !auth.getName().equals("anonymousUser")) {
            return auth.getName();
        }
        return headerEmail;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStudentStats(
            Authentication authentication,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail) {
        
        String email = getEmailFromAuth(authentication, headerEmail);
        if (email == null) return ResponseEntity.status(401).body("User not authenticated");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> stats = new HashMap<>();
        
        studentProfileRepository.findByUserEmail(email)
                .ifPresentOrElse(profile -> {
                    stats.put("cgpa", profile.getCgpa() != null ? profile.getCgpa() : 0.0);
                    stats.put("creditsCompleted", profile.getCreditsCompleted() != null ? profile.getCreditsCompleted() : 0);
                    stats.put("status", profile.getStatus());
                    stats.put("regId", profile.getStudentRegId());
                    stats.put("department", profile.getDepartment() != null ? profile.getDepartment().getDepartmentName() : "N/A");
                }, () -> {
                    stats.put("cgpa", 0.0);
                    stats.put("creditsCompleted", 0);
                    stats.put("status", "N/A");
                });

        stats.put("totalEnrollments", enrollmentRepository.countByStudentEmail(email));

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            Authentication authentication,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail) {
        
        String email = getEmailFromAuth(authentication, headerEmail);
        if (email == null) return ResponseEntity.status(401).body("User not authenticated");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudentProfile profile = studentProfileRepository.findByUserEmail(email).orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("email", user.getEmail());
        if (profile != null) {
            response.put("id", profile.getId());
            response.put("studentRegId", profile.getStudentRegId());
            response.put("gender", profile.getGender());
            response.put("enrollmentSemester", profile.getEnrollmentSemester());
            response.put("departmentName", profile.getDepartment() != null ? profile.getDepartment().getDepartmentName() : "N/A");
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @RequestBody Map<String, Object> updates) {
        
        String email = getEmailFromAuth(authentication, headerEmail);
        if (email == null) return ResponseEntity.status(401).body("User not authenticated");

        StudentProfile profile = studentProfileRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Student Profile not found"));

        if (updates.containsKey("gender")) {
            profile.setGender((String) updates.get("gender"));
        }
        
        studentProfileRepository.save(profile);
        return ResponseEntity.ok(profile);
    }
}
