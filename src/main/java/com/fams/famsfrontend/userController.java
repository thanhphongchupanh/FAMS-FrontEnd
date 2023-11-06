package com.fams.famsfrontend;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

//@Controller
public class userController {

    @GetMapping
    public String index(){
        return "userManagement/user";
    }

    @GetMapping("/permission")
    public String userPermission(){
        return "userManagement/userPermission";
    }

    @GetMapping("/test")
    public String test(){
        return "test";
    }

    @GetMapping("/viewSyllabus")
    public String viewSyllabus(){
        return "syllabus/ListSyllabus";
    }
    @GetMapping("/createSyllabus")
    public String createSyllabus(){
        return "syllabus/ListTrainingUnit";
    }
}
