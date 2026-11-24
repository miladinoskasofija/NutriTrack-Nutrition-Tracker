package mk.finki.calorietracker.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.finki.calorietracker.dto.FoodEntryRequest;
import mk.finki.calorietracker.dto.FoodEntryResponse;
import mk.finki.calorietracker.entity.User;
import mk.finki.calorietracker.service.FoodEntryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-entries")
@RequiredArgsConstructor
public class FoodEntryController {

    private final FoodEntryService foodEntryService;

    @PostMapping
    public ResponseEntity<FoodEntryResponse> create(@AuthenticationPrincipal User user, @Valid @RequestBody FoodEntryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(foodEntryService.createEntry(user.getId(), request));
    }

    @GetMapping
    public List<FoodEntryResponse> getAll(@AuthenticationPrincipal User user) {
        return foodEntryService.getAllForUser(user.getId());
    }

    @GetMapping("/today")
    public List<FoodEntryResponse> getToday(@AuthenticationPrincipal User user) {
        return foodEntryService.getTodayForUser(user.getId());
    }
}
