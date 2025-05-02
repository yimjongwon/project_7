package Not_Found.controller;

import Not_Found.dto.SensorData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SensorController {

    // 최신 센서 데이터를 저장할 필드
    private SensorData latestSensorData;

    // MqttConfig에서 전달받은 최신 센서 데이터를 처리할 메서드
    public void updateSensorData(SensorData sensorData) {
        this.latestSensorData = sensorData;
    }

    // index 페이지로 최신 센서 데이터를 전달
    @GetMapping("/")
    public String dashboard(Model model) {
        // sensor가 null이면 빈 DTO로 초기화해서 Mustache가 블록을 렌더링하게 함
        SensorData sensor = (latestSensorData != null) ? latestSensorData : new SensorData();

        System.out.println("Sensor Data: " + sensor);
        model.addAttribute("sensor", sensor);  // latestSensorData를 Model에 담기
        return "index";  // dashboard.mustache 페이지 반환
    }
}
