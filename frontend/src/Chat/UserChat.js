import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '../css/UserChat.css';

function UserChat({ userNickname }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [client, setClient] = useState(null);
    const chatBoxRef = useRef(null);

    useEffect(() => {
        const socket = new SockJS(`http://localhost:8080/ws?userId=${userNickname}`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                stompClient.subscribe(`/user/queue/messages`, (msg) => {
                    const received = JSON.parse(msg.body);
                    setMessages(prev => [...prev, received]);
                });
            }
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, []);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp || Date.now());
        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const sendMessage = () => {
        if (client && input.trim()) {
            const message = {
                senderId: userNickname,
                receiverId: 'admin',
                content: input,
                timestamp: Date.now()
            };
            client.publish({
                destination: '/app/user-to-admin',
                body: JSON.stringify(message)
            });
            setMessages(prev => [...prev, message]);
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-container">
            <h2>실시간 문의내역</h2>
            <div className="chat-box" ref={chatBoxRef}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={msg.senderId === userNickname ? "my-message" : "admin-message"}>
                        <div className="timestamp">{formatTimestamp(msg.timestamp)}</div>
                        <div className="message-bubble">
                            <span>{msg.content}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요..."
                />
                <button onClick={sendMessage}>전송</button>
            </div>
        </div>
    );
}

export default UserChat;
