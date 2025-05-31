import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Signup from "./Login/Signup";
import Main from "./Main";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FindId from "./Login/FindId";
import FindPassword from "./Login/FindPassword";
import ChatPage from "./Chat/ChatPage";
import { useEffect, useState } from "react";
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

function AppRouter({ message, isLoggedIn, userNickname, isAdmin, handleLogin, handleLogout, hasNewMessage, setHasNewMessage }) {

    useEffect(() => {
        if (!userNickname) return;

        const socket = new SockJS(`http://localhost:8080/ws?userId=${userNickname}`);
        const client = over(socket);
        console.log("User nickname for WebSocket:", userNickname);

        client.connect({}, () => {
            console.log('[AppRouter] STOMP connected');

            // 관리자용 메시지 수신
            if (isAdmin) {
                client.subscribe('/topic/messages/admin', (msg) => {
                    const message = JSON.parse(msg.body);
                    setHasNewMessage(true);
                });
            }

            // 유저용 메시지 수신
            else {
                client.subscribe('/user/queue/messages', (msg) => {
                    const message = JSON.parse(msg.body);
                    console.log('[AppRouter] 유저가 메시지를 수신했습니다:', message);
                    setHasNewMessage(true);
                });
            }
        });

        return () => {
            if (client.connected) {
                client.disconnect();
            }
        };
    }, [isAdmin, userNickname, setHasNewMessage]);

    return (
        <Router>
            <Header
                isLoggedIn={isLoggedIn}
                userNickname={userNickname}
                handleLogout={handleLogout}
                hasNewMessage={hasNewMessage}
            />

            <Routes>
                <Route
                    path="/"
                    element={
                        <Main
                            message={message}
                            isLoggedIn={isLoggedIn}
                            userNickname={userNickname}
                        />
                    }
                />
                <Route path="/login" element={<Login handleLogin={handleLogin} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/find-id" element={<FindId />} />
                <Route path="/find-password" element={<FindPassword />} />
                <Route
                    path="/chat"
                    element={
                        <ChatPage
                            isLoggedIn={isLoggedIn}
                            isAdmin={isAdmin}
                            userNickname={userNickname}
                            onEnterChatPage={() => setHasNewMessage(false)}
                            setHasNewMessage={setHasNewMessage}
                        />
                    }
                />
            </Routes>
            <Footer />
        </Router>
    );
}

export default AppRouter;
