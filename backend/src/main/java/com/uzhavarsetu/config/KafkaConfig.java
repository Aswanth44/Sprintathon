package com.uzhavarsetu.config;

import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaAdmin;
import org.springframework.kafka.config.TopicBuilder;

import java.util.HashMap;
import java.util.Map;

/**
 * Spring Kafka Configuration
 * Configures KafkaAdmin gracefully so Spring Boot boots cleanly even when Kafka broker is offline.
 */
@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers:localhost:9092}")
    private String bootstrapServers;

    @Value("${uzhavarsetu.kafka.topic:uzhavarsetu.batch.events}")
    private String topicName;

    @Bean
    public KafkaAdmin kafkaAdmin() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        KafkaAdmin admin = new KafkaAdmin(configs);
        admin.setFatalIfBrokerNotAvailable(false);
        admin.setAutoCreate(false);
        return admin;
    }

    @Bean
    @ConditionalOnProperty(name = "uzhavarsetu.kafka.auto-create-topic", havingValue = "true", matchIfMissing = false)
    public NewTopic batchEventsTopic() {
        return TopicBuilder.name(topicName)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
