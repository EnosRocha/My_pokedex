package com.example.pokemonAPI.controllers;


import com.example.pokemonAPI.dtos.LoginRequest;
import com.example.pokemonAPI.dtos.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.example.pokemonAPI.repositories.UserRepositorie;

import java.time.Instant;
import java.util.stream.Collectors;

@RestController
public class TokenController {

    private final JwtEncoder jwtEncoder;
    private final UserRepositorie userRepositorie;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public TokenController(JwtEncoder jwtEncoder, UserRepositorie userRepositorie, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.jwtEncoder = jwtEncoder;
        this.userRepositorie = userRepositorie;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Login attempt for username: " + loginRequest.username());
        var user = userRepositorie.findByUserName(loginRequest.username());
        if (!user.isPresent()) {
            System.out.println("User not found: " + loginRequest.username());
            throw new BadCredentialsException("either the password or username don`t match those registered in DB");

        }
        if (!user.get().isLoginCorrect(loginRequest, bCryptPasswordEncoder)) {
            System.out.println("Password mismatch for user: " + loginRequest.username());
            throw new BadCredentialsException("Password does not match");
        }

        var now = Instant.now();
        var expiresIn = 300L;

        var scope = user.get().getRoles()
                .stream()
                .map(role -> role.getName())
                .collect(Collectors.joining(" "));

        var claims = JwtClaimsSet.builder()
                .issuer("mybackendprogram")
                .subject(user.get().getUserName().toString())
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiresIn))
                .claim("scope", scope)
                .build();

        var jwrValue = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
        System.out.println(jwrValue);
        return ResponseEntity.ok(new LoginResponse(jwrValue, expiresIn));
    }
}
