package com.aecs.chatservice.service

import com.aecs.chatservice.dto.SendMessage
import com.aecs.chatservice.model.MessageContent
import com.aecs.chatservice.model.MessageSession
import com.aecs.chatservice.repository.MessageContentRepository
import com.aecs.chatservice.repository.MessageSessionRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import java.util.*

@Service
class MessageSessionService(
    private val messageSessionRepository: MessageSessionRepository,
    private val messageContentRepository: MessageContentRepository
) {

    fun sendMessage(request: SendMessage): HttpStatus {
        val session = getOrCreateMessageSession(request.customerId, request.counselorId)

        val messageContent = MessageContent(
            messageSession = session,
            content = request.content,
            type = request.type
        )

        messageContentRepository.save(messageContent)
        return HttpStatus.OK
    }

    fun getOrCreateMessageSession(cusId: Int, conId: Int): MessageSession {
        // Check if a session already exists in either direction
        return messageSessionRepository.findByCustomerIdAndCounselorId(cusId, conId)
            .orElseGet {
                // Create new session if none exists
                val newSession = MessageSession(customerId = cusId, counselorId = conId)
                messageSessionRepository.save(newSession)
            }
    }

    fun getMessages(cusId: Int, conId: Int): List<MessageContent> {
        val session = messageSessionRepository.findByCustomerIdAndCounselorId(cusId, conId)
            .orElseThrow { RuntimeException("No messages found") }

        return messageContentRepository.findByMessageSession(session)
    }

    fun getMessagedCustomers(conId: Int): List<Int> {
        val sessionList = messageSessionRepository.findAllCustomerIdsByCounselorId(conId)
        return sessionList
    }
}