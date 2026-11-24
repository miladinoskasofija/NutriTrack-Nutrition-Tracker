package mk.finki.calorietracker.service;

import lombok.RequiredArgsConstructor;
import mk.finki.calorietracker.dto.ChatResponse;
import mk.finki.calorietracker.entity.ChatMessage;
import mk.finki.calorietracker.entity.FoodEntry;
import mk.finki.calorietracker.entity.User;
import mk.finki.calorietracker.exception.ExternalApiException;
import mk.finki.calorietracker.exception.ResourceNotFoundException;
import mk.finki.calorietracker.repository.ChatMessageRepository;
import mk.finki.calorietracker.repository.FoodEntryRepository;
import mk.finki.calorietracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Го проследува прашањето на корисникот до Claude API, заедно со контекст
 * за нивните денешни оброци и нутритивни цели, за персонализирани совети.
 */
@Service
@RequiredArgsConstructor
public class ChatService {

    private final RestTemplate restTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final FoodEntryRepository foodEntryRepository;
    private final UserRepository userRepository;

    @Value("${claude.api.key}")
    private String claudeApiKey;

    @Value("${claude.api.base-url}")
    private String claudeBaseUrl;

    @Value("${claude.api.model}")
    private String claudeModel;

    private static final String CONVERSATION_ID = "default";

    @SuppressWarnings("unchecked")
    public ChatResponse sendMessage(Long userId, String userMessage) {
        if (claudeApiKey == null || claudeApiKey.isBlank() || claudeApiKey.startsWith("PLACEHOLDER")) {
            throw new ExternalApiException(
                "Claude API клучот не е конфигуриран. Стави го вистинскиот клуч во application.properties (claude.api.key).", null);
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Корисникот не е пронајден."));

        // Го зачувуваме прашањето на корисникот
        saveMessage(user, ChatMessage.Role.USER, userMessage);

        String systemPrompt = buildSystemPrompt(user);
        List<ChatMessage> history = chatMessageRepository
                .findByUserIdAndConversationIdOrderByTimestampAsc(userId, CONVERSATION_ID);

        List<Map<String, String>> messages = new ArrayList<>();
        for (ChatMessage msg : history) {
            String role = msg.getRole() == ChatMessage.Role.USER ? "user" : "assistant";
            messages.add(Map.of("role", role, "content", msg.getContent()));
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", claudeApiKey);
            headers.set("anthropic-version", "2023-06-01");

            Map<String, Object> body = Map.of(
                    "model", claudeModel,
                    "max_tokens", 800,
                    "system", systemPrompt,
                    "messages", messages
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            Map<String, Object> response = restTemplate.postForObject(claudeBaseUrl, request, Map.class);

            List<Map<String, Object>> content = (List<Map<String, Object>>) response.get("content");
            String reply = (String) content.get(0).get("text");

            saveMessage(user, ChatMessage.Role.ASSISTANT, reply);
            return new ChatResponse(reply);

        } catch (Exception e) {
            throw new ExternalApiException("AI асистентот моментално не е достапен.", e);
        }
    }

    public List<ChatMessage> getHistory(Long userId) {
        return chatMessageRepository.findByUserIdAndConversationIdOrderByTimestampAsc(userId, CONVERSATION_ID);
    }

    private void saveMessage(User user, ChatMessage.Role role, String content) {
        ChatMessage message = new ChatMessage();
        message.setUser(user);
        message.setRole(role);
        message.setContent(content);
        message.setConversationId(CONVERSATION_ID);
        chatMessageRepository.save(message);
    }

    /** Го гради системскиот промпт со контекст за денешниот внес и целите на корисникот */
    private String buildSystemPrompt(User user) {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDateTime.now().toLocalDate(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDateTime.now().toLocalDate(), LocalTime.MAX);
        List<FoodEntry> todayEntries = foodEntryRepository
                .findByUserIdAndConsumedAtBetween(user.getId(), startOfDay, endOfDay);

        double consumedCalories = todayEntries.stream().mapToDouble(e -> e.getCalories() != null ? e.getCalories() : 0).sum();
        double consumedProtein = todayEntries.stream().mapToDouble(e -> e.getProtein() != null ? e.getProtein() : 0).sum();
        double consumedCarbs = todayEntries.stream().mapToDouble(e -> e.getCarbs() != null ? e.getCarbs() : 0).sum();
        double consumedFat = todayEntries.stream().mapToDouble(e -> e.getFat() != null ? e.getFat() : 0).sum();

        StringBuilder mealsList = new StringBuilder();
        for (FoodEntry entry : todayEntries) {
            mealsList.append("- ").append(entry.getFoodName())
                    .append(" (").append(entry.getMealType()).append("): ")
                    .append(entry.getCalories()).append(" kcal\n");
        }
        if (mealsList.isEmpty()) {
            mealsList.append("Корисникот сè уште нема внесено оброци денес.\n");
        }

        return """
                Ти си пријателски нутритивен асистент во апликација за следење калории, викана NutriTrack.
                Одговарај на македонски јазик, кратко и практично, како искусен нутриционист кој дава
                персонализирани совети - не генерички. Не давај медицински дијагнози; за здравствени
                проблеми препорачај консултација со лекар.

                Контекст за корисникот %s:
                Дневни цели: %.0f kcal, %.0fг протеини, %.0fг јаглехидрати, %.0fг масти

                Досегашен внес денес: %.0f kcal, %.0fг протеини, %.0fг јаглехидрати, %.0fг масти
                Преостанато до целта: %.0f kcal

                Оброци внесени денес:
                %s
                """.formatted(
                user.getUsername(),
                user.getDailyCalorieGoal(), user.getDailyProteinGoal(), user.getDailyCarbGoal(), user.getDailyFatGoal(),
                consumedCalories, consumedProtein, consumedCarbs, consumedFat,
                user.getDailyCalorieGoal() - consumedCalories,
                mealsList
        );
    }
}
