package mk.finki.calorietracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private Role role; // USER or ASSISTANT

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime timestamp = LocalDateTime.now();

    // Groups messages into separate conversations/sessions
    private String conversationId;

    public enum Role {
        USER, ASSISTANT
    }
}
