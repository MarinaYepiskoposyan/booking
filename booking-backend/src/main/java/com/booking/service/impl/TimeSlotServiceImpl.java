package com.booking.service.impl;

import com.booking.dto.response.TimeSlotResponse;
import com.booking.entity.Availability;
import com.booking.entity.ProviderProfile;
import com.booking.entity.SlotStatus;
import com.booking.entity.TimeSlot;
import com.booking.exception.ResourceNotFoundException;
import com.booking.repository.AvailabilityRepository;
import com.booking.repository.ProviderProfileRepository;
import com.booking.repository.TimeSlotRepository;
import com.booking.service.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimeSlotServiceImpl implements TimeSlotService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private final TimeSlotRepository timeSlotRepository;
    private final AvailabilityRepository availabilityRepository;
    private final ProviderProfileRepository providerProfileRepository;

    @Override
    @Transactional
    public List<TimeSlotResponse> generateSlots(Long userId, LocalDate from, LocalDate to, int durationMinutes) {
        ProviderProfile profile = providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Provider profile not found. Please create your business profile first."));

        Map<DayOfWeek, Availability> availabilityMap = availabilityRepository
                .findByProviderProfileId(profile.getId()).stream()
                .filter(a -> Boolean.TRUE.equals(a.getIsActive()))
                .collect(Collectors.toMap(a -> a.getDayOfWeek(), a -> a));

        // Load existing slots in range to avoid duplicates without N+1 DB calls
        Set<String> existingKeys = timeSlotRepository
                .findByProviderProfileIdAndSlotDateBetween(profile.getId(), from, to).stream()
                .map(s -> s.getSlotDate() + "|" + s.getStartTime())
                .collect(Collectors.toCollection(HashSet::new));

        List<TimeSlot> newSlots = new ArrayList<>();
        LocalDate current = from;

        while (!current.isAfter(to)) {
            DayOfWeek dayOfWeek = current.getDayOfWeek();
            Availability avail = availabilityMap.get(dayOfWeek);

            if (avail != null) {
                LocalTime slotStart = avail.getStartTime();
                LocalTime workEnd = avail.getEndTime();

                while (!slotStart.plusMinutes(durationMinutes).isAfter(workEnd)) {
                    LocalTime slotEnd = slotStart.plusMinutes(durationMinutes);
                    String key = current + "|" + slotStart;

                    if (!existingKeys.contains(key)) {
                        newSlots.add(TimeSlot.builder()
                                .providerProfile(profile)
                                .slotDate(current)
                                .startTime(slotStart)
                                .endTime(slotEnd)
                                .status(SlotStatus.AVAILABLE)
                                .build());
                        existingKeys.add(key);
                    }

                    slotStart = slotEnd;
                }
            }

            current = current.plusDays(1);
        }

        List<TimeSlot> saved = timeSlotRepository.saveAll(newSlots);
        return saved.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimeSlotResponse> getAvailableSlots(Long providerProfileId, LocalDate date) {
        return timeSlotRepository
                .findByProviderProfileIdAndSlotDateAndStatusOrderByStartTime(
                        providerProfileId, date, SlotStatus.AVAILABLE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TimeSlotResponse mapToResponse(TimeSlot s) {
        return TimeSlotResponse.builder()
                .id(s.getId())
                .slotDate(s.getSlotDate().format(DATE_FORMATTER))
                .startTime(s.getStartTime().format(TIME_FORMATTER))
                .endTime(s.getEndTime().format(TIME_FORMATTER))
                .status(s.getStatus())
                .serviceName(s.getService() != null ? s.getService().getName() : null)
                .build();
    }
}
