package com.university.management.controller;

import com.university.management.entity.User;
import com.university.management.entity.Role;
import com.university.management.repository.UserRepository;
import com.university.management.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable UUID id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(userDetails.getEmail());
            if (userDetails.getRole() != null && userDetails.getRole().getRoleName() != null) {
                Role role = roleRepository.findByRoleName(userDetails.getRole().getRoleName())
                        .orElseThrow(() -> new RuntimeException("Role not found"));
                user.setRole(role);
            }
            if (userDetails.getStatus() != null) {
                user.setStatus(userDetails.getStatus());
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
