package com.aecs.bookingservice.service

import com.aecs.bookingservice.dto.BookSession
import com.aecs.bookingservice.dto.CounselorBooking
import com.aecs.bookingservice.dto.CustomerBooking
import com.aecs.bookingservice.dto.UpdateBookingStatus
import com.aecs.bookingservice.model.Booking
import com.aecs.bookingservice.model.BookingStatus
import com.aecs.bookingservice.model.Role
import com.aecs.bookingservice.repository.BookingRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.time.format.DateTimeFormatter


@Service
class BookingService(private val bookingRepository: BookingRepository) {

    @Autowired
    private val userServiceClient: UserServiceClient? = null

    //Create a new booking
    fun createBooking(request: BookSession): ResponseEntity<String> {

        // Check if a booking already exists for the same counselor at the same session time
        val existingBooking = bookingRepository.findByCounselorIdAndSessionDateTimeAndStatusNot(
            request.counselorId,
            request.sessionDateTime,
            BookingStatus.DONE
        )

        if (existingBooking != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Counselor is already booked for this time.")
        }

        val booking = Booking(
            userId = request.userId,
            counselorId = request.counselorId,
            sessionDateTime = request.sessionDateTime
        )

        val savedBooking = bookingRepository.save(booking)

        return if (savedBooking == booking) {
            ResponseEntity.ok("Booking Success")
        } else {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save booking")
        }
    }

    /*
    * update booking status [DONE,ACCEPTED etc.]
    * COUNSELOR (PENDING, CONFIRMED, CANCELED, DONE)
    * CUSTOMER only cancel
    * */
    fun updateBookingStatus(request: UpdateBookingStatus): HttpStatus {

        val profiles = userServiceClient?.getUserProfiles(request.requesterId, request.counselorId)
        val requester = profiles?.customer?.role

        val booking = bookingRepository.findById(request.bookingId)

        if (!booking.isEmpty) {

            val existingBooking = booking.get()

            return when {
                // CUSTOMER can ONLY cancel the booking
                requester != null && requester == Role.CUSTOMER &&
                        request.newStatus == BookingStatus.CANCELED -> {
                    existingBooking.status = BookingStatus.CANCELED
                    bookingRepository.save(existingBooking)
                    HttpStatus.OK
                }

                // COUNSELOR can update to any status (PENDING, CONFIRMED, CANCELED, DONE)
                requester != null && requester == Role.COUNSELLOR -> {
                    existingBooking.status = request.newStatus
                    bookingRepository.save(existingBooking)
                    HttpStatus.OK
                }

                // Unauthorized update attempt
                else -> HttpStatus.FORBIDDEN
            }

        } else {
            return HttpStatus.NOT_FOUND
        }
    }


    // get all Customer bookings
    fun getBookingsByCustomer(cusId: Int): List<CustomerBooking> {
        val bookings = bookingRepository.findByUserId(cusId)

        return bookings.sortedBy { it.sessionDateTime } // sortedByDescending
            .map { booking ->
                val profile = userServiceClient?.getProfile(booking.counselorId)

                CustomerBooking(
                    id = booking.id,
                    conId = booking.counselorId,
                    counselorName = profile?.firstName + " " + profile?.lastName,
                    counselorEmail = profile?.email.orEmpty(),
                    sessionDateTime = booking.sessionDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                    status = booking.status
                )
            }
    }

    // get all Counselor bookings
    fun getBookingsByCounselor(conId: Int): List<CounselorBooking> {
        val bookings = bookingRepository.findByCounselorId(conId)

        return bookings.map { booking ->
            val profile = userServiceClient?.getProfile(booking.userId)

            CounselorBooking(
                id = booking.id,
                cusId = booking.counselorId,
                customerName = profile?.firstName + " " + profile?.lastName,
                customerEmail = profile?.email.orEmpty(),
                sessionDateTime = booking.sessionDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                status = booking.status
            )
        }

    }
}