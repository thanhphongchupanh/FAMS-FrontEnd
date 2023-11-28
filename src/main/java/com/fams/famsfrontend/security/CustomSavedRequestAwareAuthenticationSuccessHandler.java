package com.fams.famsfrontend.security;/*  Welcome to Jio word
    @author: Jio
    Date: 11/24/2023
    Time: 10:35 AM
    
    ProjectName: fams-frontend
    Jio: I wish you always happy with coding <3
*/

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;
@Component
public class CustomSavedRequestAwareAuthenticationSuccessHandler extends CustomAuthenticationSuccessHandler {

    protected final Log logger = LogFactory.getLog(this.getClass());

    private RequestCache requestCache = new HttpSessionRequestCache();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws ServletException, IOException {

        if (authentication != null) {
            UserSecurity userSecurity = (UserSecurity) authentication.getPrincipal();

            if (userSecurity != null) {

                String accessToken = userSecurity.getUser().getAccessToken();
                String refreshToken = userSecurity.getUser().getRefreshToken();


                Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
                accessTokenCookie.getAttribute(accessToken);
                accessTokenCookie.setMaxAge(3600); // Thời gian sống của cookie (ví dụ: 1 giờ)
                response.addCookie(accessTokenCookie);

                // Lưu "refresh token" vào một cookie
                Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
                refreshTokenCookie.getAttribute(refreshToken);
                refreshTokenCookie.setMaxAge(30 * 24 * 60 * 60); // Thời gian sống của cookie (ví dụ: 1 ngày)
                response.addCookie(refreshTokenCookie);
//                 Chuyển hướng hoặc thực hiện các tác vụ khác nếu cần thiết
//                response.sendRedirect("/home"); // Ví dụ: Chuyển hướng đến trang home sau khi đăng nhập thành công
            }

        }

        SavedRequest savedRequest = this.requestCache.getRequest(request, response);
        if (savedRequest == null) {
            super.onAuthenticationSuccess(request, response, authentication);
            return;
        }
        String targetUrlParameter = getTargetUrlParameter();
        if (isAlwaysUseDefaultTargetUrl()
                || (targetUrlParameter != null && StringUtils.hasText(request.getParameter(targetUrlParameter)))) {
            this.requestCache.removeRequest(request, response);
            super.onAuthenticationSuccess(request, response, authentication);
            return;
        }
        clearAuthenticationAttributes(request);
        // Use the DefaultSavedRequest URL
        String targetUrl = savedRequest.getRedirectUrl();
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    public void setRequestCache(RequestCache requestCache) {
        this.requestCache = requestCache;
    }
}
