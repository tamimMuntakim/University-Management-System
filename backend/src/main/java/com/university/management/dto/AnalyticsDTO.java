// package com.university.management.dto;

// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.util.Map;

// @Data
// @Builder
// @NoArgsConstructor
// @AllArgsConstructor
// public class AnalyticsDTO {
//     private long totalStudents;
//     private long totalFaculties;
//     private long totalDepartments;
//     private long totalCourses;
    
//     private Map<String, Long> studentsByGender;
//     private Map<String, Long> facultiesByGender;
//     private Map<String, Long> studentsByDepartment;
//     private Map<String, Long> facultiesByDepartment;
//     private Map<String, Long> coursesByDepartment;
//     private Map<String, Double> averageCgpaByDepartment;

//     private Map<String, Long> offeringsByDepartment;
//     private Map<String, Long> enrollmentByCourse; // Top Popular Courses
//     private Map<String, Double> facultyRatings; // Top Rated Teachers

//     private Map<String, Long> loginsByHour;
//     private Map<String, Long> registrationsByDate;
// }
package com.university.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {

    // ── Totals ────────────────────────────────────────────────────────────────
    private long totalStudents;
    private long totalFaculties;
    private long totalDepartments;
    private long totalCourses;

    // ── Gender ────────────────────────────────────────────────────────────────
    private Map<String, Long>   studentsByGender;
    private Map<String, Long>   facultiesByGender;

    // ── Department distribution ───────────────────────────────────────────────
    private Map<String, Long>   studentsByDepartment;
    private Map<String, Long>   facultiesByDepartment;
    private Map<String, Long>   coursesByDepartment;
    private Map<String, Long>   offeringsByDepartment;

    // ── Academic performance ──────────────────────────────────────────────────
    private Map<String, Double> averageCgpaByDepartment;

    // ── Popularity / ratings ──────────────────────────────────────────────────
    private Map<String, Long>   enrollmentByCourse;       // Top 5 popular courses
    private Map<String, Double> facultyRatings;           // Top 5 rated faculty

    // ── Activity / time series ────────────────────────────────────────────────
    private Map<String, Long>   loginsByHour;
    private Map<String, Long>   registrationsByDate;

    // ── NEW: Status breakdowns ────────────────────────────────────────────────
    private Map<String, Long>   enrollmentStatusDistribution;  // ENROLLED / DROPPED / COMPLETED
    private Map<String, Long>   offeringStatusDistribution;    // UPCOMING / ACTIVE / COMPLETED
    private Map<String, Long>   studentStatusDistribution;     // ACTIVE / INACTIVE / GRADUATED

    // ── NEW: Distribution buckets ─────────────────────────────────────────────
    private Map<String, Long>   cgpaRangeDistribution;         // 0-1, 1-2, 2-3, 3-3.5, 3.5-4.0
    private Map<String, Long>   creditsDistribution;           // 0-30, 31-60, 61-90, 91-120, 120+
    private Map<String, Long>   facultyByJoiningYear;          // year -> count

    // ── NEW: Capacity & ratings by dept ──────────────────────────────────────
    private Map<String, Double> courseCapacityUtilization;     // offering label -> % filled
    private Map<String, Double> avgFacultyRatingByDepartment;  // dept code -> avg rating
    private Map<String, List<String>> departmentCourseMap;   // dept code -> list of course names
}