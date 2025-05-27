import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import axios from 'axios';
import '../css/AdminChat.css';

const AdminChat = () => {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [input, setInput] = useState('');
    const [userList, setUserList] = useState([]);
    const [unreadMap, setUnreadMap] = useState({});
    const clientRef = useRef(null);
    const chatBoxRef = useRef(null);

    useEffect(() => {
        if (clientRef.current) return;

        axios.get('http://localhost:8080/api/chat/users')
            .then(res => setUserList(res.data))
            .catch(err => console.error('유저 목록 불러오기 실패:', err));

        const socket = new SockJS('http://localhost:8080/ws');
        const client = over(socket);

        client.connect({}, () => {
            console.log('[ADMIN] WebSocket Connected');

            client.subscribe('/topic/messages/admin', (msg) => {
                const newMsg = JSON.parse(msg.body);
                console.log('[ADMIN] 수신된 메시지:', newMsg);

                setMessages(prev => {
                    const updated = [...prev, newMsg];
                    return updated.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                });

                setUserList(prev => {
                    const newList = [...new Set([...prev, newMsg.senderId])];
                    return newList.sort(); // 알파벳 정렬
                });

                if (newMsg.senderId !== selectedUser) {
                    setUnreadMap(prev => ({ ...prev, [newMsg.senderId]: true }));
                }
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
        chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
    }, [messages, selectedUser]);

    const handleUserClick = async (userId) => {
        setSelectedUser(userId);

        setUnreadMap(prev => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
        });

        try {
            const res = await axios.get(`http://localhost:8080/api/chat/history/${userId}`);
            const dbMessages = res.data;

            const wsMessages = messages.filter(
                msg =>
                    (msg.senderId === userId && msg.receiverId === 'admin') ||
                    (msg.senderId === 'admin' && msg.receiverId === userId)
            );

            const allMessages = [...dbMessages, ...wsMessages];
            const uniqueMessages = Array.from(new Set(allMessages.map(m => JSON.stringify(m)))).map(m => JSON.parse(m));
            setMessages(uniqueMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
        } catch (error) {
            console.error('이전 채팅 불러오기 실패:', error);
        }
    };

    const formatTimestamp = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const sendMessage = async () => {
        if (!clientRef.current?.connected || !input.trim() || !selectedUser) return;

        const message = {
            senderId: 'admin',
            receiverId: selectedUser,
            content: input,
            timestamp: new Date().toISOString()
        };

        try {
            await axios.post('http://localhost:8080/api/chat/save', message);
        } catch (error) {
            console.error('메시지 저장 실패:', error);
        }

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
                            onClick={() => handleUserClick(user)}
                            style={{ backgroundColor: unreadMap[user] ? 'red' : '' }}
                        >
                            {user}
                        </div>
                    ))}
                </div>
                <div className="admin-chat-box">
                    <div className="chat-history" ref={chatBoxRef}>
                        {messages
                            .filter(msg =>
                                (msg.senderId === selectedUser && msg.receiverId === 'admin') ||
                                (msg.senderId === 'admin' && msg.receiverId === selectedUser)
                            )
                            .map((msg, idx) => (
                                <div key={idx}>
                                    <div className="timestamp-admin">{formatTimestamp(msg.timestamp)}</div>
                                    <div className={msg.senderId === 'admin' ? 'admin-my-message' : 'user-message'}>
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
