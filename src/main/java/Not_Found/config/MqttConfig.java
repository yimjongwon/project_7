package Not_Found.config;

import Not_Found.controller.SensorController;
import Not_Found.dto.SensorData;
import Not_Found.handler.SensorWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;

@Configuration
public class MqttConfig {

    @Autowired
    private SensorController sensorController;  // SensorController 주입

    @Autowired
    private SensorWebSocketHandler sensorWebSocketHandler;

    @Value("${mqtt.broker.url}")
    private String brokerUrl;

    @Value("${mqtt.client.id}")
    private String clientId;

    @Value("${mqtt.username:}")
    private String username;

    @Value("${mqtt.password:}")
    private String password;

    @Value("${mqtt.topic}")
    private String topic;

    // 1) MQTT ClientFactory
    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();

        // MqttConnectOptions를 사용하여 연결 옵션 설정
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[] {brokerUrl});  // 서버 URI 설정
        options.setUserName(username);  // 사용자명 설정 (필요한 경우)
        options.setPassword(password.toCharArray());  // 비밀번호 설정 (필요한 경우)



        // 3) SSLContext 설정 (필요 시)
        try {
            SSLContext sslContext = SSLContext.getDefault();
            options.setSocketFactory(sslContext.getSocketFactory());
        } catch (Exception e) {
            // SSLContext 알고리즘을 못 찾으면 런타임 예외로 감싸서 던집니다.
            throw new IllegalStateException("Failed to configure SSL for MQTT", e);
        }

        factory.setConnectionOptions(options);  // factory에 연결 옵션 설정
        return factory;
    }

    // 2) 메시지를 내부로 전달할 채널
    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    // 3) MQTT 브로커로부터 메시지를 구독하는 어댑터
    @Bean
    public MessageProducer inboundAdapter(MqttPahoClientFactory factory) {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter(clientId, factory, topic);
        adapter.setCompletionTimeout(5000);
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }

    // 4) 채널로 들어온 메시지를 처리할 핸들러
    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler handler() {
        return message -> {
            String payload = (String) message.getPayload();
            System.out.println("▶️ MQTT 메시지 수신 : " + payload);

            try {
                // payload를 SensorData로 변환
                ObjectMapper objectMapper = new ObjectMapper();
                SensorData sensorData = objectMapper.readValue(payload, SensorData.class);

                // SensorController로 전달
                sensorController.updateSensorData(sensorData);  // 최신 센서 데이터 업데이트

                // 🧩 [추가!] WebSocket을 통해 클라이언트에게 PUSH
                String sensorJson = objectMapper.writeValueAsString(sensorData);
                sensorWebSocketHandler.broadcast(sensorJson);

            } catch (Exception e) {
                e.printStackTrace();
            }
        };
    }
}
