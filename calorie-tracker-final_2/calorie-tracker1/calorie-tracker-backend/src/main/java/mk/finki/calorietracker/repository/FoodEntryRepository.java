package mk.finki.calorietracker.repository;

import mk.finki.calorietracker.entity.FoodEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface FoodEntryRepository extends JpaRepository<FoodEntry, Long> {

    List<FoodEntry> findByUserIdOrderByConsumedAtDesc(Long userId);

    List<FoodEntry> findByUserIdAndConsumedAtBetween(
            Long userId, LocalDateTime start, LocalDateTime end);
}
