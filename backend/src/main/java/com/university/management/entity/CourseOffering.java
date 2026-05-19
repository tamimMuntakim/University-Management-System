package com.university.management.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "course_offerings")
@Data
public class CourseOffering {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private User teacher;

    private String semester;
    private String section;

    @Column(name = "room_number")
    private String roomNumber;

    @Column(name = "max_capacity")
    private Integer maxCapacity;
}
