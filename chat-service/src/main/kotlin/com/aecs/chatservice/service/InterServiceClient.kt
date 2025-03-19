package com.aecs.chatservice.service


import com.aecs.chatservice.model.Profile
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

@Service
class UserServiceClient {
    @Autowired
    private val webClient: WebClient? = null

    fun getProfile(userId: Int): Profile? {
        return webClient?.get()?.uri("/user/{userId}", userId)
            ?.retrieve()
            ?.bodyToMono(Profile::class.java)
            ?.block()
    }
}