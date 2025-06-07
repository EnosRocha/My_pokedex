package com.example.pokemonAPI.controllers;

import com.example.pokemonAPI.dtos.AddFirstPokemonDto;
import com.example.pokemonAPI.dtos.AddPokemonDto;
import com.example.pokemonAPI.dtos.CreateUserDto;
import com.example.pokemonAPI.models.Role;
import com.example.pokemonAPI.models.User;
import com.example.pokemonAPI.repositories.RoleRepository;
import com.example.pokemonAPI.repositories.UserRepositorie;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.method.AuthorizeReturnObject;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
public class UserController {

    private final UserRepositorie userRepositorie;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserController(UserRepositorie userRepositorie, RoleRepository roleRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepositorie = userRepositorie;
        this.roleRepository = roleRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping("/users")
    private ResponseEntity<Void> newUser(@RequestBody CreateUserDto createUserDto) {
        System.out.println(createUserDto.userName());
        var basciRoleOptional = roleRepository.findByName(Role.Values.USER.name());

        Role basicRole;

        if (basciRoleOptional.isEmpty()) {
            basicRole = new Role();
            basicRole.setRoleId(2L);
            basicRole.setName(Role.Values.USER.name());
            roleRepository.save(basicRole);
            System.out.println("user created");
        } else {
            basicRole = basciRoleOptional.get();
        }

        var user = userRepositorie.findByUserName(createUserDto.userName());

        user.ifPresentOrElse(user1 -> {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY);
        }, () -> {
            var user2 = new User();
            user2.setUserName(createUserDto.userName());
            user2.setPassword(bCryptPasswordEncoder.encode(createUserDto.password()));
            user2.setRoles(Set.of(basicRole));
            user2.setPokemons(null);
            userRepositorie.save(user2);
            System.out.println("user had been created");


        });
        return ResponseEntity.ok().build();
    }


    @PostMapping("/addPokemon")
    private ResponseEntity<Void> addNewPokemon(@RequestBody AddPokemonDto dto, @AuthenticationPrincipal Jwt jwt
    ) {
        if (!jwt.getSubject().equals(dto.userName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        var userOptional = userRepositorie.findByUserName(dto.userName());


        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        var user = userOptional.get();

        if (user.getPokemons() == null) {
            user.setPokemons(new java.util.HashSet<>());
        }

        user.getPokemons().add(dto.pokemonName());

        userRepositorie.save(user);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/userPokemons")
    private ResponseEntity<Set<String>> userPokemonsEndPoint(@RequestParam String userName, @AuthenticationPrincipal
    Jwt jwt) {
        if (!jwt.getSubject().equals(userName)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }


        Optional<User> userData = userRepositorie.findByUserName(userName);

        if (userData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User finalUser = userData.get();
        Set<String> userPokemons = finalUser.getPokemons();

        return ResponseEntity.ok(userPokemons);
    }

    @PostMapping("/addFirst")
    private ResponseEntity<Void> addTheFirstPokemons(@RequestBody AddFirstPokemonDto dto, @AuthenticationPrincipal Jwt jwt) {
        if (!jwt.getSubject().equals(dto.userName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        System.out.println(jwt.getSubject());
        System.out.println(dto.userName());
        var userOptional = userRepositorie.findByUserName(dto.userName());


        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        var user = userOptional.get();

        if (user.getPokemons() == null) {
            user.setPokemons(new java.util.HashSet<>());
        }

        user.getPokemons().addAll(Arrays.asList(dto.pokemons()));

        userRepositorie.save(user);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/getUsers")
    public ResponseEntity<List<User>> returnAllUsers(@AuthenticationPrincipal Jwt jwt) {
        System.out.println("users authenticaded:" + jwt.getSubject());
        List<User> users = userRepositorie.findAll();
        return ResponseEntity.ok(users);

    }
}
