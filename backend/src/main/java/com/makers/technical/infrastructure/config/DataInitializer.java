package com.makers.technical.infrastructure.config;

import com.makers.technical.infrastructure.adapter.out.db.entity.Role;
import com.makers.technical.infrastructure.adapter.out.db.entity.UserEntity;
import com.makers.technical.infrastructure.adapter.out.db.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("usuario@test.com").isEmpty()) {
                userRepository.save(UserEntity.builder()
                        .email("usuario@test.com")
                        .password(passwordEncoder.encode("123"))
                        .role(Role.USER)
                        .build());
            }

            if (userRepository.findByEmail("admin@test.com").isEmpty()) {
                userRepository.save(UserEntity.builder()
                        .email("admin@test.com")
                        .password(passwordEncoder.encode("123"))
                        .role(Role.ADMIN)
                        .build());
            }
        };
    }
}