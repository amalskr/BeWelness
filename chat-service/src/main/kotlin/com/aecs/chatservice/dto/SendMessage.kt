package com.aecs.chatservice.dto

import com.aecs.chatservice.model.MessageType

data class SendMessage(
    val userEmail: String,
    val counselorEmail: String,
    val content: String,
    val type: MessageType, // SENT = userEmail REPLY = counselorEmail
)
