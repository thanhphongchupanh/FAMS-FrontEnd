package com.fams.famsfrontend.service.user.impl;/*  Welcome to Jio word
    @author: Jio
    Date: 10/31/2023
    Time: 10:57 AM
    
    ProjectName: fams-frontend
    Jio: I wish you always happy with coding <3
*/

import com.fams.famsfrontend.dto.response.ApiResponse;
import com.fams.famsfrontend.dto.user.request.LoginRequest;
import com.fams.famsfrontend.dto.user.response.UserDTOResponse;
import com.fams.famsfrontend.service.user.IUserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private String apiLoginUrl = "http://localhost:8080/api/v1/auth/login";

    private final RestTemplate restTemplate;


    @Override
    public ApiResponse<UserDTOResponse> login(LoginRequest loginRequest, HttpSession session) {
        try {

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity httpEntity = new HttpEntity<>(loginRequest, headers);

            ResponseEntity<ApiResponse<LoginRequest>> responseEntity = restTemplate.exchange(
                    apiLoginUrl,
                    HttpMethod.POST,
                    httpEntity,
                    new ParameterizedTypeReference<>() {
                    }
            );
            ApiResponse response = responseEntity.getBody();
            return response;


        } catch (HttpClientErrorException ex) {
            try {
                if (ex.getStatusCode() != HttpStatus.OK) {
                    ObjectMapper objectMapper = new ObjectMapper();
                    ApiResponse apiResponse = objectMapper.readValue(ex.getResponseBodyAsString(), ApiResponse.class);
                    return apiResponse;
                }
            } catch (Exception e) {
                return null;
            }
        }

        return null;
    }
}
