package com.university.management.entity;

import com.university.management.entity.enums.FacultyStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "faculty_profiles")
@Data
public class FacultyProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "faculty_staff_id", unique = true, nullable = false)
    private String facultyStaffId;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    private String designation;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    private BigDecimal rating;

    private String gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private FacultyStatus status = FacultyStatus.ACTIVE;
}
