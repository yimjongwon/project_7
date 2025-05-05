import React from "react";
import { Link } from "react-router-dom";
import "../css/Header.css"; // 스타일 적용

function Header() {
    return (
        <header className="header">
            <Link to="/" style={{ textDecoration: "none"}}><h1 className="logo">동양학교 환경관리</h1></Link>
            <nav className="nav">
                <Link to="/Monitoring_indoor" style={{ textDecoration: "none"}}>온습도 / 미세먼지 모니터링</Link>
                <Link to="/dataanalysis" style={{ textDecoration: "none"}}>데이터 분석</Link>
                <Link to="/" style={{ textDecoration: "none"}}>보고서</Link>
                <Link to="/devicecontrol" style={{ textDecoration: "none"}}>기기 제어</Link>
                <Link to="/" style={{ textDecoration: "none"}}>내정보</Link>
            </nav>
            <Link to="/login" className="login-btn">LOGIN</Link>
        </header>
    );
}

export default Header;