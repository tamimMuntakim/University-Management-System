package com.university.management.service;
import com.university.management.entity.Enrollment;
import com.university.management.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EnrollmentService {
    @Autowired
    private EnrollmentRepository repository;

    public List<Enrollment> findAll() { return repository.findAll(); }
    public Optional<Enrollment> findById(UUID id) { return repository.findById(id); }
    public Enrollment save(Enrollment entity) { return repository.save(entity); }
    public void deleteById(UUID id) { repository.deleteById(id); }
}
