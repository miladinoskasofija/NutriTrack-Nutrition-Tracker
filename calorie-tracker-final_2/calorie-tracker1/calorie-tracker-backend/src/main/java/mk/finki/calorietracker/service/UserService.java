package mk.finki.calorietracker.service;

import lombok.RequiredArgsConstructor;
import mk.finki.calorietracker.dto.UpdateGoalsRequest;
import mk.finki.calorietracker.dto.UserProfileResponse;
import mk.finki.calorietracker.entity.User;
import mk.finki.calorietracker.exception.ResourceNotFoundException;
import mk.finki.calorietracker.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getProfile(Long userId) {
        User user = findUser(userId);
        return toResponse(user);
    }

    public UserProfileResponse updateGoals(Long userId, UpdateGoalsRequest request) {
        User user = findUser(userId);
        user.setDailyCalorieGoal(request.getDailyCalorieGoal());
        user.setDailyProteinGoal(request.getDailyProteinGoal());
        user.setDailyCarbGoal(request.getDailyCarbGoal());
        user.setDailyFatGoal(request.getDailyFatGoal());
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Корисникот не е пронајден."));
    }

    private UserProfileResponse toResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDailyCalorieGoal(),
                user.getDailyProteinGoal(),
                user.getDailyCarbGoal(),
                user.getDailyFatGoal()
        );
    }
}
