package com.aecs.userservice.service


import com.aecs.betterwellness.authservice.dto.AuthResponse
import com.aecs.betterwellness.authservice.dto.LoginResponse
import com.aecs.betterwellness.authservice.dto.Profile
import com.aecs.userservice.config.TokenService
import com.aecs.userservice.model.User
import com.aecs.userservice.repository.RefreshTokenRepository
import com.aecs.userservice.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService @Autowired constructor(
    private val userRepo: UserRepository,
    private val authManager: AuthenticationManager,
    private val tokenService: TokenService,
    private val refreshTokenRepository: RefreshTokenRepository,
    private val userDetailsService: UserDetailsService,
    private val pwEncoder: PasswordEncoder,
) {
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
            LoginResponse(code = HttpStatus.UNAUTHORIZED.value(), message = "Invalid credentials", null, null)
        } else {
            val isPwMatch = password == existingUser.get().password
            if (existingUser.isPresent && isPwMatch) {
                val user = existingUser.get()
                val profile = Profile(
                    id = user.id,
                    firstName = user.firstName,
                    lastName = user.lastName,
                    email = user.email,
                    role = user.role,
                    counselingType = user.counselingType
                )
                val fullName = "${profile.firstName} ${profile.lastName}"
                LoginResponse(code = HttpStatus.OK.value(), message = "Welcome $fullName", "12345", profile)
            } else {
                LoginResponse(code = HttpStatus.UNAUTHORIZED.value(), message = "Invalid credentials", null, null)
            }
        }
    }
}