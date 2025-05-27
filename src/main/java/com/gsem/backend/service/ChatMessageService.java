package com.gsem.backend.service;

import com.gsem.backend.entity.ChatMessage;
import com.gsem.backend.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public void save(ChatMessage message) {
        chatMessageRepository.save(message);
    }

    public List<ChatMessage> getChatHistory(String userId) {
        return chatMessageRepository.findMessagesWithAdmin(userId);
    }

    public List<String> getAllUserIdsWhoChattedWithAdmin() {
        return chatMessageRepository.findAllUserIdsWhoChattedWithAdmin();
    }
}
