package com.aecs.chatservice.controller

import com.aecs.chatservice.dto.SendMessage
import com.aecs.chatservice.model.MessageContent
import com.aecs.chatservice.service.MessageSessionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/message")
class MessageController(private val messageService: MessageSessionService) {

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
    fun sendMessage(@RequestBody request: SendMessage): ResponseEntity<String> {
        messageService.sendMessage(request)
        return ResponseEntity.ok("Message sent successfully")
    }

    @GetMapping("/list")
    fun getMessageList(
        @RequestParam customerId: Int,
        @RequestParam counselorId: Int
    ): ResponseEntity<List<MessageContent>> {
        return ResponseEntity.ok(messageService.getMessages(customerId, counselorId))
    }
}