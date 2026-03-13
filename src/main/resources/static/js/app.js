// ==============================
// QUIZMASTER AI - Application
// ==============================

const state = {
    selectedType: 'programming',
    selectedLevel: 'medium',
    selectedTopics: ['arrays', 'strings'],
    questionCount: 5,
    questions: [],
    currentIndex: 0,
    answers: [],
    score: 0,
};

const ALL_TOPICS = [
    'Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'Go', 'Rust',
    'Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming',
    'Spring Boot', 'React', 'Angular', 'Node.js', 'Docker', 'Kubernetes',
    'SQL', 'MongoDB', 'Redis', 'Microservices', 'REST APIs',
    'Design Patterns', 'System Design', 'Algorithms', 'Data Structures',
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
    'Networking', 'Operating Systems', 'Linux', 'Security', 'Cloud AWS',
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'
];

// ===================================================
// CODE FORMATTING & SYNTAX HIGHLIGHTING
// ===================================================

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Apply syntax highlighting to already-escaped HTML code string
function syntaxHighlight(code) {
    // Order matters: comments first, then strings, then keywords etc.
    return code
        // Comments
        .replace(/(\/\/[^\n]*)/g, '<span class="sh-comment">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="sh-comment">$1</span>')
        // Strings
        .replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g, '<span class="sh-string">$1</span>')
        // Keywords
        .replace(/\b(public|private|protected|class|static|void|int|double|float|long|boolean|char|byte|short|String|new|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|import|package|extends|implements|interface|abstract|final|null|true|false|this|super|instanceof|var|let|const|def|print|println|override|fun|val|object)\b/g,
                 '<span class="sh-keyword">$1</span>')
        // Numbers (including L, F, D suffixes)
        .replace(/\b(\d+\.?\d*[LlFfDd]?)\b/g, '<span class="sh-number">$1</span>')
        // Method calls  word(
        .replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="sh-method">$1</span>')
        // Annotations
        .replace(/(@\w+)/g, '<span class="sh-annotation">$1</span>');
}

// Parse question text: convert ```code``` and `inline` to HTML
function formatQuestionText(rawText) {
    let html = escapeHtml(rawText);

    // Fenced code blocks  ```lang\n code \n```
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, function(_, lang, code) {
        const highlighted = syntaxHighlight(code.trim());
        const langLabel   = lang ? '<span class="code-lang">' + lang.toUpperCase() + '</span>' : '';
        return '<div class="code-wrapper">' + langLabel +
               '<pre class="code-block"><code>' + highlighted + '</code></pre></div>';
    });

    // Inline `code`
    html = html.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>');

    // If question contains raw Java/code patterns but no fences,
    // auto-detect and wrap (looks for class/public/void patterns)
    if (!html.includes('code-block') && /\b(class|public|void|System\.out|def |function |SELECT |FROM )\b/.test(html)) {
        // Try to find the code portion: everything after a newline that looks like code
        html = html.replace(/(\n)([ \t][\s\S]+)$/, function(_, nl, codeBlock) {
            const highlighted = syntaxHighlight(codeBlock);
            return nl + '<div class="code-wrapper"><pre class="code-block"><code>' +
                   highlighted + '</code></pre></div>';
        });
    }

    // Convert remaining newlines to <br> (outside code blocks)
    // Split on code-wrapper divs, only convert \n in text parts
    const parts = html.split(/(<div class="code-wrapper">[\s\S]*?<\/div>)/);
    html = parts.map(function(part, i) {
        if (i % 2 === 0) return part.replace(/\n/g, '<br>');
        return part;
    }).join('');

    return html;
}

// ===================================================
// SECTION NAVIGATION
// ===================================================

function showSection(name) {
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.pill').forEach(function(p) { p.classList.remove('active'); });
    document.getElementById('section-' + name).classList.add('active');
    var pills = document.querySelectorAll('.pill');
    var map = { 'generate': 0, 'quiz': 1, 'results': 2 };
    if (map[name] !== undefined) pills[map[name]].classList.add('active');
}

function selectType(card) {
    document.querySelectorAll('.type-card').forEach(function(c) { c.classList.remove('active'); });
    card.classList.add('active');
    state.selectedType = card.dataset.value;
}

function selectLevel(btn) {
    document.querySelectorAll('.level-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    state.selectedLevel = btn.dataset.value;
}

function adjustCount(delta) {
    state.questionCount = Math.max(1, Math.min(20, state.questionCount + delta));
    document.getElementById('countDisplay').textContent = state.questionCount;
}

// ===================================================
// TOPICS
// ===================================================

function filterTopics(query) {
    var dropdown = document.getElementById('topicsDropdown');
    if (!query.trim()) { dropdown.classList.remove('show'); return; }
    var filtered = ALL_TOPICS.filter(function(t) {
        return t.toLowerCase().includes(query.toLowerCase()) &&
               !state.selectedTopics.includes(t.toLowerCase());
    }).slice(0, 10);
    dropdown.innerHTML = filtered.map(function(t) {
        return '<div class="topic-option" onclick="addTopic(\'' + t + '\')">' + t + '</div>';
    }).join('');
    dropdown.classList.toggle('show', filtered.length > 0);
}

function addTopic(topic) {
    if (!state.selectedTopics.includes(topic.toLowerCase())) {
        state.selectedTopics.push(topic.toLowerCase());
        renderSelectedTopics();
    }
    document.getElementById('topicSearch').value = '';
    document.getElementById('topicsDropdown').classList.remove('show');
}

function removeTopic(chip) {
    state.selectedTopics = state.selectedTopics.filter(function(t) { return t !== chip.dataset.value; });
    renderSelectedTopics();
}

function renderSelectedTopics() {
    document.getElementById('selectedTopics').innerHTML = state.selectedTopics.map(function(t) {
        return '<span class="topic-chip active" data-value="' + t + '" onclick="removeTopic(this)">' +
               t.charAt(0).toUpperCase() + t.slice(1) + ' ×</span>';
    }).join('');
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.topics-input-wrap'))
        document.getElementById('topicsDropdown').classList.remove('show');
});

// ===================================================
// GENERATE QUIZ
// ===================================================

async function generateQuiz() {
    var btn     = document.getElementById('generateBtn');
    btn.querySelector('.btn-text').classList.add('hidden');
    btn.querySelector('.btn-loading').classList.remove('hidden');
    btn.disabled = true;

    var payload = {
        type:         state.selectedType,
        level:        state.selectedLevel,
        topics:       state.selectedTopics.length > 0 ? state.selectedTopics : ['general knowledge'],
        count:        state.questionCount,
        customPrompt: document.getElementById('customPrompt').value.trim() || null
    };

    try {
        var res  = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        var data = await res.json();

        if (!res.ok || !data.success) {
            showError(data.errorMessage || 'Failed to generate quiz. Check your API key.');
            return;
        }

        state.questions    = data.questions;
        state.currentIndex = 0;
        state.score        = 0;
        state.answers      = new Array(data.questions.length).fill(null);

        document.getElementById('quizTopic').textContent       = data.topic || payload.topics.join(', ');
        document.getElementById('quizLevel').textContent       = (data.level || state.selectedLevel).toUpperCase();
        document.getElementById('totalQ').textContent          = data.questions.length;
        document.getElementById('progressFill').style.width    = '0%';

        showSection('quiz');
        renderQuestion();

    } catch (err) {
        showError('Network error. Is the server running?');
        console.error(err);
    } finally {
        btn.querySelector('.btn-text').classList.remove('hidden');
        btn.querySelector('.btn-loading').classList.add('hidden');
        btn.disabled = false;
    }
}

// ===================================================
// RENDER QUESTION
// No correct/wrong shown here — only neutral "picked" border.
// ===================================================

function renderQuestion() {
    var q   = state.questions[state.currentIndex];
    var idx = state.currentIndex;

    document.getElementById('currentQ').textContent    = idx + 1;
    document.getElementById('questionNum').textContent = 'Q' + (idx + 1);

    // Use innerHTML so code blocks render properly
    document.getElementById('questionText').innerHTML  = formatQuestionText(q.question);

    document.getElementById('progressFill').style.width = (idx / state.questions.length * 100) + '%';

    var saved = state.answers[idx]; // null = unanswered
    var keys  = ['A', 'B', 'C', 'D'];
    var html  = '';

    q.options.forEach(function(opt, i) {
        // ONLY neutral "picked" class — no correct/wrong ever shown during quiz
        var cls      = 'option-btn' + (opt === saved ? ' picked' : '');
        var disabled = saved !== null ? 'disabled' : '';
        html += '<button class="' + cls + '" ' + disabled + ' onclick="pickAnswer(' + i + ')">' +
                '<span class="option-key">' + keys[i] + '</span>' +
                '<span>' + escapeHtml(opt) + '</span>' +
                '</button>';
    });

    document.getElementById('optionsGrid').innerHTML = html;
    document.getElementById('nextBtn').textContent   =
        idx === state.questions.length - 1 ? 'Finish Quiz ✦' : 'Next →';
}

// ===================================================
// PICK ANSWER — silently records, no feedback shown
// ===================================================

function pickAnswer(optionIndex) {
    var idx = state.currentIndex;
    if (state.answers[idx] !== null) return;

    var chosen = state.questions[idx].options[optionIndex];
    state.answers[idx] = chosen;

    if (chosen === state.questions[idx].answer) {
        state.score++; // tracked silently, never shown during quiz
    }

    renderQuestion(); // re-render: only "picked" neutral border added
}

// ===================================================
// NAVIGATION
// ===================================================

function nextQuestion() {
    if (state.answers[state.currentIndex] === null) {
        showError('Please select an answer before continuing.');
        return;
    }
    if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex++;
        renderQuestion();
    } else {
        showResults();
    }
}

function prevQuestion() {
    if (state.currentIndex > 0) {
        state.currentIndex--;
        renderQuestion();
    }
}

// ===================================================
// SHOW RESULTS — first time anything correct/wrong is shown
// ===================================================

function showResults() {
    var total   = state.questions.length;
    var correct = state.score;
    var pct     = Math.round((correct / total) * 100);

    document.getElementById('scorePercent').textContent = pct + '%';
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('wrongCount').textContent   = total - correct;
    document.getElementById('totalCount').textContent   = total;
    document.getElementById('progressFill').style.width = '100%';

    // Animate score arc
    var arc = document.getElementById('scoreArc');
    arc.style.transition       = 'none';
    arc.style.strokeDashoffset = '439.8';
    setTimeout(function() {
        arc.style.transition       = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';
        arc.style.strokeDashoffset = 439.8 - (439.8 * pct / 100);
    }, 300);

    var titles = [
        [90, '🏆 Outstanding!',  'Exceptional! You mastered this topic completely.'],
        [70, '🎯 Great Job!',     'Strong performance — almost perfect!'],
        [50, '📚 Good Effort!',   'Solid base. A bit more practice will help.'],
        [ 0, '💡 Keep Learning!', "Don't give up! Review and try again."]
    ];
    var found = titles.find(function(t) { return pct >= t[0]; });
    document.getElementById('resultsTitle').textContent    = found[1];
    document.getElementById('resultsSubtitle').textContent = found[2];

    // Build review — correct/wrong revealed HERE for the first time
    var reviewHTML = '';
    state.questions.forEach(function(q, i) {
        var ua        = state.answers[i] || 'Unanswered';
        var isCorrect = ua === q.answer;
        reviewHTML +=
            '<div class="review-item ' + (isCorrect ? 'correct-review' : 'wrong-review') + '">' +
            '<div class="review-q">' + (i + 1) + '. ' +
            formatQuestionText(q.question) +          // code formatted in review too
            '</div>' +
            '<div class="review-answers">' +
            '<span class="review-your' + (!isCorrect ? ' wrong-ans' : '') + '">Your answer: ' + escapeHtml(ua) + '</span>' +
            (!isCorrect ? '<span class="review-correct">Correct answer: ' + escapeHtml(q.answer) + '</span>' : '') +
            '</div></div>';
    });
    document.getElementById('reviewList').innerHTML = reviewHTML;

    showSection('results');
}

// ===================================================
// RETAKE / EXPORT
// ===================================================

function retakeQuiz() {
    state.currentIndex = 0;
    state.score        = 0;
    state.answers      = new Array(state.questions.length).fill(null);
    var arc = document.getElementById('scoreArc');
    arc.style.transition       = 'none';
    arc.style.strokeDashoffset = '439.8';
    document.getElementById('progressFill').style.width = '0%';
    showSection('quiz');
    renderQuestion();
}

function exportResults() {
    var total = state.questions.length;
    var pct   = Math.round((state.score / total) * 100);
    var text  = 'QUIZMASTER AI — RESULTS\n' + '='.repeat(40) + '\n' +
                'Score: ' + state.score + '/' + total + ' (' + pct + '%)\n\n';
    state.questions.forEach(function(q, i) {
        var ua = state.answers[i] || 'None';
        text += 'Q' + (i + 1) + ': ' + q.question + '\n' +
                '  Your Answer: ' + ua + (ua === q.answer ? ' ✓' : ' ✗') + '\n' +
                (ua !== q.answer ? '  Correct: ' + q.answer + '\n' : '') + '\n';
    });
    var a    = document.createElement('a');
    a.href   = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = 'quiz-results-' + Date.now() + '.txt';
    a.click();
}

// ===================================================
// TOAST / INIT
// ===================================================

function showError(msg) {
    var toast = document.getElementById('errorToast');
    document.getElementById('toastMessage').textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(function() { toast.classList.add('hidden'); }, 4000);
}

document.addEventListener('DOMContentLoaded', function() {
    renderSelectedTopics();
});
