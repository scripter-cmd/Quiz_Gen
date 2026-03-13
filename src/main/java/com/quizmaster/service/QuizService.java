package com.quizmaster.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.quizmaster.client.GeminiClient;
import com.quizmaster.model.Question;
import com.quizmaster.model.QuizRequest;
import com.quizmaster.model.QuizResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuizService {

    @Autowired
    private GeminiClient geminiClient;

    public QuizResponse generateQuiz(QuizRequest request) {
        QuizResponse response = new QuizResponse();
        try {
            String prompt = buildPrompt(request);
            String rawJson = geminiClient.generateContent(prompt);

            // Clean markdown wrappers if any
            rawJson = rawJson.replace("```json", "").replace("```", "").trim();

            List<Question> questions = parseQuestions(rawJson);
            response.setQuestions(questions);
            response.setSuccess(true);
            response.setTotalQuestions(questions.size());
            response.setTopic(request.getTopics() != null ? String.join(", ", request.getTopics()) : "General");
            response.setLevel(request.getLevel());

        } catch (Exception e) {
            response.setSuccess(false);
            response.setErrorMessage("Failed to generate quiz: " + e.getMessage());
        }
        return response;
    }

    private String buildPrompt(QuizRequest request) {
        if (request.getCustomPrompt() != null && !request.getCustomPrompt().isBlank()) {
            return request.getCustomPrompt() + 
                   ". Return strictly in JSON format: { \"questions\": [ { \"question\": \"\", \"options\": [\"\",\"\",\"\",\"\"], \"answer\": \"\" } ] }";
        }

        String topics = request.getTopics() != null ? String.join(", ", request.getTopics()) : "general knowledge";
        int count = request.getCount() > 0 ? request.getCount() : 5;
        String level = request.getLevel() != null ? request.getLevel() : "medium";
        String type = request.getType() != null ? request.getType() : "general";

        return """
            You are an expert Quiz Generator.
            Generate exactly %d %s difficulty %s multiple-choice questions about: %s
            
            Rules:
            - Output MUST be valid JSON only, no extra text
            - Format: { "questions": [ { "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": "A) ..." } ] }
            - Each question must have exactly 4 options labeled A), B), C), D)
            - The answer must exactly match one of the option strings
            - Questions should be clear, educational, and varied
            - No duplicate questions
            - If a question contains code, wrap the code inside the question field using triple backticks with the language name, e.g. ```java\\n code here \\n```
            """.formatted(count, level, type, topics);
    }

    private List<Question> parseQuestions(String json) {
        List<Question> questions = new ArrayList<>();
        try {
            JsonObject root = JsonParser.parseString(json).getAsJsonObject();
            JsonArray questionsArray = root.getAsJsonArray("questions");

            for (JsonElement elem : questionsArray) {
                JsonObject qObj = elem.getAsJsonObject();
                Question q = new Question();
                q.setQuestion(qObj.get("question").getAsString());
                q.setAnswer(qObj.get("answer").getAsString());

                List<String> options = new ArrayList<>();
                JsonArray optionsArray = qObj.getAsJsonArray("options");
                for (JsonElement opt : optionsArray) {
                    options.add(opt.getAsString());
                }
                q.setOptions(options);
                questions.add(q);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse quiz JSON: " + e.getMessage() + "\nRaw: " + json);
        }
        return questions;
    }
}
