package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.ApiResponse;
import com.cricketacademy.api.entity.User;
import com.cricketacademy.api.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Admin controller for user management
 * Handles admin-specific user operations with consistent URL patterns
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
@CrossOrigin(origins = "*")
public class AdminUserController {

    private final UserService userService;

    /**
     * Get all users
     * GET /api/admin/users
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        ApiResponse<List<User>> response = ApiResponse.success(
                "Users retrieved successfully", users);
        return ResponseEntity.ok(response);
    }

    /**
     * Get user by ID
     * GET /api/admin/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(user -> {
                    Map<String, Object> userData = new HashMap<>();
                    userData.put("id", user.getId());
                    userData.put("name", user.getName());
                    userData.put("email", user.getEmail());
                    userData.put("phone", user.getPhone());
                    userData.put("age", user.getAge());
                    userData.put("experienceLevel", user.getExperienceLevel());
                    userData.put("role", user.getRole());
                    userData.put("status", user.getStatus());
                    userData.put("createdAt", user.getCreatedAt());
                    userData.put("isActive", user.getIsActive());

                    ApiResponse<Map<String, Object>> response = ApiResponse.success(
                            "User retrieved successfully", userData);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new user
     * POST /api/admin/users/create
     */
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", createdUser.getId());
            userData.put("name", createdUser.getName());
            userData.put("email", createdUser.getEmail());
            userData.put("phone", createdUser.getPhone());
            userData.put("age", createdUser.getAge());
            userData.put("experienceLevel", createdUser.getExperienceLevel());
            userData.put("role", createdUser.getRole());
            userData.put("status", createdUser.getStatus());
            userData.put("createdAt", createdUser.getCreatedAt());
            userData.put("isActive", createdUser.getIsActive());

            ApiResponse<Map<String, Object>> response = ApiResponse.success(
                    "User created successfully", userData);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to create user", e);
            ApiResponse<Map<String, Object>> response = ApiResponse.error(
                    "Failed to create user: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Update user
     * PUT /api/admin/users/edit/{id}
     */
    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateUser(
            @PathVariable Long id, @RequestBody User updatedUser) {

        try {
            User user = userService.updateUser(id, updatedUser);

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("name", user.getName());
            userData.put("email", user.getEmail());
            userData.put("phone", user.getPhone());
            userData.put("age", user.getAge());
            userData.put("experienceLevel", user.getExperienceLevel());
            userData.put("role", user.getRole());
            userData.put("status", user.getStatus());
            userData.put("updatedAt", user.getUpdatedAt());
            userData.put("isActive", user.getIsActive());

            ApiResponse<Map<String, Object>> response = ApiResponse.success(
                    "User updated successfully", userData);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to update user with ID: {}", id, e);
            ApiResponse<Map<String, Object>> response = ApiResponse.error(
                    "Failed to update user: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Delete user
     * DELETE /api/admin/users/delete/{id}
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            ApiResponse<String> response = ApiResponse.success("User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to delete user with ID: {}", id, e);
            ApiResponse<String> response = ApiResponse.error(
                    "Failed to delete user: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Get users by status
     * GET /api/admin/users/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByStatus(
            @PathVariable User.UserStatus status) {
        List<User> users = userService.getUsersByStatus(status);
        ApiResponse<List<User>> response = ApiResponse.success(
                "Users retrieved successfully", users);
        return ResponseEntity.ok(response);
    }

    /**
     * Get user statistics
     * GET /api/admin/users/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<UserService.UserStatistics>> getUserStatistics() {
        UserService.UserStatistics statistics = userService.getUserStatistics();
        ApiResponse<UserService.UserStatistics> response = ApiResponse.success(
                "User statistics retrieved successfully", statistics);
        return ResponseEntity.ok(response);
    }
}