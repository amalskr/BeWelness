package com.aecs.userservice.model

import com.aecs.userservice.model.CounselingType
import com.aecs.userservice.model.Role
import jakarta.persistence.*

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    @Column(nullable = false)
    var firstName: String,
    @Column(unique = true, nullable = false)
    var lastName: String,
    @Column(unique = true, nullable = false)
    var email: String,
    @Column(nullable = false)
    var password: String,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var role: Role,
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var counselingType: CounselingType = CounselingType.NA
)

