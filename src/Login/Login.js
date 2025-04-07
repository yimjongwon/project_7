import React from "react";
import { Link } from "react-router-dom";
import '../css/Login.css';

function Login() {
    return (
        <div className="login-container">
            <h2>로그인</h2>

            <div>
                <label>아이디</label>
                <input type="text" placeholder="아이디" />
            </div>

            <div>
                <label>비밀번호</label>
                <input type="password" placeholder="비밀번호" />
            </div>

            <button className="login-button">로그인</button>

            <div className="login-links">
                <Link to="/find-id">아이디 찾기</Link>
                <span>|</span>
                <Link to="/find-password">비밀번호 찾기</Link>
                <span>|</span>
                <Link to="/signup">회원가입</Link>
            </div>
        </div>
    );
}

export default Login;
