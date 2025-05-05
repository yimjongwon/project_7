package com.gsem.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)

public class KakaoSearchDto {
    private List<Document> documents;

    public List<Document> getDocuments() {
        return documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Document {
        private String place_name;
        private String x; // longitude
        private String y; // latitude

        public String getPlace_name() {
            return place_name;
        }

        public void setPlace_name(String place_name) {
            this.place_name = place_name;
        }

        public String getX() {
            return x;
        }

        public void setX(String x) {
            this.x = x;
        }

        public String getY() {
            return y;
        }

        public void setY(String y) {
            this.y = y;
        }
    }
}
