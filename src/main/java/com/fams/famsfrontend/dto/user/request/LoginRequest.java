package com.fams.famsfrontend.dto.user.request;/*  Welcome to Jio word
    @author: Jio
    Date: 10/31/2023
    Time: 10:43 AM
    
    ProjectName: fams-frontend
    Jio: I wish you always happy with coding <3
*/

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
}
