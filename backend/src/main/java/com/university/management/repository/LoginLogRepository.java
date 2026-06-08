package com.university.management.repository;

import com.university.management.entity.LoginLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface LoginLogRepository extends JpaRepository<LoginLog, Long> {
    
    @Query(value = "SELECT EXTRACT(HOUR FROM login_time) as hour, COUNT(*) as count FROM login_logs GROUP BY EXTRACT(HOUR FROM login_time) ORDER BY hour", nativeQuery = true)
    List<Map<String, Object>> getLoginCountByHour();
}
