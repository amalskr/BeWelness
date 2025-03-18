package com.aecs.chatservice.model

import jakarta.persistence.*

@Entity
@Table(name = "message_session")
data class MessageSession(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @Column(nullable = false)
    val customerId: Int, // User who initiates chat

    @Column(nullable = false)
    val counselorId: Int // Assigned counselor
)
