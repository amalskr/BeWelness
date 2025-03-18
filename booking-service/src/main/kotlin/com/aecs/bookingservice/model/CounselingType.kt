package com.aecs.bookingservice.model

enum class CounselingType(private val type: String) {
    NA("N/A"),
    MHC("Mental health counseling"),
    MF("Marriage and family counseling"),
    RC("Rehabilitation counseling"),
    CC("Couples counseling"),
    AC("Addiction counseling"),
    HC("Humanistic counseling"),
    SAC("Substance abuse counseling");

    override fun toString(): String {
        return type
    }
}