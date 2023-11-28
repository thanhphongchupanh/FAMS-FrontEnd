package com.fams.famsfrontend.dto.user.response;/*  Welcome to Jio word
    @author: Jio
    Date: 11/7/2023
    Time: 10:05 AM
    
    ProjectName: fams-frontend
    Jio: I wish you always happy with coding <3
*/

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Authority {
    private String authority;

    @Override
    public String toString() {
        return authority;
    }
}
