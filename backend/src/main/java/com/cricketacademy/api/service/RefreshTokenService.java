package com.cricketacademy.api.service;

import com.cricketacademy.api.entity.RefreshToken;
import com.cricketacademy.api.entity.User;
import com.cricketacademy.api.repository.RefreshTokenRepository;
import com.cricketacademy.api.repository.UserRepository;
import com.cricketacademy.api.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${app.jwt.refreshExpiration:604800000}") // 7 days in ms
    private Long refreshExpiration;

    public Map<String, Object> createTokensForUser(User user) {
        // Access token
        String accessToken = jwtUtil.generateToken(user.getEmail(), user.getId());

        // Refresh token entity
        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setExpiryDate(LocalDateTime.now().plusSeconds(refreshExpiration / 1000));
        refreshTokenRepository.save(rt);

        Map<String, Object> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", rt.getToken());
        tokens.put("expiresIn", jwtUtil.extractExpiration(accessToken).getTime());
        return tokens;
    }

    public Optional<RefreshToken> validateRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .filter(rt -> !rt.getRevoked())
                .filter(rt -> !rt.isExpired());
    }

    public void revokeUserTokens(Long userId) {
        try {
            refreshTokenRepository.deleteByUser_Id(userId);
        } catch (Exception e) {
            log.warn("Failed to delete old refresh tokens for user {}: {}", userId, e.getMessage());
        }
    }
}