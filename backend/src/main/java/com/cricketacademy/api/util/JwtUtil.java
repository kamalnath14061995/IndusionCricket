package com.cricketacademy.api.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Utility class for JWT token operations - Updated with modern JJWT API
 */
@Component
@Slf4j
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secretKey;

    @Value("${app.jwt.expiration}")
    private Long expiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate JWT token using modern JJWT API
     */
    public String generateToken(String email, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("userId", userId);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extract email from token
     */
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract user ID from token
     */
    public Long extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("userId", Long.class);
    }

    /**
     * Extract expiration date from token
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Check if token is expired
     */
    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Validate token using modern JJWT parser
     */
    public Boolean validateToken(String token) {
        try {
            // Check if token is null or empty
            if (token == null || token.trim().isEmpty()) {
                log.error("Invalid JWT token: Token is null or empty");
                return false;
            }

            // Check token format (should have exactly 2 periods)
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                log.error("Invalid JWT token: JWT strings must contain exactly 2 period characters. Found: {}",
                        parts.length - 1);
                return false;
            }

            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return !isTokenExpired(token);
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: Malformed token - {}", e.getMessage());
            return false;
        } catch (ExpiredJwtException e) {
            log.error("Invalid JWT token: Token expired - {}", e.getMessage());
            return false;
        } catch (UnsupportedJwtException e) {
            log.error("Invalid JWT token: Unsupported token - {}", e.getMessage());
            return false;
        } catch (SignatureException e) {
            log.error("Invalid JWT token: Invalid signature - {}", e.getMessage());
            return false;
        } catch (IllegalArgumentException e) {
            log.error("Invalid JWT token: Illegal argument - {}", e.getMessage());
            return false;
        } catch (JwtException e) {
            log.error("Invalid JWT token: JWT exception - {}", e.getMessage());
            return false;
        }
    }

    /**
     * Extract specific claim from token
     */
    private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extract all claims from token using modern JJWT parser
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
