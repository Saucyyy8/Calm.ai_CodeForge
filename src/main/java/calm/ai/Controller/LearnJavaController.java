package calm.ai.Controller;

import calm.ai.Service.CodeExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/java")
public class LearnJavaController {

    @Autowired
    private CodeExecutionService codeExecutionService;

    @PostMapping("/execute")
    public ResponseEntity<Map<String, Object>> executeCode(@RequestBody Map<String, String> payload) {
        String problemId = payload.get("problemId");
        String code = payload.get("code");

        if (problemId == null || code == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "output", "Missing problemId or code"));
        }

        Map<String, Object> result = codeExecutionService.executeCode(problemId, code);
        return ResponseEntity.ok(result);
    }
}
