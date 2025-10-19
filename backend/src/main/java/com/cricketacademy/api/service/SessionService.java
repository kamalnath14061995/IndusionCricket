package com.cricketacademy.api.service;

import com.cricketacademy.api.entity.SessionActivity;
import com.cricketacademy.api.entity.User;
import com.cricketacademy.api.repository.SessionActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SessionService {

    @Autowired
    private SessionActivityRepository sessionActivityRepository;

    public SessionActivity createSession(String sessionToken, User user, String ipAddress, String userAgent) {
        SessionActivity sessionActivity = new SessionActivity(user, sessionToken, ipAddress, userAgent);
        return sessionActivityRepository.save(sessionActivity);
    }

    public void updateSessionActivity(String sessionToken) {
        SessionActivity sessionActivity = sessionActivityRepository.findBySessionToken(sessionToken);
        if (sessionActivity != null) {
            sessionActivity.updateActivity();
            sessionActivityRepository.save(sessionActivity);
        }
    }

    public void terminateSession(String sessionToken) {
        SessionActivity sessionActivity = sessionActivityRepository.findBySessionToken(sessionToken);
        if (sessionActivity != null) {
            sessionActivity.setIsActive(false);
            sessionActivityRepository.save(sessionActivity);
        }
    }

    public boolean isSessionExpired(String sessionToken) {
        SessionActivity sessionActivity = sessionActivityRepository.findBySessionToken(sessionToken);
        return sessionActivity != null && sessionActivity.isExpired();
    }

    public SessionActivity getSession(String sessionToken) {
        return sessionActivityRepository.findBySessionToken(sessionToken);
    }

    public void extendSession(String sessionToken, int minutes) {
        SessionActivity sessionActivity = sessionActivityRepository.findBySessionToken(sessionToken);
        if (sessionActivity != null) {
            sessionActivity.extendSession(minutes);
            sessionActivityRepository.save(sessionActivity);
        }
    }

    public void cleanupExpiredSessions() {
        LocalDateTime now = LocalDateTime.now();
        sessionActivityRepository.findExpiredSessions(now).forEach(session -> {
            session.setIsActive(false);
            sessionActivityRepository.save(session);
        });
    }
}
