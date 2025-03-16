package com.aecs.bookingservice.model

import com.aecs.bookingservice.model.BookingStatus
import com.fasterxml.jackson.annotation.JsonFormat
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "bookings")
data class Booking(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @Column(nullable = false)
    val customerEmail: String, // The user making the booking

    @Column(nullable = false)
    val counselorEmail: String, // The selected counselor

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(nullable = false)
    val sessionDateTime: LocalDateTime, // Selected date and time

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: BookingStatus = BookingStatus.PENDING // Default status
)