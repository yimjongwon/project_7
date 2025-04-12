import React, { useState } from "react";
import "../css/Signup.css";

function Signup() {
    const [form, setForm] = useState({
        name: "",
        id: "",
        password: "",
        confirmPassword: "",
        email: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 회원가입 처리 로직
        console.log("회원가입 정보:", form);
    };

    return (
        <div className="signup-container">
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>이름</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>아이디</label>
                    <input type="text" name="id" value={form.id} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>비밀번호</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>비밀번호 확인</label>
                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>이메일</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>

                <div className="button-container">
                    <button type="submit" className="signup-button">회원가입</button>
                </div>
            </form>
        </div>
    );
}

export default Signup;
