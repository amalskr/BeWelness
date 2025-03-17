package com.aecs.bookingservice.repository

import com.aecs.bookingservice.model.Booking
import org.springframework.data.jpa.repository.JpaRepository

interface BookingRepository : JpaRepository<Booking, Int> {
    fun findByCounselorId(conId: Int): List<Booking>
    fun findByUserId(conId: Int): List<Booking>
}