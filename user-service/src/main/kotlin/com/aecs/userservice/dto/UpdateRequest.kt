package com.aecs.userservice.dto

import com.aecs.userservice.model.CounselingType

data class UpdateRequest(val id : Int, var firstName: String, var lastName: String, var counselingType: CounselingType)
