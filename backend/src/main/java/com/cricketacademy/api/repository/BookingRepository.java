package com.cricketacademy.api.repository;

import com.cricketacademy.api.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

        List<Booking> findByBookingDateAndBookingType(LocalDate bookingDate, String bookingType);

        List<Booking> findByBookingDateAndGroundId(LocalDate bookingDate, String groundId);

        @Query("SELECT b FROM Booking b WHERE b.bookingDate = :date AND b.groundId = :groundId " +
                        "AND ((b.startTime <= :endTime AND b.endTime >= :startTime))")
        List<Booking> findConflictingBookings(@Param("date") LocalDate date,
                        @Param("groundId") String groundId,
                        @Param("startTime") LocalTime startTime,
                        @Param("endTime") LocalTime endTime);

        List<Booking> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);

        List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

        @Query("SELECT DISTINCT CONCAT(b.startTime, '-', b.endTime) FROM Booking b " +
                        "WHERE b.bookingDate = :date AND b.groundId = :groundId " +
                        "AND b.status != 'CANCELLED'")
        List<String> getBookedTimeSlots(@Param("date") LocalDate date, @Param("groundId") String groundId);

        default List<String> getAvailableTimeSlots(LocalDate date, String groundId) {
                List<String> allSlots = List.of(
                                "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
                                "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00",
                                "17:00-18:00", "18:00-19:00");
                List<String> bookedSlots = getBookedTimeSlots(date, groundId);
                return allSlots.stream()
                                .filter(slot -> !bookedSlots.contains(slot))
                                .collect(java.util.stream.Collectors.toList());
        }
}
