package com.makers.technical.infrastructure.adapter.in.web.loans;

import com.makers.technical.domain.model.Loan;
import com.makers.technical.domain.port.in.ManageLoanUseCase;
import com.makers.technical.infrastructure.adapter.in.web.loans.dto.LoanRequestDto;
import com.makers.technical.infrastructure.adapter.in.web.loans.dto.LoanResponseDto;
import com.makers.technical.infrastructure.adapter.in.web.loans.dto.LoanReviewDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${application.api.base-path}/loans")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LoanController {

    private final ManageLoanUseCase manageLoanUseCase;

    @PostMapping
    public ResponseEntity<LoanResponseDto> requestLoan(
            @Valid @RequestBody LoanRequestDto request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        Loan loan = manageLoanUseCase.requestLoan(email, request.amount());
        return ResponseEntity.ok(mapToResponse(loan));
    }

    @GetMapping
    public ResponseEntity<List<LoanResponseDto>> getMyLoans(Authentication authentication) {
        String email = authentication.getName();
        List<LoanResponseDto> loans = manageLoanUseCase.getUserLoans(email).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/all")
    public ResponseEntity<List<LoanResponseDto>> getAllLoans(Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        if (!isAdmin)  return ResponseEntity.status(403).build();

        List<LoanResponseDto> loans = manageLoanUseCase.getAllLoans().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(loans);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<LoanResponseDto> reviewLoan(
            @PathVariable Long id,
            @Valid @RequestBody LoanReviewDto reviewDto
    ) {
        Loan.LoanStatus status = Loan.LoanStatus.valueOf(reviewDto.status());
        Loan updatedLoan = manageLoanUseCase.reviewLoan(id, status);
        return ResponseEntity.ok(mapToResponse(updatedLoan));
    }

    private LoanResponseDto mapToResponse(Loan loan) {
        return new LoanResponseDto(
                loan.getId(),
                loan.getUserEmail(),
                loan.getAmount(),
                loan.getStatus().name(),
                loan.getCreatedAt()
        );
    }
}