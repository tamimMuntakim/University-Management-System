package com.university.management.controller;

import com.university.management.entity.User;
import com.university.management.entity.Role;
import com.university.management.repository.UserRepository;
import com.university.management.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private com.university.management.repository.StudentProfileRepository studentProfileRepository;

    @Autowired
    private com.university.management.repository.FacultyProfileRepository facultyProfileRepository;

    @Autowired
    private com.university.management.repository.DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable UUID id, @RequestBody Map<String, Object> updates) {
        return userRepository.findById(id).map(user -> {
            if (updates.containsKey("email")) user.setEmail((String) updates.get("email"));
            
            if (updates.containsKey("role") && updates.get("role") != null) {
                @SuppressWarnings("unchecked")
                Map<String, String> roleMap = (Map<String, String>) updates.get("role");
                Role role = roleRepository.findByRoleName(roleMap.get("roleName"))
                        .orElseThrow(() -> new RuntimeException("Role not found"));
                user.setRole(role);
            }
            
            if (updates.containsKey("status")) {
                user.setStatus(com.university.management.entity.enums.UserStatus.valueOf((String) updates.get("status")));
            }

            // Update Department for Student/Faculty
            if (updates.containsKey("departmentId")) {
                UUID deptId = updates.get("departmentId") != null ? UUID.fromString((String) updates.get("departmentId")) : null;
                var department = deptId != null ? departmentRepository.findById(deptId).orElse(null) : null;

                if ("ROLE_STUDENT".equals(user.getRole().getRoleName())) {
                    studentProfileRepository.findAll().stream()
                        .filter(p -> p.getUser().getId().equals(user.getId()))
                        .findFirst()
                        .ifPresent(p -> {
                            p.setDepartment(department);
                            studentProfileRepository.save(p);
                        });
                } else if ("ROLE_FACULTY".equals(user.getRole().getRoleName())) {
                    facultyProfileRepository.findAll().stream()
                        .filter(p -> p.getUser().getId().equals(user.getId()))
                        .findFirst()
                        .ifPresent(p -> {
                            p.setDepartment(department);
                            facultyProfileRepository.save(p);
                        });
                }
            }

            userRepository.save(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
