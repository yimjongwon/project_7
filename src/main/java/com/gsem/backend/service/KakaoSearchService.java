package com.gsem.backend.service;

import com.gsem.backend.dto.KakaoSearchDto;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class KakaoSearchService {

    public KakaoSearchDto getKakaoSearch(String searchKeyword) {
        final String restAPIKey = "KakaoAK YOUR_REST_API_KEY";
        String url = "https://dapi.kakao.com/v2/local/search/keyword.json?query=" + searchKeyword;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", restAPIKey);
        headers.set("Accept", "application/json");

        HttpEntity<?> entity = new HttpEntity<>(headers);
        ResponseEntity<KakaoSearchDto> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                KakaoSearchDto.class
        );

        return response.getBody();
    }
}
