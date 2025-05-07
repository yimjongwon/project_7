//package com.gsem.backend.config;
//
//<<<<<<< HEAD
//
//=======
//>>>>>>> minseo
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//<<<<<<< HEAD
//        registry.addMapping("/") // API 경로
//                .allowedOrigins("http://localhost:3000") // React 개발 서버 주소
//                .allowedMethods("*")
//                .allowedHeaders("*");
//=======
//        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:3000")  // 여기!
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                .allowedHeaders("*")
//                .allowCredentials(true);
//>>>>>>> minseo
//    }
//}


package com.gsem.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 전체 API에 적용
                .allowedOrigins("http://localhost:3000") // React 서버 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}