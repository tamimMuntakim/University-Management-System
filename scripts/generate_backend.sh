#!/bin/bash
BASE_DIR="backend/src/main/java/com/university/management"

# pom.xml jjwt
sed -i '/<\/dependencies>/i \
\t\t<dependency>\n\t\t\t<groupId>io.jsonwebtoken</groupId>\n\t\t\t<artifactId>jjwt-api</artifactId>\n\t\t\t<version>0.11.5</version>\n\t\t</dependency>\n\t\t<dependency>\n\t\t\t<groupId>io.jsonwebtoken</groupId>\n\t\t\t<artifactId>jjwt-impl</artifactId>\n\t\t\t<version>0.11.5</version>\n\t\t\t<scope>runtime</scope>\n\t\t</dependency>\n\t\t<dependency>\n\t\t\t<groupId>io.jsonwebtoken</groupId>\n\t\t\t<artifactId>jjwt-jackson</artifactId>\n\t\t\t<version>0.11.5</version>\n\t\t\t<scope>runtime</scope>\n\t\t</dependency>' backend/pom.xml

# Repositories
mkdir -p $BASE_DIR/repository
for ENTITY in User Role Department FacultyProfile StudentProfile Course CourseOffering Enrollment; do
cat << INNER_EOF > $BASE_DIR/repository/${ENTITY}Repository.java
package com.university.management.repository;
import com.university.management.entity.$ENTITY;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
@Repository
public interface ${ENTITY}Repository extends JpaRepository<$ENTITY, UUID> {
}
INNER_EOF
done

# Additional mapping for User and Role
cat << EOF2 > $BASE_DIR/repository/UserRepository.java
package com.university.management.repository;
import com.university.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
}
EOF2

cat << EOF3 > $BASE_DIR/repository/RoleRepository.java
package com.university.management.repository;
import com.university.management.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByRoleName(String roleName);
}
EOF3

# Security
mkdir -p $BASE_DIR/security

cat << 'SECEOF' > $BASE_DIR/security/WebSecurityConfig.java
package com.university.management.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().permitAll() // Allow all temporarily for CRUD testing
            );
        return http.build();
    }
}
SECEOF

# Services
mkdir -p $BASE_DIR/service

for ENTITY in Department Course CourseOffering Enrollment; do
cat << SRV_EOF > $BASE_DIR/service/${ENTITY}Service.java
package com.university.management.service;
import com.university.management.entity.$ENTITY;
import com.university.management.repository.${ENTITY}Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ${ENTITY}Service {
    @Autowired
    private ${ENTITY}Repository repository;

    public List<$ENTITY> findAll() { return repository.findAll(); }
    public Optional<$ENTITY> findById(UUID id) { return repository.findById(id); }
    public $ENTITY save($ENTITY entity) { return repository.save(entity); }
    public void deleteById(UUID id) { repository.deleteById(id); }
}
SRV_EOF
done

# Controllers
mkdir -p $BASE_DIR/controller

for ENTITY in Department Course CourseOffering Enrollment; do
cat << CTRL_EOF > $BASE_DIR/controller/${ENTITY}Controller.java
package com.university.management.controller;
import com.university.management.entity.$ENTITY;
import com.university.management.service.${ENTITY}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/${ENTITY,,}s")
public class ${ENTITY}Controller {
    @Autowired
    private ${ENTITY}Service service;

    @GetMapping
    public List<$ENTITY> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<$ENTITY> getById(@PathVariable UUID id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public $ENTITY create(@RequestBody $ENTITY entity) { return service.save(entity); }

    @PutMapping("/{id}")
    public ResponseEntity<$ENTITY> update(@PathVariable UUID id, @RequestBody $ENTITY entity) {
        return service.findById(id).map(existing -> {
            entity.setId(id);
            return ResponseEntity.ok(service.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
CTRL_EOF
done

# DTOs & Auth Controller
mkdir -p $BASE_DIR/dto

cat << DTO_EOF > $BASE_DIR/dto/LoginRequest.java
package com.university.management.dto;
import lombok.Data;
@Data
public class LoginRequest {
    private String email;
    private String password;
}
DTO_EOF

cat << DTO_EOF > $BASE_DIR/dto/SignupRequest.java
package com.university.management.dto;
import lombok.Data;
@Data
public class SignupRequest {
    private String email;
    private String password;
    private String role;
}
DTO_EOF

cat << AUTH_EOF > $BASE_DIR/controller/AuthController.java
package com.university.management.controller;

import com.university.management.dto.LoginRequest;
import com.university.management.dto.SignupRequest;
import com.university.management.entity.Role;
import com.university.management.entity.User;
import com.university.management.repository.RoleRepository;
import com.university.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
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
        
        // Find existing role or create it
        Optional<Role> roleOpt = roleRepository.findByRoleName(requestedRole);
        Role role = roleOpt.orElseGet(() -> {
            Role newRole = new Role();
            newRole.setRoleName(requestedRole);
            return roleRepository.save(newRole);
        });
        
        user.setRole(role);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (encoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
                String role = user.getRole().getRoleName();
                // Return simple object (You can integrate full JWT here)
                return ResponseEntity.ok("{\"token\": \"dummy-jwt-token\", \"role\": \"" + role + "\"}");
            }
        }
        return ResponseEntity.status(401).body("Error: Invalid credentials");
    }
}
AUTH_EOF

