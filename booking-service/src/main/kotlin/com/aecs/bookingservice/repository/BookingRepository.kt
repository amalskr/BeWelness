package com.aecs.bookingservice.repository

import com.aecs.bookingservice.model.Booking
import com.aecs.bookingservice.model.BookingStatus
import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDateTime

interface BookingRepository : JpaRepository<Booking, Int> {
    fun findByCounselorId(conId: Int): List<Booking>
    fun findByUserId(conId: Int): List<Booking>
    fun findByCounselorIdAndSessionDateTimeAndStatusNot(
        counselorId: Int,
        sessionDateTime: LocalDateTime,
        status: BookingStatus
    ): Booking?
}