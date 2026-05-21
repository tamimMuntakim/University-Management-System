package com.university.management.entity;

import com.university.management.entity.enums.OfferingStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "course_offerings")
@Data
@ToString(exclude = "enrollments")
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

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OfferingStatus status = OfferingStatus.UPCOMING;

    @OneToMany(mappedBy = "offeredCourse", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Enrollment> enrollments;
}
