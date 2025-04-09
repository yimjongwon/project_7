package Not_Found.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ChatController {//채팅 컨트롤러
    @GetMapping("/chat")
    public String chatPage() {
        return "chat"; // templates/chat.html을 반환
    }
}
