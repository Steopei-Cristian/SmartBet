package smart.bet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smart.bet.dto.BalanceResponse;
import smart.bet.dto.UserResponse;
import smart.bet.model.Account;
import smart.bet.model.Role;
import smart.bet.model.User;
import smart.bet.repository.AccountRepository;
import smart.bet.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public List<UserResponse> getAllNonAdminUsers() {
        return userRepository.findByRoleNot(Role.ADMIN)
                .stream()
                .map(user -> new UserResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getRole(),
                    user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    public BalanceResponse getUserBalance(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found for user: " + username));
        
        return new BalanceResponse(user.getUsername(), account.getBalance());
    }
} 