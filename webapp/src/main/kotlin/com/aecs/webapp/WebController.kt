package com.aecs.webapp

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class WebController {

    @GetMapping("/app")
    fun home(): String {
        return "index" // without .html
    }
}