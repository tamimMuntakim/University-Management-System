package com.university.management.controller;
import com.university.management.entity.Enrollment;
import com.university.management.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    @Autowired
    private EnrollmentService service;

    @GetMapping
    public List<Enrollment> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Enrollment> getById(@PathVariable UUID id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Enrollment create(@RequestBody Enrollment entity) { return service.save(entity); }

    @PutMapping("/{id}")
    public ResponseEntity<Enrollment> update(@PathVariable UUID id, @RequestBody Enrollment entity) {
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
