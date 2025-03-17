package com.aecs.bookingservice.service

import com.aecs.bookingservice.model.Profile
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

@Service
class UserServiceClient {
    @Autowired
    private val webClient: WebClient? = null

    fun getUserEmail(userId: Int): String? {
        return webClient?.get()?.uri("/user/{userId}", userId)
            ?.retrieve()
            ?.bodyToMono(UserResponse::class.java)
            ?.map { obj: UserResponse -> obj.email }
            ?.block()
    }

    fun getUserProfiles(cusId: Int, conId: Int): ProfileResponse? {
        return webClient?.get()
            ?.uri { builder ->
                builder.path("/user/profiles")
                    .queryParam("customerId", cusId)
                    .queryParam("counselorId", conId)
                    .build()
            }
            ?.retrieve()
            ?.bodyToMono(ProfileResponse::class.java)
            ?.block()
    }
}

// DTO for User Response

internal class UserResponse {
    val email: String? = null
}

class ProfileResponse(val customer: Profile?, val counselor: Profile?)