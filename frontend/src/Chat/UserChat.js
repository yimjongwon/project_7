import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '../css/UserChat.css';

function UserChat({ userNickname }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [client, setClient] = useState(null);

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

    const sendMessage = () => {
        if (client && input.trim()) {
            const message = {
                senderId: userNickname,
                receiverId: 'admin',
                content: input
            };
            client.publish({
                destination: '/app/user-to-admin',
                body: JSON.stringify(message)
            });
            setMessages(prev => [...prev, message]);
            setInput('');
        }
    };

    return (
        <div className="chat-container">
            <h2>실시간 문의내역</h2>
            <div className="chat-box">
                {messages.map((msg, idx) => (
                    <div key={idx} className={msg.senderId === userNickname ? "my-message" : "admin-message"}>
                        <span>{msg.content}</span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                />
                <button onClick={sendMessage}>전송</button>
            </div>
        </div>
    );
}

export default UserChat;
