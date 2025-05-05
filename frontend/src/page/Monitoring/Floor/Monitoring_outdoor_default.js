import React, {useState} from "react";
import { Link } from "react-router-dom";
import '../../../css/page_css/Floor/Monitoring_outdoor_default.css';
import { useNavigate } from "react-router-dom";

function Monitoring_outdoor_default(){
    const navigate = useNavigate();

    return(
        <div className="detail_outdoor-container">

            <div className="detail_outdoor-container2">
                <div className="update_time">업데이트 시간 : 2025 / 03 / 29</div>
                <button className="indoor_button"
                        onClick={() => navigate("/monitoring_indoor")}>
                    실내</button>
            </div>

            <div className="status-section">
                <h3>현재 실외 온습도 상황</h3>
                <div className="status-box">
                    <div className="status-item">
                        <span>온도</span>
                        <span>100도</span>
                    </div>
                    <div className="status-item">
                        <span>습도</span>
                        <span>100%</span>
                    </div>
                    <div className="status-item">
                        <span>상태</span>
                        <span>흐림</span>
                    </div>
                </div>
            </div>


            <div className="status-section">
                <h3>현재 실외 미세먼지 상황</h3>
                <div className="status-box">
                    <div className="status-item">
                        <span>미세먼지</span>
                        <span>240ug</span>
                    </div>
                    <div className="status-item">
                        <span>상태</span>
                        <span>정상</span>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Monitoring_outdoor_default;