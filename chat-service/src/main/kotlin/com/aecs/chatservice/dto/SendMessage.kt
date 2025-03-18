package com.aecs.chatservice.dto

import com.aecs.chatservice.model.MessageType

data class SendMessage(
    val customerId: Int,
    val counselorId: Int,
    val content: String,
    val type: MessageType, // SENT = userEmail REPLY = counselorEmail
)
