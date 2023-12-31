package com.fams.famsfrontend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SyllabusController {
    @GetMapping("/viewSyllabus")
    public String viewSyllabus(){
        return "syllabus/ListSyllabus";
    }
    @GetMapping("/createSyllabus")
    public String createSyllabus(){
        return "syllabus/ListTrainingUnit";
    }

    @GetMapping("/createSyllabusGeneral")
    public String createSyllabusGeneral() {
        return "syllabus/CreateSyllabusGeneral";
    }
    @GetMapping("/createSyllabusOtherScreen")
    public String createSyllabusOtherScreen(){
        return "syllabus/CreateSyllabusOtherScreen";
    }
    @GetMapping("/general")
    public String general(){
        return "syllabus/SyllabusGeneral";
    }
    @GetMapping("/outline")
    public String outline(){
        return "syllabus/SyllabusOutline";
    }
    @GetMapping("/other")
    public String other(){
        return "syllabus/SyllabusOther";
    }

}
