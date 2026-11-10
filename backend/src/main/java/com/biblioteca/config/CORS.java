package com.biblioteca.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CORS implements WebMvcConfigurer {
  @Value("${app.front-url}")
  private String frontUrl;

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry
        .addMapping("/v1/**")
        .allowedOrigins(frontUrl)
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .exposedHeaders("Location");
  }
}
