package com.example.pokemonAPI.repositories;

import com.example.pokemonAPI.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepositorie extends JpaRepository<User, UUID> {


    Optional<User> findByUserName(String username);
}
