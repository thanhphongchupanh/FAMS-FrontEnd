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
}
