package com.aecs.bookingservice.dto

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime

data class BookSession(
    val userId: Int,
    val counselorEmail: String,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val sessionDateTime: LocalDateTime
)