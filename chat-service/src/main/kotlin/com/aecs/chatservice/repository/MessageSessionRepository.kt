package com.aecs.chatservice.repository

import com.aecs.chatservice.model.MessageSession
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.*


interface MessageSessionRepository : JpaRepository<MessageSession, Int> {
    fun findByCustomerIdAndCounselorId(userEmail: Int, counselorEmail: Int): Optional<MessageSession>

    // Get all customer IDs for a given counselor ID
    @Query("SELECT ms.customerId FROM MessageSession ms WHERE ms.counselorId = :counselorId")
    fun findAllCustomerIdsByCounselorId(@Param("counselorId") counselorId: Int): List<Int>
}