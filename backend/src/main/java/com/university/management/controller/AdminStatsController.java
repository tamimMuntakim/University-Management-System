package com.university.management.controller;

import com.university.management.dto.DashboardStatsDTO;
import com.university.management.repository.UserRepository;
import com.university.management.repository.CourseRepository;
import com.university.management.repository.DepartmentRepository;
import com.university.management.repository.FacultyProfileRepository;
import com.university.management.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentRepository;

    @Autowired
    private FacultyProfileRepository facultyRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public ResponseEntity<DashboardStatsDTO> getStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalStudents(studentRepository.count());
        stats.setTotalFaculty(facultyRepository.count());
        stats.setTotalDepartments(departmentRepository.count());
        stats.setTotalCourses(courseRepository.count());
        return ResponseEntity.ok(stats);
    }
}
