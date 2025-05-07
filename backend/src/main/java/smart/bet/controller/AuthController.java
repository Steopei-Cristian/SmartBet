package smart.bet.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import smart.bet.dto.LoginRequest;
import smart.bet.dto.RegisterRequest;
import smart.bet.model.Role;
import smart.bet.model.User;
import smart.bet.repository.UserRepository;
import smart.bet.security.CustomUserDetailsService;
import smart.bet.security.JwtService;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.BETTER);
        user.setCreatedAt(LocalDate.now());

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Convert User to UserDetails
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        var token = jwtService.generateToken(userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        
        return ResponseEntity.ok(response);
    }
} 