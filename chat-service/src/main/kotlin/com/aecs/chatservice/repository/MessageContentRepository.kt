package com.aecs.chatservice.repository

import com.aecs.chatservice.model.MessageContent
import com.aecs.chatservice.model.MessageSession
import org.springframework.data.jpa.repository.JpaRepository

interface MessageContentRepository : JpaRepository<MessageContent, Int> {
    fun findByMessageSession(messageSession: MessageSession): List<MessageContent>
}