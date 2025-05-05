package com.gsem.backend.controller;

import com.gsem.backend.dto.KakaoSearchDto;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/geo")
public class KakaoGeoController {
    // Kakao REST API Key
    private final String KAKAO_API_KEY = "KakaoAK YOUR_REST_API_KEY_HERE";

    @GetMapping("/coord")
    public ResponseEntity<String> getLatLng(@RequestParam String address) {
        try {
            // Kakao 주소검색 API (도로명 또는 지번주소 기반)
            String url = "https://dapi.kakao.com/v2/local/search/address.json?query=" +
                    UriUtils.encode(address, StandardCharsets.UTF_8);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", KAKAO_API_KEY);
            headers.set("Accept", "application/json");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<KakaoSearchDto> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, KakaoSearchDto.class
            );

            KakaoSearchDto body = response.getBody();
            if (body != null && body.getDocuments() != null && !body.getDocuments().isEmpty()) {
                KakaoSearchDto.Document doc = body.getDocuments().get(0);
                return ResponseEntity.ok("x: " + doc.getX() + ", y: " + doc.getY());
            } else {
                return ResponseEntity.status(404).body("검색 결과 없음");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("API 호출 오류: " + e.getMessage());
        }
    }
}
