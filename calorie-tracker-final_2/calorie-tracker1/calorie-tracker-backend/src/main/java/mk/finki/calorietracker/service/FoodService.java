package mk.finki.calorietracker.service;

import mk.finki.calorietracker.dto.FoodSearchResultDto;
import mk.finki.calorietracker.exception.ExternalApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** Пребарува намирници преку USDA FoodData Central API и ги мапира во поедноставен формат за frontend-от */
@Service
public class FoodService {

    private final RestTemplate restTemplate;

    @Value("${usda.api.key}")
    private String usdaApiKey;

    @Value("${usda.api.base-url}")
    private String usdaBaseUrl;

    // Nutrient броеви според USDA FoodData Central (стандардни, не се менуваат)
    private static final int NUTRIENT_ID_CALORIES = 1008; // Energy (kcal)
    private static final int NUTRIENT_ID_PROTEIN = 1003;  // Protein
    private static final int NUTRIENT_ID_CARBS = 1005;    // Carbohydrate, by difference
    private static final int NUTRIENT_ID_FAT = 1004;      // Total lipid (fat)
    private static final int NUTRIENT_ID_FIBER = 1079;    // Fiber, total dietary
    private static final int NUTRIENT_ID_SUGAR = 2000;    // Total sugars
    private static final int NUTRIENT_ID_SODIUM = 1093;   // Sodium
    private static final int NUTRIENT_ID_POTASSIUM = 1092; // Potassium
    private static final int NUTRIENT_ID_CALCIUM = 1087;  // Calcium
    private static final int NUTRIENT_ID_IRON = 1089;     // Iron
    private static final int NUTRIENT_ID_VITAMIN_C = 1162; // Vitamin C

    public FoodService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @SuppressWarnings("unchecked")
    public List<FoodSearchResultDto> search(String query) {
        if (usdaApiKey == null || usdaApiKey.isBlank() || usdaApiKey.startsWith("PLACEHOLDER")) {
            throw new ExternalApiException(
                    "USDA API клучот не е конфигуриран. Стави го вистинскиот клуч во application.properties (usda.api.key).", null);
        }

        try {
            String url = UriComponentsBuilder.fromHttpUrl(usdaBaseUrl + "/foods/search")
                    .queryParam("query", query)
                    .queryParam("pageSize", 15)
                    .queryParam("api_key", usdaApiKey)
                    .toUriString();

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response == null || !response.containsKey("foods")) {
                return List.of();
            }

            List<Map<String, Object>> foods = (List<Map<String, Object>>) response.get("foods");
            List<FoodSearchResultDto> results = new ArrayList<>();

            for (Map<String, Object> food : foods) {
                String fdcId = String.valueOf(food.get("fdcId"));
                String description = (String) food.get("description");
                List<Map<String, Object>> nutrients = (List<Map<String, Object>>) food.get("foodNutrients");

                Double calories = extractNutrientValue(nutrients, NUTRIENT_ID_CALORIES);
                Double protein = extractNutrientValue(nutrients, NUTRIENT_ID_PROTEIN);
                Double carbs = extractNutrientValue(nutrients, NUTRIENT_ID_CARBS);
                Double fat = extractNutrientValue(nutrients, NUTRIENT_ID_FAT);
                Double fiber = extractNutrientValue(nutrients, NUTRIENT_ID_FIBER);
                Double sugar = extractNutrientValue(nutrients, NUTRIENT_ID_SUGAR);
                Double sodium = extractNutrientValue(nutrients, NUTRIENT_ID_SODIUM);
                Double potassium = extractNutrientValue(nutrients, NUTRIENT_ID_POTASSIUM);
                Double calcium = extractNutrientValue(nutrients, NUTRIENT_ID_CALCIUM);
                Double iron = extractNutrientValue(nutrients, NUTRIENT_ID_IRON);
                Double vitaminC = extractNutrientValue(nutrients, NUTRIENT_ID_VITAMIN_C);

                results.add(new FoodSearchResultDto(
                        fdcId, description, calories, protein, carbs, fat,
                        fiber, sugar, sodium, potassium, calcium, iron, vitaminC
                ));
            }

            return results;
        } catch (Exception e) {
            throw new ExternalApiException("Не можев да ги вчитам податоците од USDA FoodData Central.", e);
        }
    }

    @SuppressWarnings("unchecked")
    private Double extractNutrientValue(List<Map<String, Object>> nutrients, int nutrientId) {
        if (nutrients == null) return 0.0;
        for (Map<String, Object> nutrient : nutrients) {
            Object nutrientIdObj = nutrient.get("nutrientId");
            if (nutrientIdObj != null && nutrientId == ((Number) nutrientIdObj).intValue()) {
                Object value = nutrient.get("value");
                return value != null ? ((Number) value).doubleValue() : 0.0;
            }
        }
        return 0.0;
    }
}