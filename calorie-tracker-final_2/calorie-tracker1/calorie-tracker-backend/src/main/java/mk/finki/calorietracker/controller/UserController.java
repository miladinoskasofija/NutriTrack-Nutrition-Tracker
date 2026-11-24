package mk.finki.calorietracker.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.finki.calorietracker.dto.UpdateGoalsRequest;
import mk.finki.calorietracker.dto.UserProfileResponse;
import mk.finki.calorietracker.entity.User;
import mk.finki.calorietracker.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserProfileResponse getMe(@AuthenticationPrincipal User user) {
        return userService.getProfile(user.getId());
    }

    @PutMapping("/me")
    public UserProfileResponse updateMe(@AuthenticationPrincipal User user, @Valid @RequestBody UpdateGoalsRequest request) {
        return userService.updateGoals(user.getId(), request);
    }
}
