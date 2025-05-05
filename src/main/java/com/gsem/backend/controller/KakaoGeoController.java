package com.gsem.backend.controller;


import com.gsem.backend.dto.KakaoSearchDto;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/geo")
public class KakaoGeoController {
    // 여기에 방금 복사한 REST API 키를 붙여넣기
    private final String KAKAO_API_KEY = "c413a3a7478b14720e122b9d601af482";

    @GetMapping("/coord")
    public ResponseEntity<String> getLatLng(@RequestParam String address) {
//        try {
////            String url = "https://dapi.kakao.com/v2/local/search/address.json?query=" +
////                    UriUtils.encode(address, StandardCharsets.UTF_8);
//            String url = "https://dapi.kakao.com/v2/local/search/keyword.json?query=" +
//                    UriUtils.encode(address, StandardCharsets.UTF_8);
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.set("Authorization", "KakaoAK " + KAKAO_API_KEY);
//            HttpEntity<String> entity = new HttpEntity<>(headers);
//
//            RestTemplate restTemplate = new RestTemplate();
//            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
//
//            return response;
//
//        } catch (Exception e) {
//            e.printStackTrace();  // 콘솔에 에러 출력
//            return ResponseEntity.status(500).body("API 호출 중 오류 발생: " + e.getMessage());
//        }
//    }

        try {
            String url = "https://dapi.kakao.com/v2/local/search/address.json?query=" +
                    UriUtils.encode(address, StandardCharsets.UTF_8);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "KakaoAK " + KAKAO_API_KEY);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<KakaoSearchDto> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    KakaoSearchDto.class
            );

            KakaoSearchDto body = response.getBody();

            if (body != null && !body.getDocuments().isEmpty()) {
                KakaoSearchDto.Document doc = body.getDocuments().get(0);
                return ResponseEntity.ok().body(
                        String.format("x: %s, y: %s", doc.getX(), doc.getY())
                );
            } else {
                return ResponseEntity.status(404).body("검색 결과가 없습니다.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("API 호출 중 오류 발생: " + e.getMessage());
        }
    }
}
