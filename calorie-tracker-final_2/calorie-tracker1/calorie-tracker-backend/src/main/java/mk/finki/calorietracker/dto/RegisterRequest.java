package mk.finki.calorietracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Корисничкото име е задолжително")
    private String username;

    @NotBlank(message = "Email е задолжителен")
    @Email(message = "Email адресата не е валидна")
    private String email;

    @NotBlank(message = "Лозинката е задолжителна")
    @Size(min = 6, message = "Лозинката мора да има најмалку 6 карактери")
    private String password;
}
