package com.university.management.repository;
import com.university.management.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    long countByStudentEmail(String email);
    java.util.List<Enrollment> findByStudentEmail(String email);
}
