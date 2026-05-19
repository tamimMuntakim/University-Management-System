package com.university.management.controller;
import com.university.management.entity.CourseOffering;
import com.university.management.service.CourseOfferingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courseofferings")
public class CourseOfferingController {
    @Autowired
    private CourseOfferingService service;

    @GetMapping
    public List<CourseOffering> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<CourseOffering> getById(@PathVariable UUID id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public CourseOffering create(@RequestBody CourseOffering entity) { return service.save(entity); }

    @PutMapping("/{id}")
    public ResponseEntity<CourseOffering> update(@PathVariable UUID id, @RequestBody CourseOffering entity) {
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
