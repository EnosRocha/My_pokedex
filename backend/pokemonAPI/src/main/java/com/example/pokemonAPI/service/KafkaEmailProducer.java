package com.example.pokemonAPI.service;

import com.example.pokemonAPI.dtos.EmailEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaEmailProducer {
    private final KafkaTemplate<String, EmailEvent> kafkaTemplate;

    public KafkaEmailProducer(KafkaTemplate<String, EmailEvent> kafkaTemplate) {

        this.kafkaTemplate = kafkaTemplate;
    }


    public void sendEmail(EmailEvent emailEvent) {

        kafkaTemplate.send("email-topic", emailEvent);
        System.out.println("Email event published to Kafka topic 'email-topic' for: " + emailEvent.to());


    }
}
