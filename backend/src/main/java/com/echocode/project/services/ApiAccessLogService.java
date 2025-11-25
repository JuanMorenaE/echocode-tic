package com.echocode.project.services;

import com.echocode.project.entities.ApiAccessLog;
import com.echocode.project.repositories.ApiAccessLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class ApiAccessLogService {

    @Autowired
    private ApiAccessLogRepository apiAccessLogRepository;

    @Async
    public void logApiAccess(String systemName, HttpServletRequest request, Integer responseStatus) {
        String ipAddress = getClientIpAddress(request);
        String requestParams = request.getQueryString();

        ApiAccessLog log = ApiAccessLog.builder()
                .systemName(systemName)
                .endpoint(request.getRequestURI())
                .method(request.getMethod())
                .requestParams(requestParams)
                .responseStatus(responseStatus)
                .ipAddress(ipAddress)
                .build();

        apiAccessLogRepository.save(log);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0];
        }
        return request.getRemoteAddr();
    }
}
