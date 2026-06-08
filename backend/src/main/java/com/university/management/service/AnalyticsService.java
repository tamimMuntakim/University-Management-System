package com.university.management.service;

import com.university.management.dto.AnalyticsDTO;
import com.university.management.entity.Department;
import com.university.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AnalyticsService {

    private final StudentProfileRepository studentRepository;
    private final FacultyProfileRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final CourseOfferingRepository courseOfferingRepository;
    private final UserRepository userRepository;
    private final LoginLogRepository loginLogRepository;

    public AnalyticsDTO getAdminAnalytics() {
        try {
            AnalyticsDTO dto = new AnalyticsDTO();
            
            dto.setTotalStudents(studentRepository.count());
            dto.setTotalFaculties(facultyRepository.count());
            dto.setTotalDepartments(departmentRepository.count());
            dto.setTotalCourses(courseRepository.count());

            List<com.university.management.entity.CourseOffering> allOfferings = courseOfferingRepository.findAll();

            // Login Analysis
            Map<String, Long> loginsByHour = new HashMap<>();
            try {
                loginLogRepository.getLoginCountByHour().forEach(row -> {
                    Number hourNum = (Number) row.get("hour");
                    Number countNum = (Number) row.get("count");
                    if (hourNum != null && countNum != null) {
                        loginsByHour.put(String.format("%02d:00", hourNum.intValue()), countNum.longValue());
                    }
                });
            } catch (Exception e) {
                log.error("Error fetching login analysis: {}", e.getMessage());
            }
            dto.setLoginsByHour(loginsByHour);

            // Registration Analysis (Trend)
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            try {
                Map<String, Long> registrationsByDate = userRepository.findAll().stream()
                        .filter(u -> u.getCreatedAt() != null)
                        .collect(Collectors.groupingBy(
                                u -> u.getCreatedAt().format(formatter),
                                Collectors.counting()
                        ));
                dto.setRegistrationsByDate(registrationsByDate);
            } catch (Exception e) {
                log.error("Error fetching registration analysis: {}", e.getMessage());
            }

            // Gender Distribution
            try {
                dto.setStudentsByGender(groupBy(studentRepository.findAll().stream()
                        .map(s -> s.getGender() != null ? s.getGender() : "Unknown")
                        .collect(Collectors.toList())));
                
                dto.setFacultiesByGender(groupBy(facultyRepository.findAll().stream()
                        .map(f -> f.getGender() != null ? f.getGender() : "Unknown")
                        .collect(Collectors.toList())));
            } catch (Exception e) {
                log.error("Error fetching gender distribution: {}", e.getMessage());
            }

            // Department Distribution
            try {
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
            } catch (Exception e) {
                log.error("Error fetching department distribution: {}", e.getMessage());
            }

            // Course Offerings by Department
            try {
                Map<String, Long> offeringsByDept = new HashMap<>();
                allOfferings.forEach(o -> {
                    String deptLabel = (o.getCourse() != null && o.getCourse().getDepartment() != null) 
                        ? o.getCourse().getDepartment().getDeptCode() : "N/A";
                    offeringsByDept.put(deptLabel, offeringsByDept.getOrDefault(deptLabel, 0L) + 1);
                });
                dto.setOfferingsByDepartment(offeringsByDept);
            } catch (Exception e) {
                log.error("Error fetching offerings distribution: {}", e.getMessage());
            }

            // Most Popular Courses (by enrollment)
            try {
                Map<String, Long> courseEnrollments = new HashMap<>();
                allOfferings.forEach(o -> {
                    if (o.getCourse() != null) {
                        String courseName = o.getCourse().getCourseName();
                        courseEnrollments.put(courseName, courseEnrollments.getOrDefault(courseName, 0L) + o.getEnrolledCount());
                    }
                });
                dto.setEnrollmentByCourse(courseEnrollments.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(5)
                    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)));
            } catch (Exception e) {
                log.error("Error fetching popular courses: {}", e.getMessage());
            }

            // Top Rated Faculty
            try {
                Map<String, Double> facRatings = facultyRepository.findAll().stream()
                    .filter(f -> f.getRating() != null && f.getUser() != null)
                    .sorted((f1, f2) -> f2.getRating().compareTo(f1.getRating()))
                    .limit(5)
                    .collect(Collectors.toMap(
                        f -> f.getUser().getEmail().split("@")[0], // Use email prefix as name for chart
                        f -> f.getRating().doubleValue(),
                        (v1, v2) -> v1 
                    ));
                dto.setFacultyRatings(facRatings);
            } catch (Exception e) {
                log.error("Error fetching faculty ratings: {}", e.getMessage());
            }

            // Avg CGPA by Dept
            try {
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
            } catch (Exception e) {
                log.error("Error fetching avg CGPA: {}", e.getMessage());
            }

            return dto;
        } catch (Exception e) {
            log.error("Critical error in analytics service: ", e);
            throw e;
        }
    }

    private Map<String, Long> groupBy(List<String> items) {
        return items.stream().collect(Collectors.groupingBy(s -> s, Collectors.counting()));
    }
}
