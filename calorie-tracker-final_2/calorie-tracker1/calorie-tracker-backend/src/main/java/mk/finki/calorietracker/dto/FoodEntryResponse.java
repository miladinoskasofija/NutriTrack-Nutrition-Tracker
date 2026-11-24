package mk.finki.calorietracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodEntryResponse {
    private Long id;
    private String foodName;
    private Double quantity;
    private String unit;
    private String mealType;
    private LocalDateTime consumedAt;
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
