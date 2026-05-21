package com.university.management.service;

import com.university.management.dto.AnalyticsDTO;
import com.university.management.entity.Department;
import com.university.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final StudentProfileRepository studentRepository;
    private final FacultyProfileRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;

    public AnalyticsDTO getAdminAnalytics() {
        AnalyticsDTO dto = new AnalyticsDTO();
        
        dto.setTotalStudents(studentRepository.count());
        dto.setTotalFaculties(facultyRepository.count());
        dto.setTotalDepartments(departmentRepository.count());
        dto.setTotalCourses(courseRepository.count());

        // Gender Distribution
        dto.setStudentsByGender(groupBy(studentRepository.findAll().stream()
                .map(s -> s.getGender() != null ? s.getGender() : "Unknown")
                .collect(Collectors.toList())));
        
        dto.setFacultiesByGender(groupBy(facultyRepository.findAll().stream()
                .map(f -> f.getGender() != null ? f.getGender() : "Unknown")
                .collect(Collectors.toList())));

        // Department Distribution
        Map<String, Long> stuByDept = new HashMap<>();
        studentRepository.findAll().forEach(s -> {
            String deptLabel = s.getDepartment() != null ? s.getDepartment().getDeptCode() : "N/A";
            stuByDept.put(deptLabel, stuByDept.getOrDefault(deptLabel, 0L) + 1);
        });
        dto.setStudentsByDepartment(stuByDept);

        Map<String, Long> facByDept = new HashMap<>();
        facultyRepository.findAll().forEach(f -> {
            String deptLabel = f.getDepartment() != null ? f.getDepartment().getDeptCode() : "N/A";
            facByDept.put(deptLabel, facByDept.getOrDefault(deptLabel, 0L) + 1);
        });
        dto.setFacultiesByDepartment(facByDept);

        Map<String, Long> coursesByDept = new HashMap<>();
        courseRepository.findAll().forEach(c -> {
            String deptLabel = c.getDepartment() != null ? c.getDepartment().getDeptCode() : "N/A";
            coursesByDept.put(deptLabel, coursesByDept.getOrDefault(deptLabel, 0L) + 1);
        });
        dto.setCoursesByDepartment(coursesByDept);

        // Avg CGPA by Dept
        Map<String, Double> avgCgpaByDept = new HashMap<>();
        departmentRepository.findAll().forEach(dept -> {
            double avg = studentRepository.findAll().stream()
                    .filter(s -> s.getDepartment() != null && s.getDepartment().getId().equals(dept.getId()))
                    .filter(s -> s.getCgpa() != null)
                    .mapToDouble(s -> s.getCgpa().doubleValue())
                    .average()
                    .orElse(0.0);
            avgCgpaByDept.put(dept.getDeptCode(), Math.round(avg * 100.0) / 100.0);
        });
        dto.setAverageCgpaByDepartment(avgCgpaByDept);

        return dto;
    }

    private Map<String, Long> groupBy(List<String> items) {
        return items.stream().collect(Collectors.groupingBy(s -> s, Collectors.counting()));
    }
}
