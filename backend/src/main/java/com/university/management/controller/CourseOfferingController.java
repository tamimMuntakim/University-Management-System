package com.university.management.controller;
import com.university.management.entity.CourseOffering;
import com.university.management.entity.FacultyProfile;
import com.university.management.service.CourseOfferingService;
import com.university.management.repository.FacultyProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/courseofferings")
@CrossOrigin(origins = "*")
public class CourseOfferingController {
    
    @Autowired
    private CourseOfferingService service;

    @Autowired
    private FacultyProfileRepository facultyProfileRepository;

    @GetMapping
    public List<CourseOffering> getAll() { 
        return service.findAll(); 
    }

    @GetMapping("/faculty-list")
    public ResponseEntity<List<Map<String, Object>>> getFacultyList() {
        try {
            List<FacultyProfile> profiles = facultyProfileRepository.findAll();
            List<Map<String, Object>> result = new ArrayList<>();
            for (FacultyProfile f : profiles) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", f.getUser().getId());
                map.put("email", f.getUser().getEmail());
                result.add(map);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseOffering> getById(@PathVariable UUID id) {
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CourseOffering> create(@RequestBody CourseOffering entity) { 
        return ResponseEntity.ok(service.save(entity)); 
    }

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
