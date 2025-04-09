let socket;

function connect(userId, role) {
    const protocol = window.location.protocol === 'https:' ? 'was://' : 'ws://';
    socket = new WebSocket(`${protocol}${location.host}/ws/chat?userId=${userId}&role=${role}`);

    socket.onopen = () => console.log("✅ WebSocket 연결됨");

    socket.onmessage = (event) => {
        const chatWindow = document.getElementById('chat-window');
        const messageDiv = document.createElement('div');
        messageDiv.textContent = event.data;
        chatWindow.appendChild(messageDiv);
    };

    socket.onclose = () => console.log("❌ WebSocket 연결 종료됨");
    socket.onerror = (error) => console.error("⚠️ WebSocket 오류:", error);
}

document.addEventListener('DOMContentLoaded', function () {
    const { userId, role } = window.chatInfo || {}; // chat.html에서 전달받은 전역 변수

    if (!userId || !role) {
        alert("사용자 정보를 확인할 수 없습니다.");
        return;
    }

    connect(userId, role);

    document.getElementById('send-button').addEventListener('click', function() {
        const input = document.getElementById('message-input');
        const msg = input.value.trim();
        if (!msg) return;

        let receiver = "admin";
        if (role === "admin") {
            receiver = prompt("메시지를 보낼 학생 ID를 입력하세요", "student1");
            if (!receiver) return;
        }

        const payload = {
            sender: userId,
            receiver: receiver,
            content:msg
        };

        socket.send(JSON.stringify(payload));
        input.value = '';
    });

    document.getElementById('message-input').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('send-button').click();
        }
    });
});