package com.aecs.userservice.controller

import com.aecs.userservice.dto.CounselorResponse
import com.aecs.userservice.dto.ProfileResponse
import com.aecs.userservice.dto.UpdateRequest
import com.aecs.userservice.dto.UserResponse
import com.aecs.userservice.model.User
import com.aecs.userservice.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/user")
class UserController(private val userService: UserService) {

    @GetMapping("/{userId}")
    fun getUserById(@PathVariable userId: Int): ResponseEntity<User> {
        val user = userService.getUserById(userId)
        return user?.let {
            ResponseEntity.ok(user)
        } ?: ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
    }

    @PutMapping("/update")
    fun userUpdate(@RequestBody req: UpdateRequest): ResponseEntity<UserResponse> {
        val updateRes = userService.update(req)
        return ResponseEntity.status(updateRes.code).body(updateRes)
    }

    @DeleteMapping("/delete")
    fun userDelete(@RequestBody userId: Int): ResponseEntity<UserResponse> {
        val delUser = userService.delete(userId)
        return ResponseEntity.status(delUser.code).body(delUser)
    }

    @GetMapping("/counselors")
    fun getAllCounselors(): List<CounselorResponse> {
        return userService.getAllCounselors()
    }

    @GetMapping("/profiles")
    fun getUsersProfileById(
        @RequestParam customerId: Int,
        @RequestParam counselorId: Int
    ): ResponseEntity<ProfileResponse> {
        val profiles = userService.getUsersProfile(customerId, counselorId)
        return ResponseEntity.ok(profiles)
    }
}