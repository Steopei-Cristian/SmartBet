package smart.bet.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import smart.bet.dto.PlaceBetRequest;
import smart.bet.model.BetBuilder;
import smart.bet.service.BetService;
import smart.bet.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class BetController {
    private final BetService betService;
    private final UserService userService;

    @PostMapping("/place")
    @PreAuthorize("hasRole('BETTER')")
    public ResponseEntity<?> placeBet(
            @RequestBody PlaceBetRequest request,
            Authentication authentication) {
        try {
            BetBuilder betBuilder = betService.placeBet(request, authentication.getName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("betId", betBuilder.getId());
            response.put("balance", userService.getUserBalance(authentication.getName()).getBalance());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 