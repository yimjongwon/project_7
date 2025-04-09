let socket;

function connect(userId, role) { //연결
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    socket = new WebSocket(`${protocol}${location.host}/ws/chat?userId=${userId}&role=${role}`);

    socket.onopen = () => console.log("✅ WebSocket 연결됨");

    socket.onmessage = (event) => {
        const chatWindow = document.getElementById('chat-window');
            const div = document.createElement('div');
            div.classList.add('chat-message');

            // 메시지가 [관리자]로 시작하면 오른쪽에 정렬
            if (event.data.startsWith("[관리자]")) {
                div.classList.add('right');
            } else {
                div.classList.add('left');
            }

            div.textContent = event.data;
            chatWindow.appendChild(div);
            chatWindow.scrollTop = chatWindow.scrollHeight; // 자동 스크롤
    };

    socket.onclose = () => console.log("❌ WebSocket 연결 종료됨");
    socket.onerror = (error) => console.error("⚠️ WebSocket 오류:", error);
}

function setupChat() { //
    const userId = prompt("아이디 입력 (예: student1 또는 admin)");
    const role = userId.startsWith("admin") ? "admin" : "student";
    const inputBox = document.getElementById('message-input');
    inputBox.placeholder = (role === 'admin') ? "관리자 메시지 입력" : "메시지 입력";

    connect(userId, role);

    document.getElementById('send-button').addEventListener('click', function () {
        const input = document.getElementById('message-input');
        const msg = input.value.trim();
        if (!msg) return;

        // 🔁 관리자도 receiver 설정 없이 전체에게 메시지 전송
        const payload = {
            sender: userId,
            receiver: "",  // 이제 receiver는 의미 없음
            content: msg
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
}

document.addEventListener("DOMContentLoaded", setupChat);
