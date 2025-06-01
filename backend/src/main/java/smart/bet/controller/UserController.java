package smart.bet.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import smart.bet.dto.BalanceRequest;
import smart.bet.dto.BalanceResponse;
import smart.bet.dto.UserResponse;
import smart.bet.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/non-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllNonAdminUsers() {
        return ResponseEntity.ok(userService.getAllNonAdminUsers());
    }

    @PostMapping("/balance")
    public ResponseEntity<BalanceResponse> getUserBalance(@RequestBody BalanceRequest request) {
        return ResponseEntity.ok(userService.getUserBalance(request.getUsername()));
    }
} 