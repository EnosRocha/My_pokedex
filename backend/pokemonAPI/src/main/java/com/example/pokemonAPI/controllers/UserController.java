package com.example.pokemonAPI.controllers;

import com.example.pokemonAPI.dtos.CreateUserDto;
import com.example.pokemonAPI.models.Role;
import com.example.pokemonAPI.models.User;
import com.example.pokemonAPI.repositories.RoleRepository;
import com.example.pokemonAPI.repositories.UserRepositorie;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;

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

        if(basciRoleOptional.isEmpty()){
            basicRole = new Role();
            basicRole.setRoleId(2L);
            basicRole.setName(Role.Values.USER.name());
            roleRepository.save(basicRole);
            System.out.println("user created");
        }else{
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
}
