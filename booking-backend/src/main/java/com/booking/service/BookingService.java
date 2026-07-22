package com.booking.service;

import com.booking.dto.request.BookingRequest;
import com.booking.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(Long clientId, BookingRequest request);

    List<BookingResponse> getMyBookings(Long clientId);

    void cancelBooking(Long bookingId, Long clientId);

    List<BookingResponse> getProviderBookings(Long providerUserId);

    BookingResponse completeBooking(Long bookingId, Long providerUserId);

    void cancelBookingByProvider(Long bookingId, Long providerUserId);
}
