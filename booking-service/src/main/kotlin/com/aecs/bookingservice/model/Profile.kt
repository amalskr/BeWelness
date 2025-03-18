package com.aecs.bookingservice.model


data class Profile(
    val id: Int = 0,
    var firstName: String,
    var lastName: String,
    var email: String,
    var role: Role,
    var counselingType: CounselingType = CounselingType.NA
)

