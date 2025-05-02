package Not_Found.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data

public class SensorData {
    @JsonProperty("PM1.0")
    private double pm1_0;

    @JsonProperty("PM2.5")
    private double pm2_5;

    @JsonProperty("PM10")
    private double pm10;

    @JsonProperty("CURRENT")
    private double current;

    @JsonProperty("TEMP")
    private double temp;

    @JsonProperty("HUM")
    private double hum;

    @JsonProperty("MODE")
    private String mode;

    @JsonProperty("SPEED")
    private int speed;
}
