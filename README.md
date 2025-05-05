# 📡 Arduino 환경센서 모니터링 & 제어 시스템

## 🔧 개요
이 프로젝트는 **ACS712 전류 센서**, **PMS7003 미세먼지 센서**, **DHT11 온습도 센서**를 이용하여 실내 환경 데이터를 측정하고, 모터를 제어하여 에너지를 절약하는 IoT 시스템입니다. MQTT 프로토콜을 이용해 데이터를 송수신합니다.

## 🧩 사용 부품
- 🟦 Arduino UNO
- 🌡️ DHT11 (온습도 센서)
- 🌀 PMS7003 (미세먼지 센서)
- ⚡ ACS712 (전류 측정 센서)
- 🧲 DC 모터
- 📶 Wi-Fi 통신 모듈 (예: ESP8266, 또는 시리얼 통신으로 라즈베리파이와 연결)
- 🔌 외부 파워서플라이 또는 배터리 팩

## 🔁 주요 기능
- 온도/습도/미세먼지 데이터를 측정하여 MQTT로 전송
- MQTT 메시지를 수신하여 **모터 제어 (PWM 기반)** 수행
- 전류 측정으로 소비전력 추산 가능
- 전력 절약량을 KRW 단위로 환산 가능

## 🧪 센서 출력 예시
```json
{
  "temperature": 24.5,
  "humidity": 48.3,
  "pm10": 17,
  "pm25": 12,
  "current": 0.27
}
```

## 🔌 MQTT 토픽 구조
- `/sensor/data` → 센서 데이터를 publish
- `/motor/control` → 외부 명령 수신용 (예: ON/OFF, 속도 제어)

## ▶️ 아두이노 실행 방법
1. 아두이노 IDE에서 `arduino_main.ino` 열기
2. 보드 및 포트 설정
3. 필요한 라이브러리 설치:
   - `DHT`
   - `Adafruit_Sensor`
   - `SoftwareSerial`
4. 코드 업로드 후, MQTT 브로커 주소 및 토픽 확인

## 📦 프로젝트 구조
```bash
├── arduino_main.ino   # 메인 제어 코드
├── README.md          # 설명 파일
└── (optional: docs/, images/, etc.)
```

## 🔎 참고 사항
- PMS7003은 UART 방식으로 연결되어야 하며, SoftwareSerial을 통해 통신합니다.
- ACS712는 모터 작동 중의 실시간 전류를 측정하여 절전 효과 분석에 사용됩니다.
- MQTT 브로커는 HiveMQ 등 외부 클라우드나 라즈베리파이 기반 Mosquitto 브로커 사용 가능.
