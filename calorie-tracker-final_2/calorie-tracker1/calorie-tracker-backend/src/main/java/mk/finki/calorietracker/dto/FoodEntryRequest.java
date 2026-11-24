package mk.finki.calorietracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class FoodEntryRequest {
    private String fdcId;

    @NotBlank(message = "Името на намирницата е задолжително")
    private String foodName;

    @NotNull
    @Positive(message = "Количината мора да е позитивен број")
    private Double quantity;

    @NotBlank
    private String unit;

    @NotBlank
    private String mealType; // BREAKFAST, LUNCH, DINNER, SNACK

    @NotNull
    private Double calories;
    private Double protein;
    private Double carbs;
    private Double fat;
    private Double fiber;
    private Double sugar;
    private Double sodium;
    private Double potassium;
    private Double calcium;
    private Double iron;
    private Double vitaminC;
}
