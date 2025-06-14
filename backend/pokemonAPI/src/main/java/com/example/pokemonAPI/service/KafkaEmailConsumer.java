package com.example.pokemonAPI.service;

import com.example.pokemonAPI.dtos.EmailEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.streams.KafkaStreamsInteractiveQueryService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class KafkaEmailConsumer {
    private final SendGridEmailService sendGridEmailService;


    public KafkaEmailConsumer(SendGridEmailService sendGridEmailService) {
        this.sendGridEmailService = sendGridEmailService;
    }

    @KafkaListener(topics = "email-topic", groupId = "gruponotificacoes", containerFactory =
            "emailEventConcurrentKafkaListenerContainerFactory")
    public void consumerEmail(EmailEvent event) {
        try {
            System.out.println(event.to());
            sendGridEmailService.sendEmail(event.to(), event.subject(), event.body());
            System.out.println("Email sent to: " + event.to());
        } catch (Exception e) {
            System.out.println("Failed to send email to: " + event.to());
            e.printStackTrace();
        }

    }
}
