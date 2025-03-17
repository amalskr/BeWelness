package com.aecs.bookingservice.service

import com.aecs.bookingservice.dto.BookSession
import com.aecs.bookingservice.dto.UpdateBookingStatus
import com.aecs.bookingservice.model.Booking
import com.aecs.bookingservice.model.BookingStatus
import com.aecs.bookingservice.repository.BookingRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service


@Service
class BookingService(private val bookingRepository: BookingRepository) {

    @Autowired
    private val userServiceClient: UserServiceClient? = null

    //Create a new booking
    fun createBooking(request: BookSession): ResponseEntity<String> {
        //val customerEmail = userServiceClient?.getUserEmail(request.userId)

        val booking = Booking(
            userId = request.userId,
            counselorId = request.counselorId,
            sessionDateTime = request.sessionDateTime
        )

        val savedBooking =bookingRepository.save(booking)

        return if (savedBooking == booking) {
            ResponseEntity.ok("Booking Success")
        } else {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save booking")
        }
    }

    //update booking status [DONE,ACCEPTED etc.]
    /*fun updateBookingStatus(request: UpdateBookingStatus): HttpStatus {
        val booking = bookingRepository.findById(request.bookingId)

        if (booking.isPresent) {
            val existingBooking = booking.get()

            return when {
                // If both customerEmail and counselorEmail are null, reject the request
                request.customerEmail == null && request.counselorEmail == null -> HttpStatus.BAD_REQUEST

                // CUSTOMER can ONLY cancel the booking
                request.customerEmail != null &&
                        request.customerEmail == existingBooking.customerEmail &&
                        request.newStatus == BookingStatus.CANCELED -> {
                    existingBooking.status = BookingStatus.CANCELED
                    bookingRepository.save(existingBooking)
                    HttpStatus.OK
                }

                // COUNSELOR can update to any status (PENDING, CONFIRMED, CANCELED, DONE)
                request.counselorEmail != null &&
                        request.counselorEmail == existingBooking.counselorEmail -> {
                    existingBooking.status = request.newStatus
                    bookingRepository.save(existingBooking)
                    HttpStatus.OK
                }

                // Unauthorized update attempt
                else -> HttpStatus.FORBIDDEN
            }
        }
        return HttpStatus.NOT_FOUND
    }*/

    /*fun getBookingsByCustomer(email: String): List<Booking> {
        return bookingRepository.findByCustomerEmail(email)
    }

    fun getBookingsByCounselor(email: String): List<Booking> {
        return bookingRepository.findByCounselorEmail(email)
    }*/
}