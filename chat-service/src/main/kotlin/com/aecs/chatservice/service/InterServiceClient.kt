package com.aecs.chatservice.service


import com.aecs.chatservice.model.Profile
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

@Service
class UserServiceClient {
    @Autowired
    private val webClient: WebClient? = null

    fun getProfile(userId: Int, token: String): Profile? {
        return webClient?.get()?.uri("/user/{userId}", userId)
            ?.headers { it.setBearerAuth(token) }
            ?.retrieve()
            ?.bodyToMono(Profile::class.java)
            ?.block()
    }
}