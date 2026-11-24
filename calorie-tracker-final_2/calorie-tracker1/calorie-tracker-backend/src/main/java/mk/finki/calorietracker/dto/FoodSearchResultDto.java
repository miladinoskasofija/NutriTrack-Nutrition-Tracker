package mk.finki.calorietracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Резултат од пребарување намирници (USDA FoodData Central), вредности на 100г */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodSearchResultDto {
    private String fdcId;
    private String name;
    private Double calories;
    private Double protein;
    private Double carbs;
    private Double fat;
    // Дополнителни нутриенти (на 100г) - слично на MyFitnessPal Nutrition Facts преглед
    private Double fiber;
    private Double sugar;
    private Double sodium;
    private Double potassium;
    private Double calcium;
    private Double iron;
    private Double vitaminC;
}
