package calm.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.web.reactive.function.client.WebClient webClient() {
		return org.springframework.web.reactive.function.client.WebClient.builder().build();
	}
}
