package com.aecs.chatservice.model

import jakarta.persistence.*

@Entity
@Table(name = "message_session")
data class MessageSession(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @Column(unique = true, nullable = false)
    val userEmail: String, // User who initiates chat

    @Column(unique = true, nullable = false)
    val counselorEmail: String // Assigned counselor
)
