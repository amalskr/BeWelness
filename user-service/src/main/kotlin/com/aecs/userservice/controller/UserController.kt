package com.aecs.userservice.controller

import com.aecs.userservice.dto.CounselorResponse
import com.aecs.userservice.dto.UpdateRequest
import com.aecs.userservice.dto.UserResponse
import com.aecs.userservice.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/user")
class UserController(private val userService: UserService) {

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
}