package com.cricketacademy.api.controller;

import com.cricketacademy.api.dto.BookingRequestDTO;
import com.cricketacademy.api.dto.BookingResponseDTO;
import com.cricketacademy.api.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@RequestBody BookingRequestDTO request) {
        try {
            BookingResponseDTO booking = bookingService.createBooking(request);
            return ResponseEntity.ok(booking);
        } catch (IllegalArgumentException e) {
            log.error("Invalid booking request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("Error creating booking: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/available-slots")
    public ResponseEntity<List<String>> getAvailableTimeSlots(
            @RequestParam LocalDate date,
            @RequestParam String facilityId) {
        try {
            List<String> availableSlots = bookingService.getAvailableTimeSlots(date, facilityId);
            return ResponseEntity.ok(availableSlots);
        } catch (Exception e) {
            log.error("Error fetching available time slots: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(new ArrayList<>());
        }
    }

    @GetMapping("/date/{date}/type/{type}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByDateAndType(
            @PathVariable LocalDate date,
            @PathVariable String type) {
        try {
            List<BookingResponseDTO> bookings = bookingService.getBookingsByDateAndType(date, type);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            log.error("Error fetching bookings by date and type: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(new ArrayList<>());
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByEmail(@PathVariable String email) {
        try {
            List<BookingResponseDTO> bookings = bookingService.getBookingsByEmail(email);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            log.error("Error fetching bookings by email: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(new ArrayList<>());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByUserId(@PathVariable Long userId) {
        try {
            List<BookingResponseDTO> bookings = bookingService.getBookingsByUserId(userId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            log.error("Error fetching bookings by user ID: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(new ArrayList<>());
        }
    }

    @PostMapping("/{bookingId}/confirm")
    public ResponseEntity<BookingResponseDTO> confirmBooking(
            @PathVariable Long bookingId,
            @RequestParam String paymentId) {
        try {
            BookingResponseDTO booking = bookingService.confirmBooking(bookingId, paymentId);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            log.error("Error confirming booking: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error confirming booking: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Admin: mark offline payment received → complete booking
    @PostMapping("/admin/{bookingId}/mark-offline-paid")
    public ResponseEntity<BookingResponseDTO> markOfflinePaid(@PathVariable Long bookingId) {
        try {
            return ResponseEntity.ok(bookingService.markOfflinePayment(bookingId));
        } catch (RuntimeException e) {
            log.error("Error marking offline payment: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error marking offline payment: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // User: request cancellation → pending admin approval
    @PostMapping("/{bookingId}/request-cancellation")
    public ResponseEntity<BookingResponseDTO> requestCancellation(
            @PathVariable Long bookingId,
            @RequestParam(required = false) String reason) {
        try {
            return ResponseEntity.ok(bookingService.requestCancellation(bookingId, reason));
        } catch (RuntimeException e) {
            log.error("Error requesting cancellation: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error requesting cancellation: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Admin: approve cancellation
    @PostMapping("/admin/{bookingId}/approve-cancellation")
    public ResponseEntity<BookingResponseDTO> approveCancellation(
            @PathVariable Long bookingId,
            @RequestParam(required = false) Double refundAmount) {
        try {
            return ResponseEntity.ok(bookingService.approveCancellation(bookingId, refundAmount));
        } catch (RuntimeException e) {
            log.error("Error approving cancellation: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error approving cancellation: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Admin: reject cancellation
    @PostMapping("/admin/{bookingId}/reject-cancellation")
    public ResponseEntity<BookingResponseDTO> rejectCancellation(
            @PathVariable Long bookingId,
            @RequestParam(required = false) String note) {
        try {
            return ResponseEntity.ok(bookingService.rejectCancellation(bookingId, note));
        } catch (RuntimeException e) {
            log.error("Error rejecting cancellation: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error rejecting cancellation: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        try {
            List<BookingResponseDTO> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            log.error("Error fetching all bookings: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(new ArrayList<>());
        }
    }

    @GetMapping("/admin/{bookingId}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long bookingId) {
        try {
            BookingResponseDTO booking = bookingService.getBookingById(bookingId);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            log.error("Error fetching booking by ID: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error fetching booking by ID: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/admin/{bookingId}")
    public ResponseEntity<BookingResponseDTO> updateBooking(
            @PathVariable Long bookingId,
            @RequestBody BookingRequestDTO request) {
        try {
            BookingResponseDTO booking = bookingService.updateBooking(bookingId, request);
            return ResponseEntity.ok(booking);
        } catch (IllegalArgumentException e) {
            log.error("Invalid booking update request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            log.error("Error updating booking: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error updating booking: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/admin/{bookingId}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long bookingId) {
        try {
            bookingService.deleteBooking(bookingId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error deleting booking: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Unexpected error deleting booking: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
