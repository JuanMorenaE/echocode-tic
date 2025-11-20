package com.echocode.project.repositories;

import com.echocode.project.entities.ApiAccessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApiAccessLogRepository extends JpaRepository<ApiAccessLog, Long> {
}
