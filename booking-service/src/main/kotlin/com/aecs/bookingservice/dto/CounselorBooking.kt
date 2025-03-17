package com.aecs.bookingservice.dto

import com.aecs.bookingservice.model.BookingStatus

data class CounselorBooking(
    val id: Int,
    val cusId: Int,
    val customerName: String,
    val customerEmail: String,
    val sessionDateTime: String,
    val status: BookingStatus
)
