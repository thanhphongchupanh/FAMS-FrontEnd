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
    @GetMapping("/viewSyllabusGeneral")
    public String viewSyllabusGeneral(){
        return "syllabus/viewSyllabusGeneral";
    }
    @GetMapping("/viewSyllabusOutline")
    public String viewSyllabusOutline(){
        return "syllabus/viewSyllabusOutline";
    }
    @GetMapping("/viewSyllabusOther")
    public String viewSyllabusOther(){
        return "syllabus/viewSyllabusOther";
    }

    @GetMapping("/general")
    public String general(){
        return "syllabus/SyllabusGeneral";
    }

}
