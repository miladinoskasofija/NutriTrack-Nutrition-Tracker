package mk.finki.calorietracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Daily nutrition goals
    private Double dailyCalorieGoal = 2000.0;
    private Double dailyProteinGoal = 120.0;
    private Double dailyCarbGoal = 220.0;
    private Double dailyFatGoal = 65.0;
}
