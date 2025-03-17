package com.aecs.bookingservice.controller

import com.aecs.bookingservice.dto.BookSession
import com.aecs.bookingservice.dto.UpdateBookingStatus
import com.aecs.bookingservice.model.Booking
import com.aecs.bookingservice.service.BookingService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/bookings")
class BookingController(private val bookingService: BookingService) {

    @PostMapping("/create")
    fun bookSession(@RequestBody request: BookSession): ResponseEntity<String> {
        return bookingService.createBooking(request)
    }

    @PutMapping("/update")
    fun updateBookingStatus(@RequestBody request: UpdateBookingStatus): ResponseEntity<String> {
        val status = bookingService.updateBookingStatus(request)

        return when (status) {
            HttpStatus.OK -> ResponseEntity.ok("Booking status updated successfully")
            HttpStatus.FORBIDDEN -> ResponseEntity.status(403).body("You are not authorized to update this booking")
            HttpStatus.NOT_FOUND -> ResponseEntity.status(404).body("Booking not found")
            else -> ResponseEntity.status(500).body("An error occurred")
        }
    }

    /*@GetMapping("/customer/{email}")
    fun getCustomerBookings(@PathVariable email: String): ResponseEntity<List<Booking>> {
        return ResponseEntity.ok(bookingService.getBookingsByCustomer(email))
    }

    @GetMapping("/counselor/{email}")
    fun getCounselorBookings(@PathVariable email: String): ResponseEntity<List<Booking>> {
        return ResponseEntity.ok(bookingService.getBookingsByCounselor(email))
    }*/
}