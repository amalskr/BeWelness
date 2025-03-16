package com.aecs.bookingservice.service

import com.aecs.bookingservice.dto.BookSession
import com.aecs.bookingservice.dto.UpdateBookingStatus
import com.aecs.bookingservice.model.Booking
import com.aecs.bookingservice.model.BookingStatus
import com.aecs.bookingservice.repository.BookingRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service

@Service
class BookingService(private val bookingRepository: BookingRepository) {

    fun updateBookingStatus(request: UpdateBookingStatus): HttpStatus {
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
    }

    fun createBooking(request: BookSession): HttpStatus {
        val booking = Booking(
            customerEmail = request.customerEmail,
            counselorEmail = request.counselorEmail,
            sessionDateTime = request.sessionDateTime
        )
        bookingRepository.save(booking)
        return HttpStatus.OK
    }

    fun getBookingsByCustomer(email: String): List<Booking> {
        return bookingRepository.findByCustomerEmail(email)
    }

    fun getBookingsByCounselor(email: String): List<Booking> {
        return bookingRepository.findByCounselorEmail(email)
    }
}