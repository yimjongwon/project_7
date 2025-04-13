let socket;

// 채팅 아이콘 클릭 시 채팅박스 토글
document.getElementById('chat-toggle').addEventListener('click', () => {
    const box = document.getElementById('chat-box');
    box.classList.toggle('show');
});

// 메시지 입력 시 Enter키로 전송 처리
document.getElementById('message-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('send-button').click();
    }
});

// WebSocket 연결 설정 및 메시지 수신 처리
function connect(userId, role) {
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    socket = new WebSocket(`${protocol}${location.host}/ws/chat?userId=${userId}&role=${role}`);

    socket.onopen = () => console.log("✅ WebSocket 연결됨");

    socket.onmessage = (event) => {
        const chatWindow = document.getElementById('chat-window');
        const messageDiv = document.createElement('div');
        const message = event.data;

        // 메시지 색상 구분
        if (message.startsWith("[관리자]")) {
            messageDiv.className = "message right";
        } else {
            messageDiv.className = "message left";
        }

        messageDiv.textContent = message;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    socket.onclose = () => console.log("❌ WebSocket 연결 종료됨");
    socket.onerror = (error) => console.error("⚠️ WebSocket 오류:", error);
}

// DOMContentLoaded 후 사용자 아이디와 역할 설정
document.addEventListener('DOMContentLoaded', function () {
    const userId = prompt("아이디 입력 (예: student1 또는 admin)");
    const role = userId.startsWith("admin") ? "admin" : "student";
    let selectedReceiver = "admin";

    connect(userId, role);

    // 메시지 전송 버튼 클릭 시 메시지 전송 처리
    document.getElementById('send-button').addEventListener('click', function () {
        const input = document.getElementById('message-input');
        const msg = input.value.trim();
        if (!msg) return;

        if (role === 'admin') {
            selectedReceiver = prompt("메시지를 보낼 학생 ID를 입력하세요", selectedReceiver);
        }

        socket.send(JSON.stringify({
            sender: userId,
            receiver: selectedReceiver,
            content: msg
        }));

        input.value = '';
    });
});
