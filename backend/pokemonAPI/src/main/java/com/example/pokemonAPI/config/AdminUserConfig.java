package com.example.pokemonAPI.config;

import jakarta.transaction.Transactional;
import com.example.pokemonAPI.models.Role;
import com.example.pokemonAPI.models.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.example.pokemonAPI.repositories.RoleRepository;
import com.example.pokemonAPI.repositories.UserRepositorie;

import java.util.Set;

@Configuration
public class AdminUserConfig implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepositorie userRepositorie;
    private final BCryptPasswordEncoder passwordEncoder;

    public AdminUserConfig(RoleRepository roleRepository, UserRepositorie userRepositorie, BCryptPasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepositorie = userRepositorie;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        var roleAdminOptional = roleRepository.findByName(Role.Values.ADMIN.name());
        var roleUserOptional = roleRepository.findByName(Role.Values.USER.name());

        Role roleAdmin;
        Role roleUser;

        if (roleAdminOptional.isEmpty()) {
            roleAdmin = new Role();
            roleAdmin.setName(Role.Values.ADMIN.name());
            roleRepository.save(roleAdmin);
            System.out.println("Admin role created.");
        } else {
            roleAdmin = roleAdminOptional.get();
        }


        if (roleUserOptional.isEmpty()) {
            roleUser = new Role();
            roleUser.setName(Role.Values.USER.name());
            roleRepository.save(roleUser);
            System.out.println("user role created.");
        } else {
            roleUser = roleUserOptional.get();
        }


        var userAdminOptional = userRepositorie.findByUserName("admin");

        final Role finalRoleAdmin = roleAdmin; // Necessário para usar dentro da lambda

        userAdminOptional.ifPresentOrElse(
                user -> {
                    System.out.println("Admin user already exists.");
                },
                () -> {
                    var user = new User();
                    user.setUserName("admin");
                    user.setPassword(passwordEncoder.encode("123"));
                    user.setRoles(Set.of(finalRoleAdmin));
                    user.setPokemons(null);
                    userRepositorie.save(user);
                    System.out.println("Admin user created.");
                }
        );
    }
}