# Raspberry Pi MQTT Controller with HiveMQ

이 Python 스크립트는 라즈베리파이에서 아두이노로 시리얼 통신을 통해 센서 데이터를 주고받고, HiveMQ MQTT 브로커를 통해 웹 서버와 실시간으로 데이터를 주고받기 위해 작성되었습니다.

## 주요 기능

- HiveMQ Cloud MQTT 브로커와 보안 연결 (TLS, port 8883)
- 아두이노에서 시리얼 통신으로 센서 데이터를 수신
- 수신한 센서 데이터를 `sensor/topic` 토픽으로 MQTT에 publish
- MQTT로부터 `motor/control` 토픽을 구독하여 제어 명령 수신
- 수신한 제어 명령을 시리얼을 통해 아두이노로 전달

## 주요 구성 요소

- **Broker**: HiveMQ Cloud
- **Port**: 8883 (TLS 보안 연결)
- **센서 토픽**: `sensor/topic`
- **제어 토픽**: `motor/control`
- **MQTT 인증**: 사용자명과 비밀번호 기반 로그인
- **시리얼 포트**: `/dev/ttyACM0`, baudrate 9600

## 실행 전 필수 사항

- `paho-mqtt`, `pyserial` Python 라이브러리 설치 필요
- HiveMQ Cloud에서 MQTT 계정 생성 및 토픽 설정
- 아두이노와 라즈베리파이가 USB 케이블로 연결되어 있어야 함

## 설치 방법

```bash
pip install paho-mqtt pyserial
```

## 실행 방법

```bash
python3 hiveMQ.py
```
