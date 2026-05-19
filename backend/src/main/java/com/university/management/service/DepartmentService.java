package com.university.management.service;
import com.university.management.entity.Department;
import com.university.management.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DepartmentService {
    @Autowired
    private DepartmentRepository repository;

    public List<Department> findAll() { return repository.findAll(); }
    public Optional<Department> findById(UUID id) { return repository.findById(id); }
    public Department save(Department entity) { return repository.save(entity); }
    public void deleteById(UUID id) { repository.deleteById(id); }
}
