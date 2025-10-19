package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.LoginRequest;
import com.cricketacademy.api.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AuthController.class)
@Import({ TestSecurityConfig.class, com.cricketacademy.api.config.TestConfig.class })
public class AuthControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private UserService userService;

        // Mock security dependencies to satisfy JwtAuthenticationFilter
        @MockBean
        private com.cricketacademy.api.service.JwtService jwtService;

        @MockBean
        private com.cricketacademy.api.service.UserDetailsServiceImpl userDetailsService;

        // Mock other required beans used by AuthController
        @MockBean
        private com.cricketacademy.api.service.EmailService emailService;

        @MockBean
        private com.cricketacademy.api.service.RefreshTokenService refreshTokenService;

        @MockBean
        private com.cricketacademy.api.util.JwtUtil jwtUtil;

        @Test
        public void testHealthEndpoint() throws Exception {
                mockMvc.perform(get("/api/auth/health"))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.message").value("Cricket Academy API is running"));
        }

        @Test
        public void testLoginEndpointWithInvalidCredentials() throws Exception {
                LoginRequest loginRequest = new LoginRequest();
                loginRequest.setEmail("test@example.com");
                loginRequest.setPassword("wrongpassword");

                when(userService.loginUser(
                                loginRequest.getEmail(),
                                loginRequest.getPassword(),
                                "127.0.0.1",
                                "MockMvc"))
                                .thenReturn(null);

                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest)))
                                .andExpect(status().isUnauthorized())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        public void testExperienceLevelsEndpoint() throws Exception {
                mockMvc.perform(get("/api/auth/experience-levels"))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.success").value(true));
        }
}
