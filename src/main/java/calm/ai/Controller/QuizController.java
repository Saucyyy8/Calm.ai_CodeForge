package calm.ai.Controller;

import calm.ai.Model.Questions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    static final List<Questions> quizList = new ArrayList<>();
    private final WebClient webClient;

    @Value("${recommender.service.mood-url}")
    private String moodWebhookUrl;

    @Value("${recommender.service.music-url}")
    private String musicRecommenderUrl;

    @Value("${recommender.service.book-url}")
    private String bookRecommenderUrl;

    @Value("${recommender.service.chat-url}")
    private String chatUrl;

    public QuizController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @PostConstruct
    public void init() {
        if (quizList.isEmpty()) {
            // Question 1: Physical Sensation
            quizList.add(new Questions(
                    "If you could describe how your body feels right now in one word, what would it be?",
                    "Light and buzzing", // High Energy
                    "Heavy and slow", // Low Energy/Depression
                    "Tense and tight", // Anxiety
                    "Numb or hollow" // Apathy
            ));

            // Question 2: Weather Metaphor
            quizList.add(new Questions(
                    "If your mind was a weather forecast right now, what would it look like?",
                    "Clear blue skies",
                    "Constant grey rain",
                    "A chaotic thunderstorm",
                    "Thick, heavy fog"));

            // Question 3: Social Battery
            quizList.add(new Questions(
                    "Your phone rings. It’s a friend asking to hang out. What is your immediate gut reaction?",
                    "Yes! I need to see people.",
                    "Maybe later, but not right now.",
                    "Please don't make me talk to anyone.",
                    "I want to go, but I'm too worried about what to say."));

            // Question 4: Focus / Motivation
            quizList.add(new Questions(
                    "You have a small task to do. How does that feel?",
                    "Easy, I'll get it done now.",
                    "It feels like climbing a mountain.",
                    "I have too many thoughts to focus on just one thing.",
                    "It doesn't matter anyway."));

            // Question 5: Sleep Patterns
            quizList.add(new Questions(
                    "How has your sleep been lately?",
                    "Restful and normal.",
                    "I want to sleep all the time / hard to wake up.",
                    "My mind races and I can't fall asleep.",
                    "Broken and restless."));

            // Question 6: The Core Desire
            quizList.add(new Questions(
                    "If you could press a button to change one thing right now, what would it be?",
                    "To feel more energy.",
                    "To stop the racing thoughts.",
                    "To feel something (I feel empty).",
                    "To just have someone listen to me."));
        }
    }

    @GetMapping()
    public ResponseEntity<List<Questions>> quiz() {
        return ResponseEntity.ok(quizList);
    }

    @PostMapping()
    public Mono<ResponseEntity<Map>> getResponse(@RequestBody List<String> selectedOptions) {
        if (selectedOptions.size() < 6) {
            Map<String, String> error = Map.of("Error", "Number of elements are less than 6");
            return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error));
        }

        Map<String, String> map = new HashMap<>();
        int index = 0;
        for (String opt : selectedOptions) {
            map.put(quizList.get(index).getQues(), opt);
            index++;
        }

        return webClient.post()
                .uri(moodWebhookUrl)
                .bodyValue(map)
                .retrieve()
                .bodyToMono(Map.class)
                .map(ResponseEntity::ok);
    }

    // The client is now responsible for sending the mood back
    @PostMapping("/music")
    public Mono<ResponseEntity<Map>> getMusicRecommendation(@RequestBody Map<String, String> mood) {
        if (mood == null) {
            return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("Error", "Mood must be provided in the request body.")));
        }
        return webClient.post()
                .uri(musicRecommenderUrl)
                .bodyValue(mood)
                .retrieve()
                .bodyToMono(Map.class)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/book")
    public Mono<ResponseEntity<Map>> getBookRecommendation(@RequestBody Map<String, String> mood) {
        if (mood == null) {
            return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("Error", "Mood must be provided in the request body.")));
        }
        return webClient.post()
                .uri(bookRecommenderUrl)
                .bodyValue(mood)
                .retrieve()
                .bodyToMono(Map.class)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/chat")
    public Mono<ResponseEntity<Object>> chat(@RequestBody Map<String, String> payload) {
        return webClient.post()
                .uri(chatUrl)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.ok(Map.of("text", "No response from AI agent.")));
    }
}
