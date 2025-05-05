package com.gsem.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class KakaoSearchDto {
    private List<Document> documents;

    @Setter
    @Getter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Document {
        private String place_name;
        private String x;
        private String y;

//        public void setPlace_name(String place_name) {
//            this.place_name = place_name;
//        }
//
//        public void setX(String x) {
//            this.x = x;
//        }
//
//        public void setY(String y) {
//            this.y = y;
//        }
    }
}
