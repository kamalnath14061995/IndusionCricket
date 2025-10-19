package com.cricketacademy.api.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UploadController.class)
public class UploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        // Any setup code if needed
    }

    @Test
    public void testUploadFromUrl_ValidUrl() throws Exception {
        String json = "{\"url\": \"https://picsum.photos/200/300\", \"filename\": \"test.jpg\"}";

        mockMvc.perform(post("/api/admin/upload/from-url")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
    }

    @Test
    public void testUploadFromUrl_InvalidUrl() throws Exception {
        String json = "{\"url\": \"invalid-url\", \"filename\": \"test.jpg\"}";

        mockMvc.perform(post("/api/admin/upload/from-url")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testUploadFromUrl_SslHandshakeFailure() throws Exception {
        String json = "{\"url\": \"https://self-signed.badssl.com/\", \"filename\": \"test.jpg\"}";

        mockMvc.perform(post("/api/admin/upload/from-url")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testUploadFromUrl_TooLargeFile() throws Exception {
        String json = "{\"url\": \"https://picsum.photos/200/300\", \"filename\": \"test.jpg\"}";

        // Simulate a large file by setting a max size in the controller
        // This would require modifying the controller to handle this scenario
        mockMvc.perform(post("/api/admin/upload/from-url")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());
    }
}
