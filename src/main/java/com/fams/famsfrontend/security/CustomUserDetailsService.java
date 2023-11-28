package com.fams.famsfrontend.security;

import com.fams.famsfrontend.dto.response.ApiResponse;
import com.fams.famsfrontend.dto.user.request.LoginRequest;
import com.fams.famsfrontend.dto.user.response.UserLoginDTOResponse;
import com.fams.famsfrontend.service.user.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomUserDetailsService implements UserDetailsService {


    @Autowired
    private IUserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        ApiResponse response = userService.loginV2(username);
        UserLoginDTOResponse user = (UserLoginDTOResponse) response.getPayload();
        if (user == null) {
           throw new UsernameNotFoundException("User Not Found!");
        }
        if (response.getMetadata() != null){
            Map<String, Object> tokenMap =response.getMetadata();
            // Lấy giá trị của "access token" từ HashMap
            String accessToken = (String) tokenMap.get("access token");
            user.setAccessToken(accessToken);

            // Lấy giá trị của "refresh token" từ HashMap
            String refreshToken = (String) tokenMap.get("refresh token");
            user.setRefreshToken(refreshToken);
        }

        UserSecurity userSecurity = new UserSecurity(user);
        return userSecurity;
    }

    public UserDetails loadUserByUsernameAndPassword(String username, String password) throws UsernameNotFoundException {
        // Your implementation to load user by both username and password
        // Return UserDetails object or throw UsernameNotFoundException if user not found
        LoginRequest loginRequest = new LoginRequest(username,password);
        ApiResponse response = userService.login(loginRequest);
        UserLoginDTOResponse user = (UserLoginDTOResponse) response.getPayload();
        if (user == null) {
            throw new UsernameNotFoundException("User Not Found!");
        }

        if (response.getMetadata() != null){
            Map<String, Object> tokenMap =response.getMetadata();
            // Lấy giá trị của "access token" từ HashMap
            String accessToken = (String) tokenMap.get("access token");
            user.setAccessToken(accessToken);

            // Lấy giá trị của "refresh token" từ HashMap
            String refreshToken = (String) tokenMap.get("refresh token");
            user.setRefreshToken(refreshToken);
        }

        UserSecurity userSecurity = new UserSecurity(user);
        return userSecurity;
    }

}