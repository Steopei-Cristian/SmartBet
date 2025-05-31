package smart.bet.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smart.bet.dto.UserResponse;
import smart.bet.model.Role;
import smart.bet.model.User;
import smart.bet.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

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
} 