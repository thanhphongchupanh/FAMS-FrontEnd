package com.fams.famsfrontend.exception;/*  Welcome to Jio word
    @author: Jio
    Date: 11/21/2023
    Time: 9:56 AM
    
    ProjectName: fams-frontend
    Jio: I wish you always happy with coding <3
*/

import org.springframework.security.core.AuthenticationException;

public class CustomAuthenticationException extends AuthenticationException {

    public CustomAuthenticationException(String msg, Throwable t) {
        super(msg, t);
    }

    public CustomAuthenticationException(String msg) {
        super(msg);
    }
}
