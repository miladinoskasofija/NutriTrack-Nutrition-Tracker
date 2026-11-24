package mk.finki.calorietracker.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mk.finki.calorietracker.dto.ChatRequest;
import mk.finki.calorietracker.dto.ChatResponse;
import mk.finki.calorietracker.entity.User;
import mk.finki.calorietracker.service.ChatService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ChatResponse chat(@AuthenticationPrincipal User user, @Valid @RequestBody ChatRequest request) {
        return chatService.sendMessage(user.getId(), request.getMessage());
    }
}
