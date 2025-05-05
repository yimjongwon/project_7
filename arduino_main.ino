#include <SoftwareSerial.h>
#include <Wire.h>
#include <Adafruit_SHT31.h>

// --- 핀 설정 ---
const int motor1_1 = 2;
const int motor1_2 = 4;
const int motor1EnablePin = 9;
const int currentSensorPin = A0;

SoftwareSerial pmsSerial(12, 13);
unsigned char pmsData[32];
int dataIndex = 0;

// --- 타이머 설정 ---
unsigned long lastSensorPrint = 0;
const unsigned long sensorPrintInterval = 2000; // 2초마다 데이터 출력

Adafruit_SHT31 sht31 = Adafruit_SHT31();

// === 모터 제어 모드 ===
int motorMode = 0; // 0: 자동, 1: 수동
int manualSpeedLevel = 0; // 수동 모드 시 속도 단계 (0~3)
int lastManualSpeedLevel = -1; // 속도가변경될때만출력

// === 수동 속도 레벨에 따른 PWM 값 ===
int manualSpeeds[4] = {0, 100, 180, 255};

// === 센서값 저장용 ===
int pm01Value = 0;
int pm25Value = 0;
int pm10Value = 0;
float currentValue = 0;
float temperature = 0;
float humidity = 0;
int motorSpeed = 0;

void setup() {
  Serial.begin(9600);
  pmsSerial.begin(9600);

  // 모터 핀 초기화
  pinMode(motor1_1, OUTPUT);
  pinMode(motor1_2, OUTPUT);
  pinMode(motor1EnablePin, OUTPUT);

  // 온습도 센서 초기화
  if (!sht31.begin(0x44)) {
    Serial.println("SHT31 센서 초기화 실패!");
    while (1);
  }

  setActiveMode();
  delay(1000);

  Serial.println("시스템 초기화 완료!");
  Serial.println("명령어: MODE:AUTO 또는 MODE:MANUAL / SPEED:0~3");
}

void loop() {
  // === 시리얼 명령어 수신 ===
  handleSerialCommand();

  // === PMS7003 데이터 수신 ===
  while (pmsSerial.available()) {
    byte incomingByte = pmsSerial.read();

    if (dataIndex == 0 && incomingByte != 0x42) continue;
    if (dataIndex == 1 && incomingByte != 0x4D) {
      dataIndex = 0;
      continue;
    }

    pmsData[dataIndex++] = incomingByte;

    if (dataIndex == 32) {
      processData();
      dataIndex = 0;
    }
  }

  unsigned long currentMillis = millis();

  // === 주기적으로 센서 데이터 측정 및 출력 ===
  if (currentMillis - lastSensorPrint >= sensorPrintInterval) {
    lastSensorPrint = currentMillis;

    // 전류 센서
    float sensorValue = analogRead(currentSensorPin);
    float voltage = sensorValue * (5.0 / 1023.0);
    currentValue = (voltage - 2.5) / 0.185;

    // 온습도 센서
    float temp = sht31.readTemperature();
    float hum = sht31.readHumidity();

    if (!isnan(temp) && !isnan(hum)) {
      temperature = temp;
      humidity = hum;
    }

    // 모든 센서 데이터 출력
    printSensorData();
  }

  // === 수동 모드일 경우 모터 제어 ===
  if (motorMode == 1) {
    applyManualMotorSpeed();
  }
}

// === 센서 Active Mode ===
void setActiveMode() {
  byte command[] = {0x42, 0x4D, 0xE1, 0x00, 0x01, 0x01, 0x71};
  pmsSerial.write(command, sizeof(command));
}

// === 미세먼지 데이터 처리 ===
void processData() {
  if (pmsData[0] == 0x42 && pmsData[1] == 0x4D) {
    pm01Value = (pmsData[10] << 8) | pmsData[11];
    pm25Value = (pmsData[12] << 8) | pmsData[13];
    pm10Value = (pmsData[14] << 8) | pmsData[15];

    Serial.print("PM1.0: ");
    Serial.print(pm01Value);
    Serial.print(" µg/m³, PM2.5: ");
    Serial.print(pm25Value);
    Serial.print(" µg/m³, PM10: ");
    Serial.println(pm10Value);

    if (motorMode == 0) {
      controlMotorAuto(pm25Value);
    }
  } else {
    Serial.println("데이터 수신 실패 (프리앰블 불일치)");
  }
}

// === 자동 모드: PM2.5에 따라 모터 속도 제어 ===
void controlMotorAuto(int pm2_5) {
  if (pm2_5 <= 15) motorSpeed = 100;
  else if (pm2_5 <= 35) motorSpeed = 150;
  else if (pm2_5 <= 75) motorSpeed = 200;
  else motorSpeed = 255;

  analogWrite(motor1EnablePin, motorSpeed);
  digitalWrite(motor1_1, HIGH);
  digitalWrite(motor1_2, LOW);

  Serial.print("모터 속도 (자동): ");
  Serial.println(motorSpeed);
}

// === 수동 모드: 선택한 수동 단계로 모터 속도 제어 ===
void applyManualMotorSpeed() {
  motorSpeed = manualSpeeds[manualSpeedLevel];

  analogWrite(motor1EnablePin, motorSpeed);

  if (motorSpeed > 0) {
    digitalWrite(motor1_1, HIGH);
    digitalWrite(motor1_2, LOW);
  } else {
    digitalWrite(motor1_1, LOW);
    digitalWrite(motor1_2, LOW);
  }

  if (manualSpeedLevel != lastManualSpeedLevel) {
    Serial.print("모터 속도 (수동): ");
    Serial.println(motorSpeed);
    lastManualSpeedLevel = manualSpeedLevel;
  }

}

// === 시리얼 명령어 처리 ===
void handleSerialCommand() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command.startsWith("MODE:")) {
      String modeValue = command.substring(5);
      modeValue.trim();

      if (modeValue == "AUTO") {
        motorMode = 0;
        Serial.println("모터 모드: 자동 모드로 전환");
      } else if (modeValue == "MANUAL") {
        motorMode = 1;
        Serial.println("모터 모드: 수동 모드로 전환");
        lastManualSpeedLevel = -1; // 초기화해서 다음 applyManualMotorSpeed() 에서 출력
      } else {
        Serial.println("잘못된 모드입니다. (AUTO 또는 MANUAL)");
      }
    } else if (command.startsWith("SPEED:")) {
      int speedLevel = command.substring(6).toInt();

      if (speedLevel >= 0 && speedLevel <= 3) {
        manualSpeedLevel = speedLevel;
        Serial.print("수동 속도 단계 설정: ");
        Serial.println(manualSpeedLevel);
      } else {
        Serial.println("잘못된 속도 단계입니다. (0 ~ 3)");
      }
    } else {
      Serial.println("알 수 없는 명령입니다.");
    }
  }
}

// === 센서 데이터 일괄 출력 ===
void printSensorData() {
  Serial.print("{");
  Serial.print("\"PM1.0\":"); Serial.print(pm01Value); Serial.print(",");
  Serial.print("\"PM2.5\":"); Serial.print(pm25Value); Serial.print(",");
  Serial.print("\"PM10\":"); Serial.print(pm10Value); Serial.print(",");
  Serial.print("\"CURRENT\":"); Serial.print(currentValue, 2); Serial.print(",");
  Serial.print("\"TEMP\":"); Serial.print(temperature, 2); Serial.print(",");
  Serial.print("\"HUM\":"); Serial.print(humidity, 2); Serial.print(",");
  Serial.print("\"MODE\":\""); Serial.print(motorMode == 0 ? "AUTO" : "MANUAL"); Serial.print("\",");
  Serial.print("\"SPEED\":"); Serial.print(motorSpeed);
  Serial.println("}");
}

