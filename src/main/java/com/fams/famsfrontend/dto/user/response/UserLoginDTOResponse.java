package com.fams.famsfrontend.dto.user.response;/*  Welcome to Jio word
    @author: Jio
    Date: 10/6/2023
    Time: 2:51 PM
    
    ProjectName: fams-backend
    Jio: I wish you always happy with coding <3
*/

import com.fams.famsfrontend.dto.dto_enum.Gender;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserLoginDTOResponse {

    Long userId;
    String name;
    String email;
    String password;
    String phone;
    String dob;
    Gender gender;
    boolean status;
    List<Authority> authorities;

    @JsonIgnore
    String accessToken;
    @JsonIgnore
    String refreshToken;


}
