package com.aecs.bookingservice.dto

import com.aecs.bookingservice.model.BookingStatus

data class UpdateBookingStatus(
    val bookingId: Int,
    val counselorEmail: String? = null,
    val customerEmail: String? = null,
    val newStatus: BookingStatus
)