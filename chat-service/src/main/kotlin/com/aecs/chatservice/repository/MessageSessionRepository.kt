package com.aecs.chatservice.repository

import com.aecs.chatservice.model.MessageSession
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface MessageSessionRepository : JpaRepository<MessageSession, Int> {
    fun findByCustomerIdAndCounselorId(userEmail: Int, counselorEmail: Int): Optional<MessageSession>
}