package com.makers.technical.infrastructure.adapter.out.db;

import com.makers.technical.domain.model.Loan;
import com.makers.technical.domain.port.out.LoanRepositoryPort;
import com.makers.technical.infrastructure.adapter.out.db.entity.LoanEntity;
import com.makers.technical.infrastructure.adapter.out.db.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class LoanPersistenceAdapter implements LoanRepositoryPort {

    private final LoanRepository repository;

    @Override
    public List<Loan> findAll() {
        return repository.findAll().stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Loan save(Loan loan) {
        LoanEntity entity = LoanEntity.builder()
                .id(loan.getId())
                .userEmail(loan.getUserEmail())
                .amount(loan.getAmount())
                .status(loan.getStatus().name())
                .createdAt(loan.getCreatedAt())
                .build();

        LoanEntity savedEntity = repository.save(entity);
        return mapToDomain(savedEntity);
    }

    @Override
    public Optional<Loan> findById(Long id) {
        return repository.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<Loan> findByUserEmail(String userEmail) {
        return repository.findByUserEmail(userEmail).stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    private Loan mapToDomain(LoanEntity entity) {
        return Loan.builder()
                .id(entity.getId())
                .userEmail(entity.getUserEmail())
                .amount(entity.getAmount())
                .status(Loan.LoanStatus.valueOf(entity.getStatus()))
                .createdAt(entity.getCreatedAt())
                .build();
    }
}