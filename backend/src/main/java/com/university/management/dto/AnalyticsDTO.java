package com.university.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {
    private long totalStudents;
    private long totalFaculties;
    private long totalDepartments;
    private long totalCourses;
    
    private Map<String, Long> studentsByGender;
    private Map<String, Long> facultiesByGender;
    private Map<String, Long> studentsByDepartment;
    private Map<String, Long> facultiesByDepartment;
    private Map<String, Long> coursesByDepartment;
    private Map<String, Double> averageCgpaByDepartment;

    private Map<String, Long> offeringsByDepartment;
    private Map<String, Long> enrollmentByCourse; // Top Popular Courses
    private Map<String, Double> facultyRatings; // Top Rated Teachers
}
