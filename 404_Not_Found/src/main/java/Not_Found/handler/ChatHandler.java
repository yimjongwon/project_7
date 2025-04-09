package Not_Found.handler;

import Not_Found.util.MyUtil;
import org.json.JSONObject;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

public class ChatHandler extends TextWebSocketHandler {//채팅 핸들러

    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = getParam(session, "userId");
        String role = getParam(session, "role");
        session.getAttributes().put("userId", userId);
        session.getAttributes().put("role", role);
        sessions.put(userId, session);
        System.out.println("Connected: " + MyUtil.BLUE + MyUtil.BOLD + userId + " (" + role + ")" + MyUtil.END) ;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        JSONObject json = new JSONObject(message.getPayload());
        String sender = json.getString("sender");
        String content = json.getString("content");

        String senderRole = (String) session.getAttributes().get("role");

        // 본인이 보낸 메시지도 자기 화면에 보이게 추가
        if ("student".equals(senderRole)) {
            // 학생 → 모든 사용자 (관리자 + 모든 학생)
            for (WebSocketSession s : sessions.values()) {
                if (s.isOpen()) {
                    s.sendMessage(new TextMessage("[학생 " + sender + "] " + content));
                }
            }
        } else if ("admin".equals(senderRole)) {

            // 모든 학생 + 관리자 본인에게 메시지 전송
            for (WebSocketSession s : sessions.values()) {
                if (s.isOpen()) {
                    String role = (String) s.getAttributes().get("role");

                    if ("student".equals(role)) {
                        s.sendMessage(new TextMessage("[관리자] " + content));
                    }

                    // 관리자 본인에게도 메시지 보여주기
                    if (s == session) {
                        s.sendMessage(new TextMessage("[관리자] " + content));
                    }
                }
            }

        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String userId = (String) session.getAttributes().get("userId");
        sessions.remove(userId);
        System.out.println("Disconnected: " + userId);
    }

    private String getParam(WebSocketSession session, String name) {
        String query = session.getUri().getQuery();
        for (String param : query.split("&")) {
            String[] parts = param.split("=");
            if (parts[0].equals(name)) return parts[1];
        }
        return null;
    }
}
