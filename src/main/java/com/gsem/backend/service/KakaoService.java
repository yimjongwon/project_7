package com.gsem.backend.service;

import com.gsem.backend.dto.KakaoSearchDto;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

public class KakaoService {
    private final String KAKAO_API_KEY = "c413a3a7478b14720e122b9d601af482"; // ← 실제 키로 바꾸세요!

    public KakaoSearchDto getKakaoSearch(String searchKeyword) {
        String url = "https://dapi.kakao.com/v2/local/search/address.json?query=" + searchKeyword;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", KAKAO_API_KEY);
        headers.set("Accept", "application/json");

        HttpEntity<?> entity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<KakaoSearchDto> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                KakaoSearchDto.class
        );

        return response.getBody();
    }
}
