package com.quizmaster.controller;

import com.quizmaster.model.QuizRequest;
import com.quizmaster.model.QuizResponse;
import com.quizmaster.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@Controller
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @PostMapping("/api/generate")
    @ResponseBody
    public ResponseEntity<QuizResponse> generateQuiz(@RequestBody QuizRequest request) {
        QuizResponse response = quizService.generateQuiz(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/api/topics")
    @ResponseBody
    public ResponseEntity<List<String>> getTopics() {
        List<String> topics = Arrays.asList(
            "Java", "Python", "JavaScript", "TypeScript", "C++", "Go", "Rust",
            "Arrays", "Linked Lists", "Trees", "Graphs", "Dynamic Programming",
            "Spring Boot", "React", "Angular", "Node.js", "Docker", "Kubernetes",
            "SQL", "MongoDB", "Redis", "Microservices", "REST APIs",
            "Design Patterns", "System Design", "Algorithms", "Data Structures",
            "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
            "Networking", "Operating Systems", "Linux", "Security", "Cloud AWS",
            "Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography"
        );
        return ResponseEntity.ok(topics);
    }
}
