package com.university.management.service;
import com.university.management.entity.Course;
import com.university.management.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CourseService {
    @Autowired
    private CourseRepository repository;

    public List<Course> findAll() { return repository.findAll(); }
    public Optional<Course> findById(UUID id) { return repository.findById(id); }
    public Course save(Course entity) { return repository.save(entity); }
    public void deleteById(UUID id) { repository.deleteById(id); }
}
