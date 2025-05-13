import React from 'react';
import AdminChat from '../Chat/AdminChat';
import UserChat from '../Chat/UserChat';

function ChatPage({ isAdmin }) {
    return isAdmin ? <AdminChat /> : <UserChat />;
}

export default ChatPage;