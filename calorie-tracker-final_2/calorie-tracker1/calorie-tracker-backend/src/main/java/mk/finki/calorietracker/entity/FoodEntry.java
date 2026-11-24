package mk.finki.calorietracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "food_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Reference to USDA FoodData Central item (kept for traceability)
    private String fdcId;

    private String foodName;
    private Double quantity;
    private String unit; // g, ml, piece, etc.

    @Enumerated(EnumType.STRING)
    private MealType mealType;

    private LocalDateTime consumedAt = LocalDateTime.now();

    // Snapshotted nutrition values at time of logging
    // (kept even if USDA data changes later, so history stays accurate)
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

    public enum MealType {
        BREAKFAST, LUNCH, DINNER, SNACK
    }
}
