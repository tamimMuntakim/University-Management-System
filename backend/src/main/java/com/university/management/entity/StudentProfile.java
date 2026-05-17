package com.university.management.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "student_profiles")
@Data
public class StudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "student_reg_id", unique = true, nullable = false)
    private String studentRegId;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    private BigDecimal cgpa;

    @Column(name = "credits_completed")
    private Integer creditsCompleted;

    @Column(name = "enrollment_semester")
    private String enrollmentSemester;
}
