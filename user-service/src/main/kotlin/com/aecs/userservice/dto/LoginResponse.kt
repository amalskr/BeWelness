package com.aecs.betterwellness.authservice.dto

data class LoginResponse(val code: Int, val message: String, val accessToken: String?)
