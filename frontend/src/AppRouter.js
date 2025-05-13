import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Signup from "./Login/Signup";
import Main from "./Main";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FindId from "./Login/FindId";
import FindPassword from "./Login/FindPassword";
import ChatUserPage from "./Chat/UserChat";
import ChatAdminPage from "./Chat/AdminChat";

function AppRouter({ message, isLoggedIn, userNickname, isAdmin, handleLogin, handleLogout }) {
    return (
        <Router>
            <Header isLoggedIn={isLoggedIn}
                    userNickname={userNickname}
                    isAdmin={isAdmin}
                    handleLogout={handleLogout}
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

                {/* 채팅: 로그인된 경우 관리자 여부에 따라 분기 */}
                {isLoggedIn && isAdmin && (
                    <Route path="/chat" element={<ChatAdminPage userNickname={userNickname} />} />
                )}
                {isLoggedIn && !isAdmin && (
                    <Route path="/chat" element={<ChatUserPage userNickname={userNickname} />} />
                )}
            </Routes>

            <Footer />
        </Router>
    );
}

export default AppRouter;
