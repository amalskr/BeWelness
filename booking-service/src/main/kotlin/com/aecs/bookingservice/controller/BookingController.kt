package com.aecs.bookingservice.controller

import com.aecs.bookingservice.dto.*
import com.aecs.bookingservice.service.BookingService
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/bookings")
class BookingController(private val bookingService: BookingService) {

    @PostMapping("/create")
    fun bookSession(@RequestBody request: BookSession): BookingResponse {
        return bookingService.createBooking(request)
    }

    @PutMapping("/update")
    fun updateBookingStatus(
        @RequestBody request: UpdateBookingStatus,
        @RequestHeader(HttpHeaders.AUTHORIZATION) token: String
    ): ResponseEntity<String> {
        val status = bookingService.updateBookingStatus(request,getToken(token))

        return when (status) {
            HttpStatus.OK -> ResponseEntity.ok("Booking status updated successfully")
            HttpStatus.FORBIDDEN -> ResponseEntity.status(403).body("You are not authorized to update this booking")
            HttpStatus.NOT_FOUND -> ResponseEntity.status(404).body("Booking not found")
            else -> ResponseEntity.status(500).body("An error occurred")
        }
    }

    @GetMapping("/customer/{id}")
    fun getCustomerBookings(
        @PathVariable id: Int,
        @RequestHeader(HttpHeaders.AUTHORIZATION) token: String
    ): ResponseEntity<List<CustomerBooking>> {
        return ResponseEntity.ok(bookingService.getBookingsByCustomer(id, token = getToken(token)))
    }

    @GetMapping("/counselor/{id}")
    fun getCounselorBookings(
        @PathVariable id: Int,
        @RequestHeader(HttpHeaders.AUTHORIZATION) token: String
    ): ResponseEntity<List<CounselorBooking>> {
        return ResponseEntity.ok(bookingService.getBookingsByCounselor(id, token = getToken(token)))
    }

    private fun getToken(token: String): String {
        return token.removePrefix("Bearer ")
    }
}