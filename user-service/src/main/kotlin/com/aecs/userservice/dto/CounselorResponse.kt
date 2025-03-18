package com.aecs.userservice.dto

import com.aecs.userservice.model.CounselingType

data class CounselorResponse(
    val counselorId: Int,
    val firstName: String,
    val lastName: String,
    val email: String,
    val counselingType: CounselingType
)
