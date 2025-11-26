package calm.ai.Model;

import lombok.Getter;

@Getter
public class Questions {
    // Getters are usually needed for Spring Boot to serialize this to JSON
    String ques;
    String opt1;
    String opt2;
    String opt3;
    String opt4;

    public Questions(String ques, String opt1, String opt2, String opt3, String opt4) {
        this.ques = ques;
        this.opt1 = opt1;
        this.opt2 = opt2;
        this.opt3 = opt3;
        this.opt4 = opt4;
    }

}