package smart.bet.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import smart.bet.model.Role;

@Data
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    private Role role;
} 