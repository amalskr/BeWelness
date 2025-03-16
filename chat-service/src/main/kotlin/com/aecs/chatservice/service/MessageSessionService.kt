package com.aecs.chatservice.service

import com.aecs.chatservice.dto.SendMessage
import com.aecs.chatservice.model.MessageContent
import com.aecs.chatservice.model.MessageSession
import com.aecs.chatservice.repository.MessageContentRepository
import com.aecs.chatservice.repository.MessageSessionRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service

@Service
class MessageSessionService(
    private val messageSessionRepository: MessageSessionRepository,
    private val messageContentRepository: MessageContentRepository
) {

    fun getOrCreateMessageSession(userEmail: String, counselorEmail: String): MessageSession {
        // Check if a session already exists in either direction
        return messageSessionRepository.findByUserEmailAndCounselorEmail(userEmail, counselorEmail)
            .orElseGet {
                // Create new session if none exists
                val newSession = MessageSession(userEmail = userEmail, counselorEmail = counselorEmail)
                messageSessionRepository.save(newSession)
            }
    }

    fun sendMessage(request: SendMessage): HttpStatus {
        val session = getOrCreateMessageSession(request.userEmail, request.counselorEmail)

        val messageContent = MessageContent(
            messageSession = session,
            content = request.content,
            type = request.type
        )

        messageContentRepository.save(messageContent)
        return HttpStatus.OK
    }

    fun getMessages(userEmail: String, counselorEmail: String): List<MessageContent> {
        val session = messageSessionRepository.findByUserEmailAndCounselorEmail(userEmail, counselorEmail)
            .orElseThrow { RuntimeException("No messages found") }

        return messageContentRepository.findByMessageSession(session)
    }
}