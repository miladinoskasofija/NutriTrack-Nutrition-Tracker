package mk.finki.calorietracker.service;

import lombok.RequiredArgsConstructor;
import mk.finki.calorietracker.dto.FoodEntryRequest;
import mk.finki.calorietracker.dto.FoodEntryResponse;
import mk.finki.calorietracker.entity.FoodEntry;
import mk.finki.calorietracker.entity.User;
import mk.finki.calorietracker.exception.ResourceNotFoundException;
import mk.finki.calorietracker.repository.FoodEntryRepository;
import mk.finki.calorietracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodEntryService {

    private final FoodEntryRepository foodEntryRepository;
    private final UserRepository userRepository;

    public FoodEntryResponse createEntry(Long userId, FoodEntryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Корисникот не е пронајден."));

        FoodEntry entry = new FoodEntry();
        entry.setUser(user);
        entry.setFdcId(request.getFdcId());
        entry.setFoodName(request.getFoodName());
        entry.setQuantity(request.getQuantity());
        entry.setUnit(request.getUnit());
        entry.setMealType(FoodEntry.MealType.valueOf(request.getMealType()));
        entry.setConsumedAt(LocalDateTime.now());
        entry.setCalories(request.getCalories());
        entry.setProtein(request.getProtein());
        entry.setCarbs(request.getCarbs());
        entry.setFat(request.getFat());
        entry.setFiber(request.getFiber());
        entry.setSugar(request.getSugar());
        entry.setSodium(request.getSodium());
        entry.setPotassium(request.getPotassium());
        entry.setCalcium(request.getCalcium());
        entry.setIron(request.getIron());
        entry.setVitaminC(request.getVitaminC());

        FoodEntry saved = foodEntryRepository.save(entry);
        return toResponse(saved);
    }

    public List<FoodEntryResponse> getAllForUser(Long userId) {
        return foodEntryRepository.findByUserIdOrderByConsumedAtDesc(userId)
                .stream().map(this::toResponse).toList();
    }

    public List<FoodEntryResponse> getTodayForUser(Long userId) {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDateTime.now().toLocalDate(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDateTime.now().toLocalDate(), LocalTime.MAX);
        return foodEntryRepository.findByUserIdAndConsumedAtBetween(userId, startOfDay, endOfDay)
                .stream().map(this::toResponse).toList();
    }

    private FoodEntryResponse toResponse(FoodEntry entry) {
        return new FoodEntryResponse(
                entry.getId(),
                entry.getFoodName(),
                entry.getQuantity(),
                entry.getUnit(),
                entry.getMealType().name(),
                entry.getConsumedAt(),
                entry.getCalories(),
                entry.getProtein(),
                entry.getCarbs(),
                entry.getFat(),
                entry.getFiber(),
                entry.getSugar(),
                entry.getSodium(),
                entry.getPotassium(),
                entry.getCalcium(),
                entry.getIron(),
                entry.getVitaminC()
        );
    }
}
