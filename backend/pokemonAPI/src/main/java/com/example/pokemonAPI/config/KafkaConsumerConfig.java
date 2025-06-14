package com.example.pokemonAPI.config;

import com.example.pokemonAPI.dtos.EmailEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, EmailEvent> emailEventConsumerFactory(){
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
                "localhost:9092");
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "gruponotificacoes");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                JsonDeserializer.class);
        config.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        return new DefaultKafkaConsumerFactory<>(config,
                new StringDeserializer(), new
                JsonDeserializer<>(EmailEvent.class));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, EmailEvent> emailEventConcurrentKafkaListenerContainerFactory(){
        ConcurrentKafkaListenerContainerFactory<String, EmailEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(emailEventConsumerFactory());
        return factory;
    }
}
