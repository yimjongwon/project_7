import React from "react";
import { Link } from "react-router-dom";

function Login() {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>로그인 페이지</h2>
            <input type="text" placeholder="아이디" /><br /><br />
            <input type="password" placeholder="비밀번호" /><br /><br />
            <button>로그인</button><br /><br />

            <Link to="/"><button>← 메인으로 돌아가기</button></Link>
        </div>
    );
}

export default Login