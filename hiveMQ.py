import serial
import time
import paho.mqtt.client as mqtt
import json
import ssl

# 시리얼 통신 설정
ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)

# MQTT 브로커 설정
broker = "1f89c669ce6f40a8aa6952820a376a78.s1.eu.hivemq.cloud"
port = 8883
username = "404project"
password = "Project1234"
publish_topic = "sensor/topic"  # 센서 데이터 토픽
control_topic = "motor/control"  # 제어 명령 토픽

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("MQTT 연결 성공")
        client.subscribe(control_topic)  # 제어 토픽 구독
    else:
        print(f"MQTT 연결 실패, 반환 코드: {rc}")

def on_message(client, userdata, msg):
    try:
        message = msg.payload.decode()
        print(f"Received message from {msg.topic}: {msg.payload.decode()}")

        # 아두이노로 명령 전달
        if msg.topic == control_topic:
            ser.write((message + '\n').encode())
            print(f"명령 전송: {message}")

    except Exception as e:
        print(f"메시지 처리 오류: {e}")

# MQTT 클라이언트 설정
client = mqtt.Client()
client.username_pw_set(username, password)
client.tls_set()
client.on_connect = on_connect
client.on_message = on_message
client.connect(broker, port, 60)

# === 메인 루프 ===
try:
    client.loop_start()
    while True:
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if line.startswith("{") and line.endswith("}"):
                try:
                    sensor_data = json.loads(line)
                    print("아두이노 데이터:", sensor_data)
                    # MQTT 퍼블리시
                    client.publish(publish_topic, json.dumps(sensor_data))
                    print("데이터 퍼블리시 완료")
                except json.JSONDecodeError:
                    print("JSON 디코딩 실패:", line)
        time.sleep(0.1)

except KeyboardInterrupt:
    print("종료합니다.")
finally:
    client.loop_stop()
    client.disconnect()
    ser.close()

