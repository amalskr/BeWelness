package com.aecs.userservice.controller

import com.aecs.userservice.dto.AuthRequest
import com.aecs.betterwellness.authservice.dto.AuthResponse
import com.aecs.betterwellness.authservice.dto.LoginResponse
import com.aecs.userservice.model.User
import com.aecs.userservice.service.AuthService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/auth")
class AuthController(@Autowired val authService: AuthService) {

    @PostMapping("/register")
    fun register(@RequestBody user: User): ResponseEntity<AuthResponse> {
        val response = authService.register(user)
        return ResponseEntity.status(response.code).body(response)
    }

    @PostMapping("/login")
    fun login(@RequestBody request: AuthRequest): ResponseEntity<LoginResponse> {
        val loginRes = authService.login(request.email, request.password)
        return ResponseEntity.status(loginRes.code).body(loginRes)
    }

    @GetMapping("/test")
    fun test(): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.OK).body("UserServers-OK")
    }
}