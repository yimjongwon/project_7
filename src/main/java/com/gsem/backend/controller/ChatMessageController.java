package com.gsem.backend.controller;

import com.gsem.backend.entity.ChatMessage;
import com.gsem.backend.service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatMessageController {

    @Autowired
    private ChatMessageService chatMessageService;

    @GetMapping("/history/{userId}")
    public List<ChatMessage> getChatHistory(@PathVariable String userId) {
        return chatMessageService.getChatHistory(userId);
    }

    @GetMapping("/users")
    public List<String> getAllUsersWhoChattedWithAdmin() {
        return chatMessageService.getAllUserIdsWhoChattedWithAdmin();
    }
}
