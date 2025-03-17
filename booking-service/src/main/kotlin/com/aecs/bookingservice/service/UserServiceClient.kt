package com.aecs.bookingservice.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

@Service
class UserServiceClient {
    @Autowired
    private val webClient: WebClient? = null

    fun getUserEmail(userId: Long?): String? {
        return webClient?.get()?.uri("/user/{userId}", userId)
            ?.retrieve()
            ?.bodyToMono(UserResponse::class.java)
            ?.map { obj: UserResponse -> obj.email }
            ?.block()
    }
}

// DTO for User Response
internal class UserResponse {
    val email: String? = null
}