package com.fams.famsfrontend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.codec.Base64;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                byte[] encodedBytes = Base64.encode(rawPassword.toString().getBytes());
                return new String(encodedBytes);
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                byte[] encodedBytes = Base64.encode(rawPassword.toString().getBytes());
                String rawPasswordBase64 = new String(encodedBytes);
                return rawPasswordBase64.equals(encodedPassword);
            }
        };
    }

}
