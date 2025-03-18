package com.aecs.bookingservice.dto

import com.aecs.bookingservice.model.BookingStatus

data class CustomerBooking(
    val id: Int,
    val conId: Int,
    val counselorName: String,
    val counselorEmail: String,
    val sessionDateTime: String,
    val status: BookingStatus
)
