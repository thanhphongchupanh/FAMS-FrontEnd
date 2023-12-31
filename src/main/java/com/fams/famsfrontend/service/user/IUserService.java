package com.fams.famsfrontend.service.user;/*  Welcome to Jio word
    @author: Jio
    Date: 10/31/2023
    Time: 10:56 AM
    
    ProjectName: fams-frontend
    Jio: I wish you always happy with coding <3
*/

import com.fams.famsfrontend.dto.response.ApiResponse;
import com.fams.famsfrontend.dto.user.request.LoginRequest;
import jakarta.servlet.http.HttpSession;

public interface IUserService {
    ApiResponse<?> login(LoginRequest loginRequest);

    ApiResponse<?> loginV2(String email);
}
