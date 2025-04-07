import { Link } from "react-router-dom";
import "./css/Main.css";

function Main() {
    return (
        <div className="container1">
            <div className="main-banner">
                <img src="/images/main_logo.png" alt="배경 이미지" className="background-image" />
            </div>

            <div className="container2">
                <div className="container3">
                    <div id="indoor" className="custom-box">실내상황</div>
                    <div className="indoor_content">
                        <img src="/images/indoor_yellow.PNG" name="indoor_image" className="icon"/>
                        <div className="info-text">
                            <p>현재 실내 온도 : 23도</p>
                            <p>현재 실내 습도 : 43%</p>
                            <p>현재 실내 미세먼지 : 24ug</p>
                        </div>
                    </div> {/* indoor_content */}
                </div> {/* container3 */}



                <div className="container3" id="outdoor_container">
                    <div id="outdoor" className="custom-box">실외상황</div>
                    <div className="outdoor_content">
                        <img src="/images/outdoor_orange.PNG" name="indoor_image" className="icon"/>
                        <div className="info-text">
                            <p>현재 실외 온도 : 23도</p>
                            <p>현재 실외 습도 : 43%</p>
                            <p>현재 실외 미세먼지 : 24ug</p>
                        </div>
                    </div> {/* outdoor_content */}
                </div> {/* container3 */}

                <div className="container3" id="login_container">
                    <p className="login-text">로그인을 해주세요</p>
                    <div className="outer_button">
                        <button className="login_button">로그인 하기</button>
                    </div>
                </div> {/* login_container */}

            </div> {/* container2 */}


            <div className="container4">
                <div className="energy_title">
                    <div id="energy_text" className="custom-box">에너지 절약</div>
                </div> {/* energy_title */}

                <div className="container5"> {/* 지난달 에너지 총량, next이미지, 이번달 에너지 총량, 절약힌 에너지*/}
                    <div className="container6">
                        <h2 className="title">지난 달 에너지 총량</h2>
                        <img src="/images/indoor_yellow.PNG" alt="에너지 아이콘" className="energy-icon" />
                        <p className="energy-text">공기 청정기 쓴 에너지<br />230 시간</p>
                    </div> {/* container6 */}


                    <div className="next_container">
                        <img src="/images/next.PNG" alt="플레이 아이콘" className="next_icon" />
                    </div>


                    <div className="container6">
                        <h2 className="title">지난 달 에너지 총량</h2>
                        <img src="/images/indoor_blue.PNG" alt="에너지 아이콘" className="energy-icon" />
                        <p className="energy-text">공기 청정기 쓴 에너지<br />120 시간</p>
                    </div> {/* container6 */}


                    <div className="saving_energy_container">
                        <p className="saving_energy_title">총 절약한 에너지</p>
                        <p className="saving_energy_amount">24만원</p>
                    </div>

                </div> {/* container5 */}

            </div> {/* container4 */}

            <div className="empty"></div>


        </div> /* container1 */
    );
}

//<img src="/images/indoor_icon.png" alt="실내 아이콘" className="icon" />
export default Main;