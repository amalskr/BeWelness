package com.aecs.userservice.service


import com.aecs.betterwellness.authservice.dto.AuthResponse
import com.aecs.betterwellness.authservice.dto.LoginResponse
import com.aecs.userservice.model.User
import com.aecs.userservice.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service

@Service
class AuthService @Autowired constructor(private val userRepo: UserRepository) {
    //User Register
    fun register(user: User): AuthResponse {
        if (userRepo.findByEmail(user.email).isPresent) {
            return AuthResponse(code = HttpStatus.BAD_REQUEST.value(), message = "Email is already registered")
        }
        user.password = user.password
        userRepo.save(user)
        return AuthResponse(code = HttpStatus.OK.value(), message = "User registered successfully")
    }

    // User Login
    fun login(email: String, password: String): LoginResponse {
        val existingUser = userRepo.findByEmail(email)

        return if (!existingUser.isPresent) {
            LoginResponse(code = HttpStatus.UNAUTHORIZED.value(), message = "Invalid credentials", null)
        } else {
            val isPwMatch = password == existingUser.get().password
            if (existingUser.isPresent && isPwMatch) {
                val fullName = existingUser.get().firstName + " " + existingUser.get().lastName
                LoginResponse(code = HttpStatus.OK.value(), message = "Successfully logged in! $fullName", "12345")
            } else {
                LoginResponse(code = HttpStatus.UNAUTHORIZED.value(), message = "Invalid credentials", null)
            }
        }
    }
}