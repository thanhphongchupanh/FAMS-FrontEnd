package com.fams.famsfrontend.controller;

import com.fams.famsfrontend.dto.dto_enum.StatusEnum;
import com.fams.famsfrontend.dto.response.ApiResponse;
import com.fams.famsfrontend.dto.user.request.LoginRequest;
import com.fams.famsfrontend.security.UserSecurity;
import com.fams.famsfrontend.service.user.IUserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
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


    @GetMapping("/login")
    public String login(Model model,Authentication authentication){
        if (authentication == null){
            LoginRequest request = new LoginRequest();
            model.addAttribute("LOGINREQUEST", request);

            return "userManagement/login";
        }
        return "redirect:/";
    }

    @GetMapping("/users")
    public String user(Authentication authentication, HttpServletResponse response, HttpSession session){


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

    @GetMapping(value = "/logout")
    public String logout(Model model, HttpServletRequest request, HttpServletResponse response) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                new SecurityContextLogoutHandler().logout(request, response, auth);
                request.getSession().invalidate();
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return "redirect:/login?logout";
    }
}
