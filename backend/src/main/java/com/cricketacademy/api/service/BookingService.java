package com.cricketacademy.api.service;

import com.cricketacademy.api.dto.BookingRequestDTO;
import com.cricketacademy.api.dto.BookingResponseDTO;
import com.cricketacademy.api.entity.Booking;
import com.cricketacademy.api.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        // Validate request fields
        validateBookingRequest(request);

        // Check for conflicting bookings
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                request.getBookingDate(),
                request.getGroundId(),
                request.getStartTime(),
                request.getEndTime());

        if (!conflictingBookings.isEmpty()) {
            throw new RuntimeException("Time slot is already booked");
        }

        Booking booking = new Booking();
        booking.setBookingType(request.getBookingType());
        booking.setGroundId(request.getGroundId());
        booking.setGroundName(request.getGroundName());
        booking.setGroundDescription(request.getGroundDescription());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setMatchType(request.getMatchType());
        booking.setMatchOvers(request.getMatchOvers());
        booking.setPrice(request.getPrice());
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setCustomerPhone(request.getCustomerPhone());
        booking.setUserId(request.getUserId());
        booking.setStatus("PENDING");
        booking.setPaymentStatus("PENDING");
        booking.setPaymentId(UUID.randomUUID().toString());

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponseDTO(savedBooking);
    }

    public List<BookingResponseDTO> getBookingsByDateAndType(LocalDate date, String type) {
        try {
            return bookingRepository.findByBookingDateAndBookingType(date, type)
                    .stream()
                    .map(this::mapToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching bookings by date and type: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch bookings by date and type");
        }
    }

    public List<BookingResponseDTO> getBookingsByEmail(String email) {
        try {
            return bookingRepository.findByCustomerEmailOrderByCreatedAtDesc(email)
                    .stream()
                    .map(this::mapToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching bookings by email: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch bookings by email");
        }
    }

    public List<BookingResponseDTO> getBookingsByUserId(Long userId) {
        try {
            return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                    .stream()
                    .map(this::mapToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching bookings by user ID: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch bookings by user ID");
        }
    }

    public List<BookingResponseDTO> getAllBookings() {
        try {
            List<Booking> bookings = bookingRepository.findAll();
            if (bookings.isEmpty()) {
                log.info("No bookings found in database");
                return new ArrayList<>();
            }

            return bookings.stream()
                    .map(this::mapToResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching all bookings: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch all bookings: " + e.getMessage());
        }
    }

    public BookingResponseDTO getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToResponseDTO(booking);
    }

    public BookingResponseDTO updateBooking(Long bookingId, BookingRequestDTO request) {
        validateBookingRequest(request);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        validateBookingRequest(request);

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponseDTO(updatedBooking);
    }

    public void deleteBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        bookingRepository.delete(booking);
    }

    public List<String> getAvailableTimeSlots(LocalDate date, String groundId) {
        try {
            // Define available time slots for the ground
            List<String> allSlots = List.of(
                    "09:00-10:00", "10:00-11:00", "11:00-12:00",
                    "12:00-13:00", "13:00-14:00", "14:00-15:00",
                    "15:00-16:00", "16:00-17:00", "17:00-18:00");

            // Get existing bookings for this ground and date
            List<Booking> existingBookings = bookingRepository.findByBookingDateAndGroundId(date, groundId);

            // Filter out booked slots
            List<String> bookedSlots = existingBookings.stream()
                    .map(booking -> booking.getStartTime() + "-" + booking.getEndTime())
                    .collect(Collectors.toList());

            return allSlots.stream()
                    .filter(slot -> !bookedSlots.contains(slot))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error fetching available time slots: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch available time slots");
        }
    }

    public BookingResponseDTO confirmBooking(Long bookingId, String paymentId) {
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            // Online payment success → mark as completed and paid
            booking.setStatus("COMPLETED");
            booking.setPaymentStatus("PAID");
            booking.setPaymentId(paymentId);

            Booking updatedBooking = bookingRepository.save(booking);

            // Send booking confirmation email
            sendBookingConfirmationEmail(updatedBooking);

            return mapToResponseDTO(updatedBooking);

        } catch (RuntimeException e) {
            log.error("Error confirming booking: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error confirming booking: {}", e.getMessage());
            throw new RuntimeException("Failed to confirm booking");
        }
    }

    /**
     * Mark an offline payment as received by admin and complete the booking
     */
    public BookingResponseDTO markOfflinePayment(Long bookingId) {
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            booking.setStatus("COMPLETED");
            booking.setPaymentStatus("PAID");
            booking.setPaymentId("OFFLINE-" + java.util.UUID.randomUUID());

            Booking updatedBooking = bookingRepository.save(booking);
            return mapToResponseDTO(updatedBooking);
        } catch (RuntimeException e) {
            log.error("Error marking offline payment: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error marking offline payment: {}", e.getMessage());
            throw new RuntimeException("Failed to mark offline payment");
        }
    }

    /**
     * User requests cancellation → status becomes CANCELLATION_PENDING
     */
    public BookingResponseDTO requestCancellation(Long bookingId, String reason) {
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            booking.setStatus("CANCELLATION_PENDING");
            booking.setCancellationReason(reason);

            Booking updatedBooking = bookingRepository.save(booking);
            return mapToResponseDTO(updatedBooking);
        } catch (RuntimeException e) {
            log.error("Error requesting cancellation: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error requesting cancellation: {}", e.getMessage());
            throw new RuntimeException("Failed to request cancellation");
        }
    }

    /**
     * Admin approves cancellation
     */
    public BookingResponseDTO approveCancellation(Long bookingId, Double refundAmount) {
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            booking.setStatus("CANCELLED");
            booking.setRefundAmount(refundAmount != null ? refundAmount : 0.0);
            // If payment was taken and refundAmount > 0, mark as REFUNDED
            if ("PAID".equalsIgnoreCase(booking.getPaymentStatus()) && (refundAmount != null && refundAmount > 0)) {
                booking.setPaymentStatus("REFUNDED");
            }

            Booking updatedBooking = bookingRepository.save(booking);
            return mapToResponseDTO(updatedBooking);
        } catch (RuntimeException e) {
            log.error("Error approving cancellation: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error approving cancellation: {}", e.getMessage());
            throw new RuntimeException("Failed to approve cancellation");
        }
    }

    /**
     * Admin rejects cancellation → revert to active status based on payment
     */
    public BookingResponseDTO rejectCancellation(Long bookingId, String adminNote) {
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            // If paid, treat as confirmed; if not, keep pending
            if ("PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
                booking.setStatus("CONFIRMED");
            } else {
                booking.setStatus("PENDING");
            }
            if (adminNote != null && !adminNote.isBlank()) {
                String notes = booking.getNotes();
                booking.setNotes(((notes != null ? notes + "\n" : "") + "Admin rejection note: " + adminNote).trim());
            }

            Booking updatedBooking = bookingRepository.save(booking);
            return mapToResponseDTO(updatedBooking);
        } catch (RuntimeException e) {
            log.error("Error rejecting cancellation: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error rejecting cancellation: {}", e.getMessage());
            throw new RuntimeException("Failed to reject cancellation");
        }
    }

    private void sendBookingConfirmationEmail(Booking booking) {
        try {
            String email = booking.getCustomerEmail();
            if (email == null || email.trim().isEmpty()) {
                log.warn("No email provided for booking confirmation");
                return;
            }

            String subject = "Booking Confirmed - Cricket Academy";
            String body = String.format(
                    "Dear %s,\n\n" +
                            "Your booking has been confirmed successfully!\n\n" +
                            "Booking Details:\n" +
                            "Booking ID: %d\n" +
                            "Ground: %s\n" +
                            "Date: %s\n" +
                            "Time: %s - %s\n" +
                            "Price: ₹%.2f\n\n" +
                            "Thank you for choosing Cricket Academy!\n\n" +
                            "Best regards,\n" +
                            "Cricket Academy Team",
                    booking.getCustomerName(),
                    booking.getId(),
                    booking.getGroundName(),
                    booking.getBookingDate(),
                    booking.getStartTime(),
                    booking.getEndTime(),
                    booking.getPrice());

            emailService.send(email, subject, body);
            log.info("Booking confirmation email sent to {}", email);

        } catch (Exception e) {
            log.error("Failed to send booking confirmation email: {}", e.getMessage());
            // Do not throw exception to avoid breaking booking flow
        }
    }

    private void validateBookingRequest(BookingRequestDTO request) {
        if (request == null) {
            throw new IllegalArgumentException("Booking request cannot be null");
        }
        if (request.getBookingDate() == null) {
            throw new IllegalArgumentException("Booking date is required");
        }
        if (request.getGroundId() == null || request.getGroundId().trim().isEmpty()) {
            throw new IllegalArgumentException("Ground ID is required");
        }
        if (request.getStartTime() == null) {
            throw new IllegalArgumentException("Start time is required");
        }
        if (request.getEndTime() == null) {
            throw new IllegalArgumentException("End time is required");
        }
        // matchType and matchOvers are optional; if provided, matchOvers must be
        // positive
        if (request.getMatchOvers() != null && request.getMatchOvers() <= 0) {
            throw new IllegalArgumentException("Match overs must be a positive number");
        }
        if (request.getCustomerName() == null || request.getCustomerName().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name is required");
        }
        if (request.getCustomerEmail() == null || request.getCustomerEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer email is required");
        }
    }

    private BookingResponseDTO mapToResponseDTO(Booking booking) {
        if (booking == null) {
            throw new IllegalArgumentException("Booking cannot be null");
        }

        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setBookingType(booking.getBookingType());
        dto.setGroundId(booking.getGroundId());
        dto.setGroundName(booking.getGroundName());
        dto.setGroundDescription(booking.getGroundDescription());
        dto.setBookingDate(booking.getBookingDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setMatchType(booking.getMatchType());
        dto.setMatchOvers(booking.getMatchOvers());
        dto.setPrice(booking.getPrice());
        dto.setCustomerName(booking.getCustomerName());
        dto.setCustomerEmail(booking.getCustomerEmail());
        dto.setCustomerPhone(booking.getCustomerPhone());
        dto.setUserId(booking.getUserId());
        dto.setStatus(booking.getStatus());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setPaymentId(booking.getPaymentId());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());
        return dto;
    }
}
