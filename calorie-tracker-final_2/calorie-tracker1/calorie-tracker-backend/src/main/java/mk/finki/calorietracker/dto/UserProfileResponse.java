package mk.finki.calorietracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private Double dailyCalorieGoal;
    private Double dailyProteinGoal;
    private Double dailyCarbGoal;
    private Double dailyFatGoal;
}
