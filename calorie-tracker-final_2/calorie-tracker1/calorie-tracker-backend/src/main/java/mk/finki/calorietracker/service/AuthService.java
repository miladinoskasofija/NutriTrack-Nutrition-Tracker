package mk.finki.calorietracker.service;

import lombok.RequiredArgsConstructor;
import mk.finki.calorietracker.dto.AuthResponse;
import mk.finki.calorietracker.dto.LoginRequest;
import mk.finki.calorietracker.dto.RegisterRequest;
import mk.finki.calorietracker.entity.User;
import mk.finki.calorietracker.exception.EmailAlreadyExistsException;
import mk.finki.calorietracker.exception.InvalidCredentialsException;
import mk.finki.calorietracker.repository.UserRepository;
import mk.finki.calorietracker.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Веќе постои профил со тој email.");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new EmailAlreadyExistsException("Веќе постои профил со тоа корисничко име.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Погрешен email или лозинка."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Погрешен email или лозинка.");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }
}
