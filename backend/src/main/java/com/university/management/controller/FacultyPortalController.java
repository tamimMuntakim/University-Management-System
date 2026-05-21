package com.university.management.controller;

import com.university.management.entity.CourseOffering;
import com.university.management.entity.FacultyProfile;
import com.university.management.entity.User;
import com.university.management.repository.CourseOfferingRepository;
import com.university.management.repository.FacultyProfileRepository;
import com.university.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty")
public class FacultyPortalController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FacultyProfileRepository facultyProfileRepository;

    @Autowired
    private CourseOfferingRepository courseOfferingRepository;

    private String getEmailFromAuth(Authentication auth, String headerEmail) {
        if (auth != null && auth.getName() != null && !auth.getName().equals("anonymousUser")) {
            return auth.getName();
        }
        return headerEmail;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getFacultyStats(
            Authentication authentication,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail) {
        
        String email = getEmailFromAuth(authentication, headerEmail);
        if (email == null) return ResponseEntity.status(401).body("User not authenticated");

        List<CourseOffering> myOfferings = courseOfferingRepository.findByTeacherEmail(email);
        
        long totalStudents = myOfferings.stream()
                .flatMap(offering -> offering.getEnrollments().stream())
                .filter(e -> e.getStatus() != com.university.management.entity.enums.EnrollmentStatus.DROPPED)
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCourses", myOfferings.size());
        stats.put("totalStudents", totalStudents);
        
        facultyProfileRepository.findByUserEmail(email).ifPresent(profile -> {
            stats.put("designation", profile.getDesignation());
            stats.put("department", profile.getDepartment() != null ? profile.getDepartment().getDepartmentName() : "N/A");
        });

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getMyCourses(
            Authentication authentication,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail) {
        String email = getEmailFromAuth(authentication, headerEmail);
        if (email == null) return ResponseEntity.status(401).body("User not authenticated");
        return ResponseEntity.ok(courseOfferingRepository.findByTeacherEmail(email));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            Authentication authentication,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail) {
        
        String email = getEmailFromAuth(authentication, headerEmail);
        if (email == null) return ResponseEntity.status(401).body("User not authenticated");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FacultyProfile profile = facultyProfileRepository.findByUserEmail(email).orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("email", user.getEmail());
        response.put("userId", user.getId());
        if (profile != null) {
            response.put("id", profile.getId());
            response.put("facultyStaffId", profile.getFacultyStaffId());
            response.put("designation", profile.getDesignation());
            response.put("gender", profile.getGender());
            response.put("departmentName", profile.getDepartment() != null ? profile.getDepartment().getDepartmentName() : "N/A");
            response.put("status", profile.getStatus());
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

        FacultyProfile profile = facultyProfileRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Faculty Profile not found"));

        if (updates.containsKey("gender")) {
            profile.setGender((String) updates.get("gender"));
        }
        if (updates.containsKey("designation")) {
            profile.setDesignation((String) updates.get("designation"));
        }
        
        facultyProfileRepository.save(profile);
        return ResponseEntity.ok(profile);
    }
}
