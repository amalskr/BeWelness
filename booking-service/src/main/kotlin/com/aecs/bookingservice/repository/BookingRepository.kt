package com.aecs.bookingservice.repository

import com.aecs.bookingservice.model.Booking
import org.springframework.data.jpa.repository.JpaRepository

interface BookingRepository : JpaRepository<Booking, Int> {
    fun findByCustomerEmail(customerEmail: String): List<Booking>
    fun findByCounselorEmail(counselorEmail: String): List<Booking>
}