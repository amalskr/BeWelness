package com.aecs.userservice.config

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.*
import javax.crypto.spec.SecretKeySpec

@Service
class TokenService(
    @Value("\${jwt.secret}") private val secret: String = ""
) {
    private val signingKey: SecretKeySpec
        get() {
            val keyBytes: ByteArray = Base64.getDecoder().decode(secret)
            return SecretKeySpec(keyBytes, 0, keyBytes.size, "HmacSHA256")
        }

    fun generateToken(subject: String, expMin: Long, additionalClaims: Map<String, Any> = emptyMap()): String {
        val sriLankaZone = ZoneId.of("Asia/Colombo")

        val issuedAt = ZonedDateTime.now(sriLankaZone)
        val expiration = issuedAt.plusMinutes(expMin)

        return Jwts.builder()
            .setClaims(additionalClaims)
            .setSubject(subject)
            .setIssuedAt(Date.from(issuedAt.toInstant()))
            .setExpiration(Date.from(expiration.toInstant()))
            .signWith(signingKey)
            .compact()
    }

    fun extractUsername(token: String): String {
        return extractAllClaims(token).subject
    }

    private fun extractAllClaims(token: String): Claims {
        return Jwts.parserBuilder()
            .setSigningKey(signingKey)
            .setAllowedClockSkewSeconds(60) // Allow 30s clock skew
            .build()
            .parseClaimsJws(token)
            .body
    }
}