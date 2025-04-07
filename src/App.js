import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./Login/Login";
import Signup from "./Login/Signup";
import Main from "./Main";
import Header from "./components/Header";
import Footer from "./components/Footer";


function App() {
  const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/hello")  // <-- 여기!
            .then(res => res.text())
            .then(data => setMessage(data))
            .catch(err => {
                console.error("API 요청 실패:", err);
                setMessage("서버 연결 실패 😢");
            });
    }, []);

    //<h1>Spring에서 받은 메시지:</h1>
    //<p>{message}</p>

    // <Router>
    //     <Routes>
    //         <Route path="/" element={
    //             <div>
    //                 <h1>IoT 환경 관리 시스템</h1>
    //                 <p>원하는 기능을 선택하세요:</p>
    //
    //                 <Link to="/login">
    //                     <button>로그인</button>
    //                 </Link>
    //             </div>
    //         } />
    //         <Route path="/login" element={<Login />} />
    //     </Routes>
    // </Router>
    return (
        <div>
            <Router>
                <Header /> {/* 모든 페이지 상단에 공통으로 표시 */}

                <Routes>
                    <Route path="/" element={<Main />} />         {/* 메인 페이지 */}
                    <Route path="/login" element={<Login />} />   {/* 로그인 페이지 */}
                    <Route path="/signup" element={<Signup />} /> {/* 회원가입 페이지 */}
                </Routes>

                <Footer /> {/* 모든 페이지 하단에 공통으로 표시 */}
            </Router>
        </div>
    );
}

export default App;
