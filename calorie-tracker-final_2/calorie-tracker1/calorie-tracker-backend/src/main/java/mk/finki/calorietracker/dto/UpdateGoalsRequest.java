package mk.finki.calorietracker.dto;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class UpdateGoalsRequest {
    @PositiveOrZero
    private Double dailyCalorieGoal;

    @PositiveOrZero
    private Double dailyProteinGoal;

    @PositiveOrZero
    private Double dailyCarbGoal;

    @PositiveOrZero
    private Double dailyFatGoal;
}
