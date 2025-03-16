package com.aecs.chatservice.repository

import com.aecs.chatservice.model.MessageSession
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface MessageSessionRepository : JpaRepository<MessageSession, Int> {
    fun findByUserEmailAndCounselorEmail(userEmail: String, counselorEmail: String): Optional<MessageSession>
}