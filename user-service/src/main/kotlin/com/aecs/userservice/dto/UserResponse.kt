package com.aecs.userservice.dto

import com.aecs.userservice.model.User

data class UserResponse(val code: Int, val message: String)
data class ProfileResponse(val customer: User?, val counselor: User?)
