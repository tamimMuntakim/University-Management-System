package com.university.management.repository;
import com.university.management.entity.CourseOffering;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
@Repository
public interface CourseOfferingRepository extends JpaRepository<CourseOffering, UUID> {
    java.util.List<CourseOffering> findByTeacherEmail(String email);
}
