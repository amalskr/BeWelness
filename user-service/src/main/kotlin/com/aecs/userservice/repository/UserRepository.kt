package com.aecs.userservice.repository

import com.aecs.userservice.model.Role
import com.aecs.userservice.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, Int> {
    fun findByEmail(email: String): Optional<User>
    fun findByRole(role: Role): List<User> //Fetch all counselors
}