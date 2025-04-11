package Not_Found.handler;

import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.*;

@Component
public class ChatHandler extends TextWebSocketHandler {

    // userId → WebSocketSession
    private final Map<String, WebSocketSession> userSessions = new HashMap<>();

    // userId → role 저장
    private final Map<String, String> userRoles = new HashMap<>();

    @Override //연결될때 콘솔 출력
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = getParam(session, "userId");
        String role = getParam(session, "role");

        userSessions.put(userId, session);
        userRoles.put(userId, role);

        if ("admin".equals(role)) {
            System.out.println("관리자 연결됨: " + userId + " (admin)");
        } else {
            System.out.println("학생 연결됨: " + userId + " (student)");
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        JSONObject json = new JSONObject(payload);

        String sender = json.getString("sender");
        String receiver = json.getString("receiver");
        String content = json.getString("content");

        String senderRole = userRoles.getOrDefault(sender, "unknown");
        String formattedMessage;

        if ("student".equals(senderRole)) {
            formattedMessage = "[" + sender + " 학생] " + content;

            // 관리자에게 전송
            for (Map.Entry<String, String> entry : userRoles.entrySet()) {
                if ("admin".equals(entry.getValue())) {
                    WebSocketSession adminSession = userSessions.get(entry.getKey());
                    if (adminSession != null && adminSession.isOpen()) {
                        adminSession.sendMessage(new TextMessage(formattedMessage));
                    }
                }
            }

        } else if ("admin".equals(senderRole)) {
            formattedMessage = "[관리자] " + content;

            // 특정 학생에게 전송
            WebSocketSession studentSession = userSessions.get(receiver);
            if (studentSession != null && studentSession.isOpen()) {
                studentSession.sendMessage(new TextMessage(formattedMessage));
            }

        } else {
            formattedMessage = "[알 수 없음] " + content;
        }

        // 보낸 사람에게도 메시지 표시
        if (session.isOpen()) {
            session.sendMessage(new TextMessage(formattedMessage));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String disconnectedUser = null;

        // 세션이랑 매핑된 userId 찾아서 삭제
        for (Map.Entry<String, WebSocketSession> entry : userSessions.entrySet()) {
            if (entry.getValue().equals(session)) {
                disconnectedUser = entry.getKey();
                break;
            }
        }

        if (disconnectedUser != null) {
            userSessions.remove(disconnectedUser);
            userRoles.remove(disconnectedUser);
            System.out.println("❌ 연결 해제됨: " + disconnectedUser);
        }
    }

    private String getParam(WebSocketSession session, String key) {
        try {
            return session.getUri()
                    .getQuery()
                    .lines()
                    .flatMap(q -> Arrays.stream(q.split("&")))
                    .map(pair -> pair.split("="))
                    .filter(parts -> parts.length == 2 && parts[0].equals(key))
                    .map(parts -> parts[1])
                    .findFirst()
                    .orElse("unknown");
        } catch (Exception e) {
            return "unknown";
        }
    }
}
