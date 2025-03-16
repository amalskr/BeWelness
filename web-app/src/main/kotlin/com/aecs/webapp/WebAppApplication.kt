package com.aecs.webapp

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class WebAppApplication

fun main(args: Array<String>) {
    runApplication<WebAppApplication>(*args)
}
