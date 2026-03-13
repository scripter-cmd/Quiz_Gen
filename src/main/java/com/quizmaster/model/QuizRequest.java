package com.quizmaster.model;

import java.util.List;

public class QuizRequest {
    private String type;
    private String level;
    private List<String> topics;
    private int count;
    private String customPrompt;

    public QuizRequest() {}

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public List<String> getTopics() { return topics; }
    public void setTopics(List<String> topics) { this.topics = topics; }

    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }

    public String getCustomPrompt() { return customPrompt; }
    public void setCustomPrompt(String customPrompt) { this.customPrompt = customPrompt; }
}
