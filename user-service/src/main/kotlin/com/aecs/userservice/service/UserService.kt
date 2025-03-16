package com.aecs.userservice.service

import com.aecs.userservice.model.CounselingType
import com.aecs.userservice.model.Role
import com.aecs.userservice.dto.CounselorResponse
import com.aecs.userservice.dto.UpdateRequest
import com.aecs.userservice.dto.UserResponse
import com.aecs.userservice.repository.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepo: UserRepository) {

    // get all COUNSELLOR list
    fun getAllCounselors(): List<CounselorResponse> {
        return userRepo.findByRole(Role.COUNSELLOR)
            .map { user ->
                CounselorResponse(
                    firstName = user.firstName,
                    lastName = user.lastName,
                    email = user.email,
                    counselingType = user.counselingType
                )
            }
    }

    // User Update
    fun update(req: UpdateRequest): UserResponse {
        val user = userRepo.findById(req.id).orElse(null)
        user?.let {
            //apply new values
            user.apply {
                firstName = req.firstName
                lastName = req.lastName

                // Prevent CUSTOMER role from changing `counselingType`
                counselingType = if (role == Role.CUSTOMER) {
                    CounselingType.NA // Always set to NA
                } else {
                    req.counselingType
                }
            }

            //save new values
            userRepo.save(user)
            return UserResponse(HttpStatus.OK.value(), "User updated successfully")

        } ?: return UserResponse(code = HttpStatus.UNAUTHORIZED.value(), message = "Invalid credentials")
    }

    // Delete User
    fun delete(id: Int): UserResponse {
        val user = userRepo.findById(id).orElse(null)
        user?.let {
            userRepo.delete(user)
            return UserResponse(HttpStatus.OK.value(), "User deleted successfully")
        } ?: return UserResponse(code = HttpStatus.UNAUTHORIZED.value(), message = "Invalid credentials")
    }
}