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

function AppRouter({ message, isLoggedIn, userNickname, isAdmin, handleLogin, handleLogout, hasNewMessage, setHasNewMessage }) {

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/ws");
        socket.onopen = () => {
            console.log("[AppRouter] WebSocket connected");
        };
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("📩 WebSocket 수신 메시지:", data);
            if (data && (data.receiverId === 'admin' || data.receiverId === userNickname)) {
                setHasNewMessage(true);
            }
        };
        return () => socket.close();
    }, [userNickname, setHasNewMessage]);

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
                        />
                    }
                />
            </Routes>
            <Footer />
        </Router>
    );
}

export default AppRouter;
