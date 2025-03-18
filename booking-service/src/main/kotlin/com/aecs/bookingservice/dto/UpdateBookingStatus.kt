package com.aecs.bookingservice.dto

import com.aecs.bookingservice.model.BookingStatus

data class UpdateBookingStatus(
    val bookingId: Int,
    val requesterId: Int,
    val counselorId: Int,
    val newStatus: BookingStatus
)