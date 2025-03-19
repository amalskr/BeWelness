package com.aecs.chatservice.controller

import com.aecs.chatservice.dto.MessageResponse
import com.aecs.chatservice.dto.MessagedCustomer
import com.aecs.chatservice.dto.SendMessage
import com.aecs.chatservice.model.MessageContent
import com.aecs.chatservice.service.MessageSessionService
import com.aecs.chatservice.service.UserServiceClient
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/message")
class MessageController(private val messageService: MessageSessionService) {

    @Autowired
    private val userServiceClient: UserServiceClient? = null

    /*
    * 1. first user create a message with selecting a counselor
    *  db - [msg_table] userEmail & counselorEmail if having send existing id [msgId]
    *
    * 2. using msgId they can chat
    * db - [msg_content_table] id,msgId,content,type(sent or replay) counselorEmail = replay and counselorEmail = sent
    *
    * 3. when load all message,
    *  1. get msgId from msg_table where userEmail & counselorEmail
    *  2. get all content from msg_content_table where msgId
    *
    * */

    @PostMapping("/send")
    fun sendMessage(@RequestBody request: SendMessage): MessageResponse {
        val status = messageService.sendMessage(request)
        return if (status.value() == HttpStatus.OK.value()) {
            MessageResponse(HttpStatus.OK.value(), "Message sent successfully")
        } else {
            MessageResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Message Can't send")
        }
    }

    @GetMapping("/list")
    fun getMessageList(
        @RequestParam customerId: Int,
        @RequestParam counselorId: Int
    ): ResponseEntity<List<MessageContent>> {
        return ResponseEntity.ok(messageService.getMessages(customerId, counselorId))
    }

    @GetMapping("/customers")
    fun getMessagedCustomers(
        @RequestParam counselorId: Int,
        @RequestHeader(HttpHeaders.AUTHORIZATION) token: String
    ): ResponseEntity<List<MessagedCustomer>> {
        val messagedCustomersList = mutableListOf<MessagedCustomer>()
        val jwtToken = getToken(token)
        messageService.getMessagedCustomers(counselorId).forEach {
            val profile = userServiceClient?.getProfile(it, jwtToken)
            profile?.let {
                val fullName = it.firstName + " " + it.lastName
                val msgCus = MessagedCustomer(profile.id, fullName)
                messagedCustomersList.add(msgCus)
            }
        }

        return ResponseEntity.ok(messagedCustomersList)
    }

    private fun getToken(token: String): String {
        return token.removePrefix("Bearer ")
    }
}