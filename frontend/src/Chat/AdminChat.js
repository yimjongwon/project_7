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
    const chatBoxRef = useRef(null);

    useEffect(() => {
        if (clientRef.current) return;

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
        });

        return () => {
            if (clientRef.current && clientRef.current.connected) {
                clientRef.current.disconnect(() => {
                    console.log('[ADMIN] WebSocket Disconnected');
                });
                clientRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages, selectedUser]);

    const formatTimestamp = (date) => {
        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const sendMessage = () => {
        if (!clientRef.current || !clientRef.current.connected) return;
        if (input.trim() === '' || selectedUser === '') return;

        const message = {
            senderId: 'admin',
            receiverId: selectedUser,
            content: input,
            timestamp: new Date().toISOString()
        };

        clientRef.current.send('/app/admin-to-user', {}, JSON.stringify(message));
        setMessages(prev => [...prev, message]);
        setInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
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
                    <div className="chat-history" ref={chatBoxRef}>
                        {messages
                            .filter(msg => msg.senderId === selectedUser || msg.receiverId === selectedUser)
                            .map((msg, idx) => (
                                <div key={idx}>
                                    <div className="timestamp-admin">{formatTimestamp(new Date(msg.timestamp || Date.now()))}</div>
                                    <div className={msg.senderId === 'admin' ? 'admin-message' : 'user-message'}>
                                        <b>{msg.senderId}:</b> {msg.content}
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="chat-input">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
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
