package com.makers.technical.infrastructure.adapter.out.db.repository;

import com.makers.technical.infrastructure.adapter.out.db.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
}