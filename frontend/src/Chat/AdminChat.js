import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import '../css/AdminChat.css';

const AdminChat = () => {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [input, setInput] = useState('');
    const [userList, setUserList] = useState([]);

    const clientRef = useRef(null);
    const connectedRef = useRef(false); // 중복 연결 방지용

    useEffect(() => {
        if (connectedRef.current) {
            console.log('[ADMIN] 이미 연결됨');
            return;
        }

        const socket = new SockJS('http://localhost:8080/ws');
        const client = over(socket);

        client.connect({}, () => {
            console.log('[ADMIN] WebSocket Connected');

            client.subscribe('/topic/messages/admin', (msg) => {
                const newMsg = JSON.parse(msg.body);
                console.log('[ADMIN] 수신된 메시지:', newMsg);

                setMessages(prev => [...prev, newMsg]);

                setUserList(prev => {
                    if (!prev.includes(newMsg.senderId)) {
                        return [...prev, newMsg.senderId];
                    }
                    return prev;
                });
            });

            clientRef.current = client;
            connectedRef.current = true;
        });

        return () => {
            if (clientRef.current && clientRef.current.connected) {
                clientRef.current.disconnect(() => {
                    console.log('[ADMIN] WebSocket Disconnected');
                });
                clientRef.current = null;
                connectedRef.current = false;
            }
        };
    }, []);

    const sendMessage = () => {
        if (!clientRef.current || !clientRef.current.connected) {
            console.warn("WebSocket 연결이 아직 완료되지 않았습니다.");
            return;
        }

        if (input.trim() === '' || selectedUser === '') return;

        const message = {
            senderId: 'admin',
            receiverId: selectedUser,
            content: input
        };

        clientRef.current.send('/app/admin-to-user', {}, JSON.stringify(message));
        setMessages(prev => [...prev, message]);
        setInput('');
    };

    return (
        <div className="admin-chat-container">
            <h2>실시간 문의 관리</h2>
            <div className="admin-chat-main">
                <div className="user-list">
                    <h3>유저 목록</h3>
                    {userList.map(user => (
                        <div
                            key={user}
                            className={`user-item ${selectedUser === user ? 'selected' : ''}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            {user}
                        </div>
                    ))}
                </div>
                <div className="admin-chat-box">
                    <div className="chat-history">
                        {messages
                            .filter(msg => msg.senderId === selectedUser || msg.receiverId === selectedUser)
                            .map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={msg.senderId === 'admin' ? 'admin-message' : 'user-message'}
                                >
                                    <b>{msg.senderId}:</b> {msg.content}
                                </div>
                            ))}
                    </div>
                    <div className="chat-input">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="메시지 입력..."
                        />
                        <button onClick={sendMessage}>전송</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminChat;
