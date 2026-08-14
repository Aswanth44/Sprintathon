package com.uzhavarsetu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UzhavarSetuApplication {

    public static void main(String[] args) {
        SpringApplication.run(UzhavarSetuApplication.class, args);
        System.out.println("==================================================");
        System.out.println("  UzhavarSetu Kafka Backend Service Started Successfully! ");
        System.out.println("  Server running on http://localhost:8080");
        System.out.println("  Kafka Broker Target: localhost:9092");
        System.out.println("  Topic: uzhavarsetu.batch.events");
        System.out.println("==================================================");
    }
}
