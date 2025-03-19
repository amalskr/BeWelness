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

    fun sendMessage(request: SendMessage): HttpStatus {
        val session = getOrCreateMessageSession(request.customerId, request.counselorId)

        var msg = request.content
        if (!session.second && msg.contains("I need a counseling from you. Can we discuss?")) {
            //is new session then edit content
            msg = "Hi"
        }

        val messageContent = MessageContent(
            messageSession = session.first,
            content = msg,
            type = request.type
        )

        messageContentRepository.save(messageContent)
        return HttpStatus.OK
    }

    fun getOrCreateMessageSession(cusId: Int, conId: Int): Pair<MessageSession, Boolean> {
        // Check if a session already exists in either direction
        val existingSession = messageSessionRepository.findByCustomerIdAndCounselorId(cusId, conId)

        return if (existingSession.isPresent) {
            Pair(existingSession.get(), false)
        } else {
            val newSession = messageSessionRepository.save(MessageSession(customerId = cusId, counselorId = conId))
            Pair(newSession, true)
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