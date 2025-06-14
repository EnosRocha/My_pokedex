package com.example.pokemonAPI.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record EmailEvent(String to, String subject, String body) {
}
