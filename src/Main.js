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
                    <div id="indoor">실내상황</div>
                </div>


                <div className="container3">
                    <div id="outdoor">실외상황</div>
                </div>
            </div>
        </div>
    );
}

//<img src="/images/indoor_icon.png" alt="실내 아이콘" className="icon" />
export default Main;