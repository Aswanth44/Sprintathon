package com.uzhavarsetu.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * Spring Kafka Configuration
 * Automatically provisions Kafka topic `uzhavarsetu.batch.events`.
 */
@Configuration
public class KafkaConfig {

    @Value("${uzhavarsetu.kafka.topic:uzhavarsetu.batch.events}")
    private String topicName;

    @Bean
    public NewTopic batchEventsTopic() {
        return TopicBuilder.name(topicName)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
