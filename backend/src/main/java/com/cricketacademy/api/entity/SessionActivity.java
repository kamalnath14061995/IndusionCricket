package com.cricketacademy.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "session_activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "session_token", nullable = false, unique = true)
    private String sessionToken;

    @Column(name = "last_activity_time", nullable = false)
    private LocalDateTime lastActivityTime;

    @Column(name = "session_start_time", nullable = false)
    private LocalDateTime sessionStartTime;

    @Column(name = "session_expiry_time", nullable = false)
    private LocalDateTime sessionExpiryTime;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "activity_count", nullable = false)
    private Integer activityCount = 0;

    public SessionActivity(User user, String sessionToken, String ipAddress, String userAgent) {
        this.user = user;
        this.sessionToken = sessionToken;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.sessionStartTime = LocalDateTime.now();
        this.lastActivityTime = LocalDateTime.now();
        this.sessionExpiryTime = LocalDateTime.now().plusMinutes(20); // Default 20 minutes
    }

    public void updateActivity() {
        this.lastActivityTime = LocalDateTime.now();
        this.sessionExpiryTime = LocalDateTime.now().plusMinutes(20); // Reset expiry
        this.activityCount++;
    }

    public void extendSession(int minutes) {
        this.sessionExpiryTime = LocalDateTime.now().plusMinutes(minutes);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.sessionExpiryTime);
    }
}
