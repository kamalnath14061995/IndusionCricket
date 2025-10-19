package com.cricketacademy.api.service;

import com.cricketacademy.api.dto.EnhancedBookingRequestDTO;
import com.cricketacademy.api.entity.Booking;
import com.cricketacademy.api.entity.AddOnService;
import com.cricketacademy.api.entity.PricingPackage;
import com.cricketacademy.api.repository.BookingRepository;
import com.cricketacademy.api.repository.AddOnServiceRepository;
import com.cricketacademy.api.repository.PricingPackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnhancedBookingService {
    private final BookingRepository bookingRepository;
    private final PricingPackageRepository pricingPackageRepository;
    private final AddOnServiceRepository addOnServiceRepository;

    public Booking createEnhancedBooking(EnhancedBookingRequestDTO request) {
        // Validate request and check availability
        // Create and save booking entity
        Booking booking = new Booking();
        booking.setBookingType(request.getBookingType());
        booking.setGroundId(request.getFacilityId());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setCustomerPhone(request.getCustomerPhone());
        booking.setNumberOfPlayers(request.getNumberOfPlayers());
        booking.setSpecialRequirements(request.getSpecialRequirements());

        // Convert List<Long> to Map<String, Object> for addOnServices
        if (request.getAddOnServices() != null) {
            booking.setAddOnServices(java.util.Collections.singletonMap("addOnServiceIds", request.getAddOnServices()));
        }

        booking.setPrice(request.getTotalPrice());
        booking.setStatus("PENDING");
        booking.setPaymentStatus("PENDING");

        // Save booking
        return bookingRepository.save(booking);
    }

    public List<String> getAvailableTimeSlots(LocalDate date, String groundId) {
        return bookingRepository.getAvailableTimeSlots(date, groundId);
    }

    public List<PricingPackage> getActivePricingPackages(String packageType) {
        return pricingPackageRepository.findByPackageTypeAndIsActiveTrue(packageType);
    }

    public List<AddOnService> getAvailableAddOnServices() {
        return addOnServiceRepository.findByIsAvailableTrue();
    }
}
