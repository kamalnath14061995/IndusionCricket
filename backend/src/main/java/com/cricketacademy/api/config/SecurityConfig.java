package com.cricketacademy.api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;

/**
 * Security configuration for the application
 * Handles authentication, authorization, and CORS configuration
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;

        /**
         * Configure security filter chain
         */
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                "/auth/**",
                                                                "/api/auth/**",
                                                                "/api/health",
                                                                "/api/career/**",
                                                                "/api/bookings/**",
                                                                "/api/grounds",
                                                                "/api/grounds/**",
                                                                "/api/nets",
                                                                "/api/nets/**",
                                                                "/api/programs/**",
                                                                "/api/coaches/**",
                                                                "/api/homepage/**",
                                                "/api/reviews/**",
                                                                "/api/verify/verify-otp",
                                                                "/api/payments/config",
                                                                "/api/payments/methods",
                                                                "/api/payments/razorpay/order",
                                                                "/error")
                                                .permitAll()
                                                // Allow public read access to contact info for Homepage "Get in Touch"
                                                .requestMatchers(HttpMethod.GET, "/api/contact", "/api/contact/*")
                                                .permitAll()
                                                .requestMatchers("/api/payments/**").authenticated()
                                                .requestMatchers("/uploads/**").permitAll()
                                                .requestMatchers("/api/admin/upload/**").hasRole("ADMIN")
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                .requestMatchers("/api/coach/**").hasRole("COACH")
                                                .anyRequest().authenticated())
                                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .exceptionHandling(ex -> ex.authenticationEntryPoint(authenticationEntryPoint()))
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        /**
         * Configure CORS
         */
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                // Allow localhost development URLs and various tunneling services
                configuration.setAllowedOriginPatterns(
                                Arrays.asList(
                                                "http://localhost:5173",
                                                "http://localhost:5174",
                                                "http://localhost:3000",
                                                "http://localhost:8080",
                                                "https://api.razorpay.com", // Razorpay API domain
                                                "https://*.ngrok.io", // Ngrok
                                                "https://*.ngrok.app", // Ngrok app
                                                "https://*.loca.lt", // LocalTunnel
                                                "https://*.serve.net", // Serveo
                                                "https://*.serveo.net", // Serveo
                                                "https://*.trycloudflare.com", // Cloudflare
                                                "https://*.railway.app", // Railway
                                                "https://*.render.com", // Render
                                                "https://*.fly.dev" // Fly.io
                                ));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList("*"));
                configuration.setAllowCredentials(true);
                configuration.setExposedHeaders(Arrays.asList("Authorization"));

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        /**
         * Configure authentication entry point for handling unauthorized requests
         */
        @Bean
        public AuthenticationEntryPoint authenticationEntryPoint() {
                return (request, response, authException) -> {
                        response.setContentType("application/json");
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.getWriter()
                                        .write("{\"error\":\"Unauthorized\",\"message\":\"" + authException.getMessage()
                                                        + "\"}");
                };
        }

        // PasswordEncoder bean is already defined in ApplicationConfig.java
        // No need to duplicate it here
}
