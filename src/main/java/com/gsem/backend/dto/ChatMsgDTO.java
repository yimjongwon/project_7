package com.gsem.backend.dto;

import lombok.*;

@Getter
@Setter
public class ChatMsgDTO {
    private String senderId;
    private String receiverId;
    private String content;
}

