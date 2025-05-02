let socket;
let imagePreview = null;  // 이미지 미리보기 상태 변수

// 채팅 아이콘 클릭 시 채팅박스 토글
document.getElementById('chat-toggle').addEventListener('click', () => {
    const box = document.getElementById('chat-box');
    box.classList.toggle('show');
});

// WebSocket 연결 설정 및 메시지 수신 처리
function connect(userId, role) {
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    socket = new WebSocket(`${protocol}${location.host}/ws/chat?userId=${userId}&role=${role}`);

    socket.onopen = () => console.log("✅ WebSocket 연결됨");

    socket.onmessage = (event) => {
    console.log("👈 onmessage 수신:", event.data);  // ← 여기
        const chatWindow = document.getElementById('chat-window');
        const messageDiv = document.createElement('div');
        const message = event.data;

        // 메시지 색상 구분 및 이미지 처리
        if (message.startsWith("[관리자]")) {
            messageDiv.className = "message right";
        } else {
            messageDiv.className = "message left";
        }

        // 이미지 처리
        if (message.includes("data:image")) {
            const img = document.createElement("img");
            img.src = message.replace(/^\[.*?\]\s*/, '');  // 메시지에서 앞부분 제거 (보통 이름 같은)
            img.style.maxWidth = "100%";
            img.style.borderRadius = "8px";
            messageDiv.appendChild(img);
        } else {
            messageDiv.textContent = message;
        }

        // 나중에 입력한 메시지가 맨 아래로 오게 하기
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;  // 메시지 영역을 맨 아래로 스크롤
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
        sendMessage();
    });

    // 엔터 키를 누르면 메시지 전송 처리
    document.getElementById('message-input').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();  // 기본 엔터 키 동작 방지 (줄 바꿈 방지)
            sendMessage();  // 메시지 전송 함수 호출
        }
    });

    // 메시지 전송 함수
    function sendMessage() {
    console.log("👉 sendMessage 호출");
        const input = document.getElementById('message-input');
        const msg = input.value.trim();
        if (!msg && !imagePreview) return; // 메시지와 이미지가 없으면 전송하지 않음

        // 메시지가 없고 이미지 미리보기만 있으면 이미지 전송
        const messageContent = msg || imagePreview;

        if (role === 'admin') {
            selectedReceiver = prompt("메시지를 보낼 학생 ID를 입력하세요", selectedReceiver);
        } else {
                  // 학생은 관리자에게만 전송
                  selectedReceiver = "admin";  // 관리자가 학생에게만 보낸다고 가정
        }

        socket.send(JSON.stringify({
            sender: userId,
            receiver: selectedReceiver,
            content: messageContent
        }));

        input.value = '';
        document.getElementById('previewArea').innerHTML = '';  // 미리보기 초기화
    }

    // 채팅창에 드래그 앤 드롭 이미지 미리보기 처리
    const chatWindow = document.getElementById('chat-window');

    chatWindow.addEventListener('dragover', function (e) {
        e.preventDefault();
        chatWindow.classList.add('dragover');
    });

    chatWindow.addEventListener('dragleave', function () {
        chatWindow.classList.remove('dragover');
    });

chatWindow.addEventListener('drop', function (e) {
  e.preventDefault();
  chatWindow.classList.remove('dragover');

  const file = e.dataTransfer.files[0];
  // 드래그 앤 드롭 시 파일 크기 제한
  const maxSize = 800 * 1024; // 최대 500KB

  if (file && file.type.startsWith('image/')) {
     if (file.size > maxSize) {
         alert("이미지 파일 크기는 800KB를 초과할 수 없습니다.");
         return;  // 파일 크기가 초과하면 처리 중지
     }

    const reader = new FileReader();
    reader.onload = function (event) {
      // 1) 말풍선 컨테이너 생성
      const messageDiv = document.createElement('div');
      // 역할에 따라 왼쪽/오른쪽 배경 적용
      if (role === 'admin') {
        messageDiv.className = 'message right';
      } else {
        messageDiv.className = 'message left';
      }

      // 2) 이미지 요소 생성
      const img = document.createElement('img');
      img.src = event.target.result;

      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      // (필요하다면 margin 등 추가)

      // 3) 말풍선 안에 붙이고, 채팅창에 append
      messageDiv.appendChild(img);
      chatWindow.appendChild(messageDiv);
      chatWindow.scrollTop = chatWindow.scrollHeight;

      // WebSocket으로 이미지 전송
      sendMessage(event.target.result);  // Base64로 변환된 이미지 데이터를 전송
    };
    reader.readAsDataURL(file);
  }
});


    // 이미지 파일 선택 시 미리보기 처리
    document.getElementById('image-upload-input').addEventListener('change', function (e) {
        const file = e.target.files[0];
        // 이미지 업로드 시 파일 크기 제한
        const maxSize = 800 * 1024; // 최대 500KB

        if (file && file.type.startsWith('image/')) {
            if (file.size > maxSize) {
                alert("이미지 파일 크기는 800KB를 초과할 수 없습니다.");
                return;  // 파일 크기가 초과하면 처리 중지
            }


            const reader = new FileReader();
            reader.onload = function (event) {
                const img = document.createElement('img');
                img.src = event.target.result;

                img.style.maxWidth = "150px";
                img.style.borderRadius = "8px";
                img.style.marginBottom = "10px";
                document.getElementById('previewArea').innerHTML = '';  // 기존 미리보기 지우기
                document.getElementById('previewArea').appendChild(img);
                imagePreview = event.target.result;  // 이미지 미리보기 저장


                // 메시지 전송
                sendMessage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
});
