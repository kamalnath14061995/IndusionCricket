package com.cricketacademy.api.controller;

import com.cricketacademy.api.entity.AvailableProgram;
import com.cricketacademy.api.service.AvailableProgramService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = CoachProgramController.class)
@Import({ TestSecurityConfig.class, com.cricketacademy.api.config.TestConfig.class })
class CoachProgramControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AvailableProgramService programService;

    // Mock security dependencies to satisfy JwtAuthenticationFilter
    @MockBean
    private com.cricketacademy.api.service.JwtService jwtService;

    @MockBean
    private com.cricketacademy.api.service.UserDetailsServiceImpl userDetailsService;

    private AvailableProgram testProgram;

    @BeforeEach
    void setUp() {
        testProgram = new AvailableProgram();
        testProgram.setId(1L);
        testProgram.setProgramName("Test Program");
        testProgram.setDescription("Test Description");
        testProgram.setDuration("4 weeks");
        testProgram.setPrice(new BigDecimal("199.99"));
        testProgram.setLevel("Beginner");
        testProgram.setCategory("Training");
        testProgram.setIsActive(true);
    }

    @Test
    @WithMockUser(roles = "COACH")
    void getAllActivePrograms_ShouldReturnPrograms() throws Exception {
        List<AvailableProgram> programs = Arrays.asList(testProgram);
        when(programService.getActivePrograms()).thenReturn(programs);

        mockMvc.perform(get("/api/coach/programs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].programName", is("Test Program")));
    }

    @Test
    @WithMockUser(roles = "COACH")
    void getProgramById_ShouldReturnProgram() throws Exception {
        when(programService.getProgramById(1L)).thenReturn(testProgram);

        mockMvc.perform(get("/api/coach/programs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.programName", is("Test Program")));
    }

    @Test
    @WithMockUser(roles = "COACH")
    void searchPrograms_ShouldReturnMatchingPrograms() throws Exception {
        List<AvailableProgram> programs = Arrays.asList(testProgram);
        when(programService.searchPrograms("Test")).thenReturn(programs);

        mockMvc.perform(get("/api/coach/programs/search")
                .param("keyword", "Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].programName", is("Test Program")));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getAllActivePrograms_WithUserRole_ShouldReturnForbidden() throws Exception {
        mockMvc.perform(get("/api/coach/programs"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getAllActivePrograms_WithoutAuth_ShouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/coach/programs"))
                .andExpect(status().isUnauthorized());
    }
}
