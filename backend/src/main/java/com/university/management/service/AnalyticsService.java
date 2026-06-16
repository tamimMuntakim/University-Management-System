// package com.university.management.service;

// import com.university.management.dto.AnalyticsDTO;
// import com.university.management.entity.Department;
// import com.university.management.repository.*;
// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;

// import java.time.format.DateTimeFormatter;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;

// @Service
// @RequiredArgsConstructor
// @lombok.extern.slf4j.Slf4j
// public class AnalyticsService {

//     private final StudentProfileRepository studentRepository;
//     private final FacultyProfileRepository facultyRepository;
//     private final DepartmentRepository departmentRepository;
//     private final CourseRepository courseRepository;
//     private final CourseOfferingRepository courseOfferingRepository;
//     private final UserRepository userRepository;
//     private final LoginLogRepository loginLogRepository;

//     public AnalyticsDTO getAdminAnalytics() {
//         try {
//             AnalyticsDTO dto = new AnalyticsDTO();

//             dto.setTotalStudents(studentRepository.count());
//             dto.setTotalFaculties(facultyRepository.count());
//             dto.setTotalDepartments(departmentRepository.count());
//             dto.setTotalCourses(courseRepository.count());

//             List<com.university.management.entity.CourseOffering> allOfferings = courseOfferingRepository.findAll();

//             // Login Analysis
//             Map<String, Long> loginsByHour = new HashMap<>();
//             try {
//                 loginLogRepository.getLoginCountByHour().forEach(row -> {
//                     Number hourNum = (Number) row.get("hour");
//                     Number countNum = (Number) row.get("count");
//                     if (hourNum != null && countNum != null) {
//                         loginsByHour.put(String.format("%02d:00", hourNum.intValue()), countNum.longValue());
//                     }
//                 });
//             } catch (Exception e) {
//                 log.error("Error fetching login analysis: {}", e.getMessage());
//             }
//             dto.setLoginsByHour(loginsByHour);

//             // Registration Analysis (Trend)
//             DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//             try {
//                 Map<String, Long> registrationsByDate = userRepository.findAll().stream()
//                         .filter(u -> u.getCreatedAt() != null)
//                         .collect(Collectors.groupingBy(
//                                 u -> u.getCreatedAt().format(formatter),
//                                 Collectors.counting()
//                         ));
//                 dto.setRegistrationsByDate(registrationsByDate);
//             } catch (Exception e) {
//                 log.error("Error fetching registration analysis: {}", e.getMessage());
//             }

//             // Gender Distribution
//             try {
//                 dto.setStudentsByGender(groupBy(studentRepository.findAll().stream()
//                         .map(s -> s.getGender() != null ? s.getGender() : "Unknown")
//                         .collect(Collectors.toList())));

//                 dto.setFacultiesByGender(groupBy(facultyRepository.findAll().stream()
//                         .map(f -> f.getGender() != null ? f.getGender() : "Unknown")
//                         .collect(Collectors.toList())));
//             } catch (Exception e) {
//                 log.error("Error fetching gender distribution: {}", e.getMessage());
//             }

//             // Department Distribution
//             try {
//                 Map<String, Long> stuByDept = new HashMap<>();
//                 studentRepository.findAll().forEach(s -> {
//                     String deptLabel = s.getDepartment() != null ? s.getDepartment().getDeptCode() : "N/A";
//                     stuByDept.put(deptLabel, stuByDept.getOrDefault(deptLabel, 0L) + 1);
//                 });
//                 dto.setStudentsByDepartment(stuByDept);

//                 Map<String, Long> facByDept = new HashMap<>();
//                 facultyRepository.findAll().forEach(f -> {
//                     String deptLabel = f.getDepartment() != null ? f.getDepartment().getDeptCode() : "N/A";
//                     facByDept.put(deptLabel, facByDept.getOrDefault(deptLabel, 0L) + 1);
//                 });
//                 dto.setFacultiesByDepartment(facByDept);

//                 Map<String, Long> coursesByDept = new HashMap<>();
//                 courseRepository.findAll().forEach(c -> {
//                     String deptLabel = c.getDepartment() != null ? c.getDepartment().getDeptCode() : "N/A";
//                     coursesByDept.put(deptLabel, coursesByDept.getOrDefault(deptLabel, 0L) + 1);
//                 });
//                 dto.setCoursesByDepartment(coursesByDept);
//             } catch (Exception e) {
//                 log.error("Error fetching department distribution: {}", e.getMessage());
//             }

//             // Course Offerings by Department
//             try {
//                 Map<String, Long> offeringsByDept = new HashMap<>();
//                 allOfferings.forEach(o -> {
//                     String deptLabel = (o.getCourse() != null && o.getCourse().getDepartment() != null) 
//                         ? o.getCourse().getDepartment().getDeptCode() : "N/A";
//                     offeringsByDept.put(deptLabel, offeringsByDept.getOrDefault(deptLabel, 0L) + 1);
//                 });
//                 dto.setOfferingsByDepartment(offeringsByDept);
//             } catch (Exception e) {
//                 log.error("Error fetching offerings distribution: {}", e.getMessage());
//             }

//             // Most Popular Courses (by enrollment)
//             try {
//                 Map<String, Long> courseEnrollments = new HashMap<>();
//                 allOfferings.forEach(o -> {
//                     if (o.getCourse() != null) {
//                         String courseName = o.getCourse().getCourseName();
//                         courseEnrollments.put(courseName, courseEnrollments.getOrDefault(courseName, 0L) + o.getEnrolledCount());
//                     }
//                 });
//                 dto.setEnrollmentByCourse(courseEnrollments.entrySet().stream()
//                     .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
//                     .limit(5)
//                     .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)));
//             } catch (Exception e) {
//                 log.error("Error fetching popular courses: {}", e.getMessage());
//             }

//             // Top Rated Faculty
//             try {
//                 Map<String, Double> facRatings = facultyRepository.findAll().stream()
//                     .filter(f -> f.getRating() != null && f.getUser() != null)
//                     .sorted((f1, f2) -> f2.getRating().compareTo(f1.getRating()))
//                     .limit(5)
//                     .collect(Collectors.toMap(
//                         f -> f.getUser().getEmail().split("@")[0], // Use email prefix as name for chart
//                         f -> f.getRating().doubleValue(),
//                         (v1, v2) -> v1 
//                     ));
//                 dto.setFacultyRatings(facRatings);
//             } catch (Exception e) {
//                 log.error("Error fetching faculty ratings: {}", e.getMessage());
//             }

//             // Avg CGPA by Dept
//             try {
//                 Map<String, Double> avgCgpaByDept = new HashMap<>();
//                 departmentRepository.findAll().forEach(dept -> {
//                     double avg = studentRepository.findAll().stream()
//                             .filter(s -> s.getDepartment() != null && s.getDepartment().getId().equals(dept.getId()))
//                             .filter(s -> s.getCgpa() != null)
//                             .mapToDouble(s -> s.getCgpa().doubleValue())
//                             .average()
//                             .orElse(0.0);
//                     avgCgpaByDept.put(dept.getDeptCode(), Math.round(avg * 100.0) / 100.0);
//                 });
//                 dto.setAverageCgpaByDepartment(avgCgpaByDept);
//             } catch (Exception e) {
//                 log.error("Error fetching avg CGPA: {}", e.getMessage());
//             }

//             return dto;
//         } catch (Exception e) {
//             log.error("Critical error in analytics service: ", e);
//             throw e;
//         }
//     }

//     private Map<String, Long> groupBy(List<String> items) {
//         return items.stream().collect(Collectors.groupingBy(s -> s, Collectors.counting()));
//     }
// }
package com.university.management.service;

import com.university.management.dto.AnalyticsDTO;
import com.university.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
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
    private final EnrollmentRepository enrollmentRepository; // NEW
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

            // ── Login Analysis ───────────────────────────────────────────────
            Map<String, Long> loginsByHour = new HashMap<>();
            try {
                loginLogRepository.getLoginCountByHour().forEach(row -> {
                    Number hourNum = (Number) row.get("hour");
                    Number countNum = (Number) row.get("count");
                    if (hourNum != null && countNum != null) {
                        loginsByHour.put(
                                String.format("%02d:00", hourNum.intValue()),
                                countNum.longValue());
                    }
                });
            } catch (Exception e) {
                log.error("Error fetching login analysis: {}", e.getMessage());
            }
            dto.setLoginsByHour(loginsByHour);

            // ── Login Activity by Weekday × Hour (punchcard) ─────────────────
            Map<String, Long> loginsByWeekdayHour = new HashMap<>();
            try {
                loginLogRepository.getLoginCountByWeekdayHour().forEach(row -> {
                    Number dow   = (Number) row.get("dow");
                    Number hour  = (Number) row.get("hour");
                    Number count = (Number) row.get("count");
                    if (dow != null && hour != null && count != null) {
                        loginsByWeekdayHour.put(
                                dow.intValue() + "-" + hour.intValue(),
                                count.longValue());
                    }
                });
            } catch (Exception e) {
                log.error("Error fetching login weekday-hour analysis: {}", e.getMessage());
            }
            dto.setLoginsByWeekdayHour(loginsByWeekdayHour);

            // ── Registration Trend ───────────────────────────────────────────
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            try {
                Map<String, Long> registrationsByDate = userRepository.findAll().stream()
                        .filter(u -> u.getCreatedAt() != null)
                        .collect(Collectors.groupingBy(
                                u -> u.getCreatedAt().format(formatter),
                                Collectors.counting()));
                dto.setRegistrationsByDate(registrationsByDate);
            } catch (Exception e) {
                log.error("Error fetching registration analysis: {}", e.getMessage());
            }

            // ── Gender Distribution ──────────────────────────────────────────
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

            // ── Department Distribution ──────────────────────────────────────
            try {
                Map<String, Long> stuByDept = new HashMap<>();
                studentRepository.findAll().forEach(s -> {
                    String dept = s.getDepartment() != null ? s.getDepartment().getDeptCode() : "N/A";
                    stuByDept.merge(dept, 1L, Long::sum);
                });
                dto.setStudentsByDepartment(stuByDept);

                Map<String, Long> facByDept = new HashMap<>();
                facultyRepository.findAll().forEach(f -> {
                    String dept = f.getDepartment() != null ? f.getDepartment().getDeptCode() : "N/A";
                    facByDept.merge(dept, 1L, Long::sum);
                });
                dto.setFacultiesByDepartment(facByDept);

                Map<String, Long> coursesByDept = new HashMap<>();
                courseRepository.findAll().forEach(c -> {
                    String dept = c.getDepartment() != null ? c.getDepartment().getDeptCode() : "N/A";
                    coursesByDept.merge(dept, 1L, Long::sum);
                });
                dto.setCoursesByDepartment(coursesByDept);
            } catch (Exception e) {
                log.error("Error fetching department distribution: {}", e.getMessage());
            }

            // ── Offerings by Department ──────────────────────────────────────
            try {
                Map<String, Long> offeringsByDept = new HashMap<>();
                allOfferings.forEach(o -> {
                    String dept = (o.getCourse() != null && o.getCourse().getDepartment() != null)
                            ? o.getCourse().getDepartment().getDeptCode()
                            : "N/A";
                    offeringsByDept.merge(dept, 1L, Long::sum);
                });
                dto.setOfferingsByDepartment(offeringsByDept);
            } catch (Exception e) {
                log.error("Error fetching offerings distribution: {}", e.getMessage());
            }

            // ── Popular Courses ──────────────────────────────────────────────
            try {
                Map<String, Long> courseEnrollments = new HashMap<>();
                allOfferings.forEach(o -> {
                    if (o.getCourse() != null) {
                        courseEnrollments.merge(
                                o.getCourse().getCourseName(),
                                (long) o.getEnrolledCount(),
                                Long::sum);
                    }
                });
                dto.setEnrollmentByCourse(courseEnrollments.entrySet().stream()
                        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                        .limit(5)
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                                (v1, v2) -> v1, LinkedHashMap::new)));
            } catch (Exception e) {
                log.error("Error fetching popular courses: {}", e.getMessage());
            }

            // ── Top Rated Faculty ────────────────────────────────────────────
            try {
                Map<String, Double> facRatings = facultyRepository.findAll().stream()
                        .filter(f -> f.getRating() != null && f.getUser() != null)
                        .sorted((a, b) -> b.getRating().compareTo(a.getRating()))
                        .limit(5)
                        .collect(Collectors.toMap(
                                f -> f.getUser().getEmail().split("@")[0],
                                f -> f.getRating().doubleValue(),
                                (v1, v2) -> v1,
                                LinkedHashMap::new));
                dto.setFacultyRatings(facRatings);
            } catch (Exception e) {
                log.error("Error fetching faculty ratings: {}", e.getMessage());
            }

            // ── Avg CGPA by Department ───────────────────────────────────────
            try {
                Map<String, Double> avgCgpaByDept = new HashMap<>();
                departmentRepository.findAll().forEach(dept -> {
                    double avg = studentRepository.findAll().stream()
                            .filter(s -> s.getDepartment() != null
                                    && s.getDepartment().getId().equals(dept.getId())
                                    && s.getCgpa() != null)
                            .mapToDouble(s -> s.getCgpa().doubleValue())
                            .average()
                            .orElse(0.0);
                    avgCgpaByDept.put(dept.getDeptCode(), Math.round(avg * 100.0) / 100.0);
                });
                dto.setAverageCgpaByDepartment(avgCgpaByDept);
            } catch (Exception e) {
                log.error("Error fetching avg CGPA: {}", e.getMessage());
            }

            // ════════════════════════════════════════════════════════════════
            // NEW ANALYTICS BELOW
            // ════════════════════════════════════════════════════════════════

            // ── NEW 1: Enrollment Status Distribution ────────────────────────
            try {
                Map<String, Long> enrollmentStatus = enrollmentRepository.findAll().stream()
                        .collect(Collectors.groupingBy(
                                e -> e.getStatus() != null ? e.getStatus().name() : "UNKNOWN",
                                Collectors.counting()));
                dto.setEnrollmentStatusDistribution(enrollmentStatus);
            } catch (Exception e) {
                log.error("Error fetching enrollment status distribution: {}", e.getMessage());
            }

            // ── NEW 2: Student CGPA Range Buckets ───────────────────────────
            try {
                Map<String, Long> cgpaRanges = new LinkedHashMap<>();
                cgpaRanges.put("0.0–1.0", 0L);
                cgpaRanges.put("1.0–2.0", 0L);
                cgpaRanges.put("2.0–3.0", 0L);
                cgpaRanges.put("3.0–3.5", 0L);
                cgpaRanges.put("3.5–4.0", 0L);
                studentRepository.findAll().stream()
                        .filter(s -> s.getCgpa() != null)
                        .forEach(s -> {
                            double cgpa = s.getCgpa().doubleValue();
                            if (cgpa < 1.0)
                                cgpaRanges.merge("0.0–1.0", 1L, Long::sum);
                            else if (cgpa < 2.0)
                                cgpaRanges.merge("1.0–2.0", 1L, Long::sum);
                            else if (cgpa < 3.0)
                                cgpaRanges.merge("2.0–3.0", 1L, Long::sum);
                            else if (cgpa < 3.5)
                                cgpaRanges.merge("3.0–3.5", 1L, Long::sum);
                            else
                                cgpaRanges.merge("3.5–4.0", 1L, Long::sum);
                        });
                dto.setCgpaRangeDistribution(cgpaRanges);
            } catch (Exception e) {
                log.error("Error fetching CGPA range distribution: {}", e.getMessage());
            }

            // ── NEW 3: Offering Status Breakdown ────────────────────────────
            try {
                Map<String, Long> offeringStatus = allOfferings.stream()
                        .collect(Collectors.groupingBy(
                                o -> o.getStatus() != null ? o.getStatus().name() : "UNKNOWN",
                                Collectors.counting()));
                dto.setOfferingStatusDistribution(offeringStatus);
            } catch (Exception e) {
                log.error("Error fetching offering status distribution: {}", e.getMessage());
            }

            // ── NEW 4: Faculty Joining Year Trend ───────────────────────────
            try {
                Map<String, Long> facultyByYear = facultyRepository.findAll().stream()
                        .filter(f -> f.getJoiningDate() != null)
                        .collect(Collectors.groupingBy(
                                f -> String.valueOf(f.getJoiningDate().getYear()),
                                Collectors.counting()))
                        .entrySet().stream()
                        .sorted(Map.Entry.comparingByKey())
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                Map.Entry::getValue,
                                (v1, v2) -> v1,
                                LinkedHashMap::new));
                dto.setFacultyByJoiningYear(facultyByYear);
            } catch (Exception e) {
                log.error("Error fetching faculty joining year trend: {}", e.getMessage());
            }

            // ── NEW 5: Course Capacity Utilization % ────────────────────────
            try {
                Map<String, Double> capacityUtil = new LinkedHashMap<>();
                allOfferings.stream()
                        .filter(o -> o.getCourse() != null
                                && o.getMaxCapacity() != null
                                && o.getMaxCapacity() > 0)
                        .sorted((a, b) -> b.getEnrolledCount() - a.getEnrolledCount())
                        .limit(8)
                        .forEach(o -> {
                            String label = o.getCourse().getCourseCode()
                                    + (o.getSection() != null ? " §" + o.getSection() : "");
                            double pct = (double) o.getEnrolledCount() / o.getMaxCapacity() * 100.0;
                            capacityUtil.put(label, Math.round(pct * 10.0) / 10.0);
                        });
                dto.setCourseCapacityUtilization(capacityUtil);
            } catch (Exception e) {
                log.error("Error fetching course capacity utilization: {}", e.getMessage());
            }

            // ── NEW 6: Student Credits Distribution ─────────────────────────
            try {
                Map<String, Long> creditsRanges = new LinkedHashMap<>();
                creditsRanges.put("0–30", 0L);
                creditsRanges.put("31–60", 0L);
                creditsRanges.put("61–90", 0L);
                creditsRanges.put("91–120", 0L);
                creditsRanges.put("120+", 0L);
                studentRepository.findAll().stream()
                        .filter(s -> s.getCreditsCompleted() != null)
                        .forEach(s -> {
                            int c = s.getCreditsCompleted();
                            if (c <= 30)
                                creditsRanges.merge("0–30", 1L, Long::sum);
                            else if (c <= 60)
                                creditsRanges.merge("31–60", 1L, Long::sum);
                            else if (c <= 90)
                                creditsRanges.merge("61–90", 1L, Long::sum);
                            else if (c <= 120)
                                creditsRanges.merge("91–120", 1L, Long::sum);
                            else
                                creditsRanges.merge("120+", 1L, Long::sum);
                        });
                dto.setCreditsDistribution(creditsRanges);
            } catch (Exception e) {
                log.error("Error fetching credits distribution: {}", e.getMessage());
            }

            // ── NEW 7: Student Status Breakdown ─────────────────────────────
            try {
                Map<String, Long> studentStatus = studentRepository.findAll().stream()
                        .collect(Collectors.groupingBy(
                                s -> s.getStatus() != null ? s.getStatus().name() : "UNKNOWN",
                                Collectors.counting()));
                dto.setStudentStatusDistribution(studentStatus);
            } catch (Exception e) {
                log.error("Error fetching student status distribution: {}", e.getMessage());
            }

            // ── NEW 8: Avg Faculty Rating by Department ──────────────────────
            try {
                Map<String, Double> avgRatingByDept = new HashMap<>();
                departmentRepository.findAll().forEach(dept -> {
                    OptionalDouble avg = facultyRepository.findAll().stream()
                            .filter(f -> f.getDepartment() != null
                                    && f.getDepartment().getId().equals(dept.getId())
                                    && f.getRating() != null)
                            .mapToDouble(f -> f.getRating().doubleValue())
                            .average();
                    if (avg.isPresent()) {
                        avgRatingByDept.put(
                                dept.getDeptCode(),
                                Math.round(avg.getAsDouble() * 100.0) / 100.0);
                    }
                });
                dto.setAvgFacultyRatingByDepartment(avgRatingByDept);
            } catch (Exception e) {
                log.error("Error fetching avg faculty rating by dept: {}", e.getMessage());
            }
            // ── Dept → Course Map (for Force-Directed Graph) ─────────────────────
            try {
                Map<String, List<String>> deptCourseMap = new HashMap<>();
                courseRepository.findAll().forEach(c -> {
                    String dept = c.getDepartment() != null
                            ? c.getDepartment().getDeptCode()
                            : "N/A";
                    deptCourseMap
                            .computeIfAbsent(dept, k -> new java.util.ArrayList<>())
                            .add(c.getCourseName());
                });
                dto.setDepartmentCourseMap(deptCourseMap);
            } catch (Exception e) {
                log.error("Error fetching department-course map: {}", e.getMessage());
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