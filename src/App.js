import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./Login/Login"; // 로그인 컴포넌트 import
import Header from "./components/Header";
import Main from "./Main";

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
              <Header />
              <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Main />} />
              </Routes>
          </Router>


      </div>
  );
}

export default App;
