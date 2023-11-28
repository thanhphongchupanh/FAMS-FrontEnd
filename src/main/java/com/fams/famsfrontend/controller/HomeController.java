package com.fams.famsfrontend.controller;

import com.fams.famsfrontend.security.UserSecurity;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class HomeController {

    @GetMapping
    public String index(Model model){

//        LoginRequest request = new LoginRequest();
//        model.addAttribute("LOGINREQUEST", request);

        return "redirect:/home";
    }
    @GetMapping("/home")
    public String home(Authentication authentication, HttpServletResponse response, HttpSession session){
        if (authentication != null){
            UserSecurity userSecurity = (UserSecurity) authentication.getPrincipal();

            if(userSecurity != null){
                session.setAttribute("USER", userSecurity);

            }


            System.out.println("---------------");
            System.out.println(((UserSecurity) authentication.getPrincipal()).getAuthorities());
            System.out.println("Authorities:");
            for (GrantedAuthority authority : ((UserSecurity) authentication.getPrincipal()).getAuthorities()) {
                if (authority.toString().contains("SUPER_ADMIN")){
                    System.out.println("bibi");
                }
                System.out.println(authority.getAuthority());
            }

        }else {
            return "redirect:/logout";
        }

        return "home/index";
    }
}
