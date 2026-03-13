package com.quizmaster.model;

import java.util.List;

public class QuizResponse {
    private List<Question> questions;
    private boolean success;
    private String errorMessage;
    private String topic;
    private String level;
    private int totalQuestions;

    public QuizResponse() {}

    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) {
        this.questions = questions;
        if (questions != null) {
            for (int i = 0; i < questions.size(); i++) {
                questions.get(i).setQuestionNumber(i + 1);
            }
        }
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
}
