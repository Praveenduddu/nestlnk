package com.interiorcolab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableAsync
public class InteriorColabApplication {
    public static void main(String[] args) {
        org.springframework.security.core.context.SecurityContextHolder.setStrategyName(
            org.springframework.security.core.context.SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
        SpringApplication.run(InteriorColabApplication.class, args);
    }
}
