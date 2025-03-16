package com.aecs.chatservice.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "message_content")
data class MessageContent(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "msg_id", nullable = false)
    val messageSession: MessageSession,

    @Column(nullable = false)
    val content: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val type: MessageType,

    @Column(nullable = false)
    val sentAt: LocalDateTime = LocalDateTime.now()
)