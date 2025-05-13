package com.gsem.backend.controller;

import com.gsem.backend.dto.ChatMsgDTO;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // 일반 유저가 관리자에게 메시지 전송
    @MessageMapping("/user-to-admin")
    public void sendToAdmin(@Payload ChatMsgDTO message) {
        messagingTemplate.convertAndSend("/topic/messages/admin", message);
    }

    // 관리자가 특정 유저에게 메시지 전송
    @MessageMapping("/admin-to-user")
    public void sendToUser(@Payload ChatMsgDTO message) {
        messagingTemplate.convertAndSendToUser(message.getReceiverId(), "/queue/messages", message);
    }
}
