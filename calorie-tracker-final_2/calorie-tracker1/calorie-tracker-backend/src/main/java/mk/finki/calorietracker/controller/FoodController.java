package mk.finki.calorietracker.controller;

import lombok.RequiredArgsConstructor;
import mk.finki.calorietracker.dto.FoodSearchResultDto;
import mk.finki.calorietracker.service.FoodService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @GetMapping("/search")
    public List<FoodSearchResultDto> search(@RequestParam String query) {
        return foodService.search(query);
    }
}
