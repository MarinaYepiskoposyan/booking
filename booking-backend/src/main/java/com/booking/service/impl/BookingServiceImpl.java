package com.booking.service.impl;

import com.booking.dto.request.BookingRequest;
import com.booking.dto.response.BookingResponse;
import com.booking.entity.*;
import com.booking.exception.ResourceNotFoundException;
import com.booking.repository.BookingRepository;
import com.booking.repository.ServiceRepository;
import com.booking.repository.TimeSlotRepository;
import com.booking.repository.UserRepository;
import com.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public BookingResponse createBooking(Long clientId, BookingRequest request) {
        TimeSlot slot = timeSlotRepository.findById(request.getTimeSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", request.getTimeSlotId()));

        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new IllegalStateException("Slot is not available");
        }

        slot.setStatus(SlotStatus.BOOKED);
        timeSlotRepository.save(slot);

        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("User", clientId));

        Service service = null;
        if (request.getServiceId() != null) {
            service = serviceRepository.findById(request.getServiceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Service", request.getServiceId()));
        }

        Booking booking = Booking.builder()
                .client(client)
                .providerProfile(slot.getProviderProfile())
                .service(service)
                .timeSlot(slot)
                .status(BookingStatus.PENDING)
                .notes(request.getNotes())
                .build();

        return mapToResponse(bookingRepository.save(booking));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(Long clientId) {
        return bookingRepository.findByClientIdWithDetails(clientId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId, Long clientId) {
        Booking booking = bookingRepository.findByIdAndClientId(bookingId, clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        TimeSlot slot = booking.getTimeSlot();
        slot.setStatus(SlotStatus.AVAILABLE);
        timeSlotRepository.save(slot);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getProviderBookings(Long providerUserId) {
        return bookingRepository.findByProviderUserIdWithDetails(providerUserId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public BookingResponse completeBooking(Long bookingId, Long providerUserId) {
        Booking booking = bookingRepository.findByIdAndProviderProfileUserId(bookingId, providerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));
        booking.setStatus(BookingStatus.CONFIRMED);
        return mapToResponse(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public void cancelBookingByProvider(Long bookingId, Long providerUserId) {
        Booking booking = bookingRepository.findByIdAndProviderProfileUserId(bookingId, providerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        TimeSlot slot = booking.getTimeSlot();
        slot.setStatus(SlotStatus.AVAILABLE);
        timeSlotRepository.save(slot);
    }

    private BookingResponse mapToResponse(Booking booking) {
        TimeSlot slot = booking.getTimeSlot();
        ProviderProfile profile = booking.getProviderProfile();
        User client = booking.getClient();

        String clientName = null;
        if (client != null) {
            clientName = client.getFirstName() + " " + client.getLastName();
        }

        String serviceName = null;
        if (booking.getService() != null) {
            serviceName = booking.getService().getName();
        } else if (slot.getService() != null) {
            serviceName = slot.getService().getName();
        }

        return BookingResponse.builder()
                .id(booking.getId())
                .clientName(clientName)
                .providerName(profile.getBusinessName())
                .serviceName(serviceName)
                .slotDate(slot.getSlotDate().toString())
                .startTime(slot.getStartTime().toString())
                .endTime(slot.getEndTime().toString())
                .status(booking.getStatus().name())
                .notes(booking.getNotes())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
