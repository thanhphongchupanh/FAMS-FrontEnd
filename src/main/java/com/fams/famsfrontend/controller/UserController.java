package com.fams.famsfrontend.controller;

import com.fams.famsfrontend.dto.dto_enum.StatusEnum;
import com.fams.famsfrontend.dto.response.ApiResponse;
import com.fams.famsfrontend.dto.user.request.LoginRequest;
import com.fams.famsfrontend.dto.user.response.UserDTOResponse;
import com.fams.famsfrontend.service.user.IUserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;
    @GetMapping
    public String index(Model model){

        LoginRequest request = new LoginRequest();
        model.addAttribute("LOGINREQUEST", request);

        return "userManagement/login";
    }

    @GetMapping("/users")
    public String user(){
        return  "userManagement/user";
    }

    @GetMapping("/permission")
    public String userPermission(){
        return "userManagement/userPermission";
    }

    @GetMapping("/test")
    public String test(){
        return "test";
    }

    // LOGIN - POST
    @PostMapping ("/login")
    public String login(Model model, HttpSession session
            , @ModelAttribute("LOGINREQUEST") LoginRequest loginRequest, BindingResult bindingResult
            , HttpServletResponse response){

        ApiResponse<UserDTOResponse> apiResponse =userService.login(loginRequest,session);
        // xử lý lỗi
        if (apiResponse == null || apiResponse.getStatus() != StatusEnum.SUCCESS) {
            // to do, xử lý lỗi

            return "redirect:/";
        }
        // xử lý token
        if (apiResponse.getMetadata() != null){
            Map<String, Object> tokenMap =apiResponse.getMetadata();

            // Lấy giá trị của "access token" từ HashMap
            String accessToken = (String) tokenMap.get("access token");
            // Lưu "access token" vào một cookie
            Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
            accessTokenCookie.setMaxAge(3600); // Thời gian sống của cookie (ví dụ: 1 giờ)
            response.addCookie(accessTokenCookie);
            session.setAttribute("accessToken", accessToken);

            // Lấy giá trị của "refresh token" từ HashMap
            Object refreshToken = tokenMap.get("refresh token");
            session.setAttribute("refreshToken", refreshToken);
            // Lưu "refresh token" vào một cookie
            Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken.toString());
            refreshTokenCookie.setMaxAge(86400); // Thời gian sống của cookie (ví dụ: 1 ngày)
            response.addCookie(refreshTokenCookie);

        }

        return "redirect:/users";
    }
}
