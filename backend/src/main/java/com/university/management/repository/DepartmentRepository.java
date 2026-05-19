package com.university.management.repository;
import com.university.management.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
@Repository
public interface DepartmentRepository extends JpaRepository<Department, UUID> {
}
