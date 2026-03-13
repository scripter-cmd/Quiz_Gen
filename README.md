# 🧠 QuizMaster AI — Spring Boot Quiz Generator

A production-grade Spring Boot application that uses **Google Gemini 2.5 Flash** to generate intelligent multiple-choice quizzes on any topic.

## ✨ Features

- **AI-Powered Generation** — Google Gemini 2.5 Flash creates perfectly crafted questions
- **6 Quiz Categories** — Programming, Mathematics, Science, History, General, Technology
- **Custom Prompts** — Full control with free-form prompt input
- **Topic Search** — 40+ preset topics with searchable dropdown
- **4 Difficulty Levels** — Easy, Medium, Hard, Expert
- **Live Quiz Mode** — Interactive question-by-question quiz with instant feedback
- **Detailed Results** — Score circle animation, full question review
- **Export Results** — Download quiz results as text file
- **Retake Quiz** — Retry the same quiz as many times as you want

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- Google Gemini API Key ([get one free](https://aistudio.google.com/))

### Setup

1. **Clone and enter the project:**
   ```bash
   cd quizmaster
   ```

2. **Set your Gemini API Key** (choose one method):

   **Option A — Environment Variable (recommended):**
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   ```

   **Option B — Edit application.properties:**
   ```properties
   gemini.api.key=your_api_key_here
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

4. **Open your browser:**
   ```
   http://localhost:8080
   ```

## 📁 Project Structure

```
quizmaster/
├── pom.xml
└── src/main/
    ├── java/com/quizmaster/
    │   ├── QuizMasterApplication.java     # Entry point
    │   ├── controller/
    │   │   └── QuizController.java        # REST + MVC endpoints
    │   ├── service/
    │   │   └── QuizService.java           # Business logic + prompt builder
    │   ├── client/
    │   │   └── GeminiClient.java          # Gemini API HTTP client
    │   └── model/
    │       ├── Question.java
    │       ├── QuizRequest.java
    │       └── QuizResponse.java
    └── resources/
        ├── application.properties
        ├── templates/
        │   └── index.html                 # Thymeleaf main page
        └── static/
            ├── css/styles.css             # Massive dark UI styles
            └── js/app.js                  # Frontend logic
```

## 🎨 UI Design

The interface features a **dark futuristic aesthetic** with:
- Animated orb background effects
- Glassmorphism surface layers
- Gradient text and glow effects
- Smooth transitions and micro-animations
- Score circle progress animation
- Responsive design for all screen sizes

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Main application page |
| POST | `/api/generate` | Generate a quiz (JSON) |
| GET | `/api/topics` | List of available topics |

### Generate Request Body
```json
{
  "type": "programming",
  "level": "medium",
  "topics": ["java", "spring boot"],
  "count": 5,
  "customPrompt": null
}
```

## 🛠 Configuration

| Property | Default | Description |
|----------|---------|-------------|
| `gemini.api.url` | Gemini 2.5 Flash URL | API endpoint |
| `gemini.api.key` | `YOUR_API_KEY_HERE` | Your Gemini API key |
| `server.port` | `8080` | Server port |

## 📦 Build

```bash
mvn clean package
java -jar target/quizmaster-1.0.0.jar
```
