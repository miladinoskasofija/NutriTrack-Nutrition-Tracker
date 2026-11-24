package mk.finki.calorietracker.repository;

import mk.finki.calorietracker.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByUserIdAndConversationIdOrderByTimestampAsc(
            Long userId, String conversationId);

    List<ChatMessage> findByUserIdOrderByTimestampDesc(Long userId);
}
