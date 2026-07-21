package com.booking.service;

import com.booking.dto.request.BookingRequest;
import com.booking.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(Long clientId, BookingRequest request);

    List<BookingResponse> getMyBookings(Long clientId);

    void cancelBooking(Long bookingId, Long clientId);
}
