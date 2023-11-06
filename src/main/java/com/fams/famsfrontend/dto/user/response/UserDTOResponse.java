package com.fams.famsfrontend.dto.user.response;/*  Welcome to Jio word
    @author: Jio
    Date: 10/6/2023
    Time: 2:51 PM
    
    ProjectName: fams-backend
    Jio: I wish you always happy with coding <3
*/

import com.fams.famsfrontend.dto.dto_enum.Gender;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTOResponse {

    Long userId;
    String userPermission;
    String name;
    String email;
    String phone;
    String dob;
    Gender gender;
    boolean status;



}
