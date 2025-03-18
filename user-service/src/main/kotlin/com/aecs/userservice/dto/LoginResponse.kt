package com.aecs.betterwellness.authservice.dto

import com.aecs.userservice.model.CounselingType
import com.aecs.userservice.model.Role

data class LoginResponse(val code: Int, val message: String, val accessToken: String?, val profile: Profile?)

data class Profile(
    val id: Int,
    val firstName: String,
    val lastName: String,
    val email: String,
    val role: Role,
    val counselingType: CounselingType
)
