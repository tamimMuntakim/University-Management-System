package com.university.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalStudents;
    private long totalFaculty;
    private long totalDepartments;
    private long totalCourses;
    private long totalOfferings;
}
