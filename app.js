const state = {
  role: "student",
  user: null,
  concepts: [],
  currentQuiz: null,
  dashboard: null,
};

const SESSION_KEY = "edutwin.session";

const LANGUAGE_TO_SPEECH = {
  en: "en-IN",
  te: "te-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  kn: "kn-IN",
};

const elements = {
  body: document.body,
  apiStatus: document.getElementById("api-status"),
  contrastToggle: document.getElementById("contrast-toggle"),

  roleStudent: document.getElementById("role-student"),
  roleTeacher: document.getElementById("role-teacher"),

  profileForm: document.getElementById("profile-form"),
  nameInput: document.getElementById("name-input"),
  classInput: document.getElementById("class-input"),
  languageInput: document.getElementById("language-input"),
  profileStatus: document.getElementById("profile-status"),

  studentSection: document.getElementById("student-section"),
  teacherSection: document.getElementById("teacher-section"),

  studentConcept: document.getElementById("student-concept"),
  explainForm: document.getElementById("explain-form"),
  studentQuestion: document.getElementById("student-question"),
  explanationOutput: document.getElementById("explanation-output"),
  speakButton: document.getElementById("speak-btn"),

  generateQuizButton: document.getElementById("generate-quiz-btn"),
  quizMeta: document.getElementById("quiz-meta"),
  quizForm: document.getElementById("quiz-form"),
  quizResult: document.getElementById("quiz-result"),

  refreshInsightsButton: document.getElementById("refresh-insights-btn"),
  studentRiskPill: document.getElementById("student-risk-pill"),
  studentInsights: document.getElementById("student-insights"),

  teacherClassInput: document.getElementById("teacher-class-input"),
  loadDashboardButton: document.getElementById("load-dashboard-btn"),
  seedDemoButton: document.getElementById("seed-demo-btn"),
  generateInterventionsButton: document.getElementById("generate-interventions-btn"),
  teacherMetrics: document.getElementById("teacher-metrics"),
  confusionBars: document.getElementById("confusion-bars"),
  atRiskBody: document.getElementById("at-risk-body"),
  interventions: document.getElementById("interventions"),
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const classIdSafe = (value) => slugify(value) || "cse-fy-a";

const riskClass = (riskLevel) => {
  if (riskLevel === "high") return "high";
  if (riskLevel === "medium") return "medium";
  if (riskLevel === "low") return "low";
  return "neutral";
};

const formatDateTime = (isoDate) => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const setApiStatus = (label, tone = "neutral") => {
  elements.apiStatus.textContent = label;
  elements.apiStatus.className = `status-pill ${tone}`;
};

const setProfileStatus = (message, isError = false) => {
  elements.profileStatus.textContent = message;
  elements.profileStatus.style.color = isError ? "#a23414" : "";
};

const persistSession = () => {
  const data = {
    role: state.role,
    user: state.user,
    contrast: elements.body.classList.contains("high-contrast"),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
};

const restoreSession = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    if (parsed?.contrast) {
      elements.body.classList.add("high-contrast");
      elements.contrastToggle.setAttribute("aria-pressed", "true");
    }

    if (parsed?.role === "teacher" || parsed?.role === "student") {
      setRole(parsed.role);
    }

    if (parsed?.user) {
      state.user = parsed.user;
      elements.nameInput.value = parsed.user.name || "";
      elements.classInput.value = parsed.user.classId || "cse-fy-a";
      elements.languageInput.value = parsed.user.language || "en";
      elements.teacherClassInput.value = parsed.user.classId || "cse-fy-a";
      setProfileStatus(`Active ${parsed.user.role}: ${parsed.user.name} (${parsed.user.classId})`);
    }
  } catch (error) {
    localStorage.removeItem(SESSION_KEY);
  }
};

const apiRequest = async (path, options = {}) => {
  const init = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  const response = await fetch(path, init);
  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : {};

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }

  return data;
};

const setRole = (role) => {
  state.role = role;
  const isStudent = role === "student";

  elements.roleStudent.classList.toggle("active", isStudent);
  elements.roleTeacher.classList.toggle("active", !isStudent);
  elements.roleStudent.setAttribute("aria-selected", String(isStudent));
  elements.roleTeacher.setAttribute("aria-selected", String(!isStudent));

  elements.studentSection.classList.toggle("hidden", !isStudent);
  elements.teacherSection.classList.toggle("hidden", isStudent);

  if (!isStudent) {
    elements.teacherClassInput.value = classIdSafe(elements.classInput.value);
  }

  persistSession();
};

const renderConceptOptions = () => {
  const conceptOptions = state.concepts
    .map((concept) => `<option value="${escapeHtml(concept.id)}">${escapeHtml(concept.label)}</option>`)
    .join("");

  elements.studentConcept.innerHTML = conceptOptions;
};

const requireUserRole = (role) => {
  if (!state.user) {
    setProfileStatus("Please sign in first.", true);
    return false;
  }
  if (state.user.role !== role) {
    setProfileStatus(`Current profile is ${state.user.role}. Switch role and sign in again.`, true);
    return false;
  }
  return true;
};

const getSelectedClassId = () => classIdSafe(elements.teacherClassInput.value || elements.classInput.value);

const speakText = (text) => {
  if (!("speechSynthesis" in window)) {
    setProfileStatus("Speech synthesis not supported in this browser.", true);
    return;
  }

  const clean = String(text || "").trim();
  if (!clean) return;

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = LANGUAGE_TO_SPEECH[state.user?.language || "en"] || "en-IN";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

const checkApiHealth = async () => {
  try {
    const data = await apiRequest("/api/health", { method: "GET" });
    const model = data?.model ? ` | ${data.model}` : "";
    setApiStatus(`API Online${model}`, "low");
  } catch (error) {
    setApiStatus("API Offline", "high");
  }
};

const loadConcepts = async () => {
  try {
    const concepts = await apiRequest("/api/concepts", { method: "GET" });
    if (Array.isArray(concepts) && concepts.length) {
      state.concepts = concepts;
      renderConceptOptions();
      return;
    }
  } catch (error) {
    setProfileStatus(`Unable to fetch concepts: ${error.message}`, true);
  }

  state.concepts = [
    { id: "recursion", label: "Recursion" },
    { id: "arrays", label: "Arrays" },
    { id: "binary-search", label: "Binary Search" },
  ];
  renderConceptOptions();
};

const renderQuiz = (quizResponse) => {
  const questionHtml = quizResponse.questions
    .map((question, index) => {
      const optionHtml = question.options
        .map(
          (option, optionIndex) =>
            `<label class="option"><input type="radio" name="q-${escapeHtml(question.id)}" value="${optionIndex}" /> <span>${escapeHtml(option)}</span></label>`
        )
        .join("");

      return `
        <article class="question">
          <small>Q${index + 1} · ${escapeHtml(question.bloom)} · ${escapeHtml(question.difficulty)}</small>
          <p>${escapeHtml(question.stem)}</p>
          <div class="options">${optionHtml}</div>
        </article>
      `;
    })
    .join("");

  elements.quizForm.innerHTML = `${questionHtml}<button class="btn primary" type="submit">Submit Quiz</button>`;
  elements.quizForm.classList.remove("hidden");
};

const renderQuizResult = (submission) => {
  const missed = submission.feedback.filter((entry) => !entry.isCorrect);
  const lines = [
    `Score: ${submission.attempt.scorePercent}% (${submission.attempt.correctCount}/${submission.attempt.totalQuestions})`,
    `Mastery in ${submission.mastery.conceptLabel}: ${submission.mastery.masteryPercent}%`,
    `Risk level: ${submission.mastery.riskLevel}`,
    `Recommendation: ${submission.recommendation}`,
  ];

  if (missed.length) {
    lines.push("", "Review mistakes:");
    missed.slice(0, 3).forEach((entry, idx) => {
      lines.push(`${idx + 1}. ${entry.stem}`);
      lines.push(`   Correct option: ${entry.correctIndex + 1}`);
      lines.push(`   Why: ${entry.explanation}`);
    });
  }

  elements.quizResult.textContent = lines.join("\n");
};

const renderStudentInsights = (insights) => {
  const risk = insights.metrics.riskLevel;
  elements.studentRiskPill.className = `status-pill ${riskClass(risk)}`;
  elements.studentRiskPill.textContent = `Risk: ${risk.toUpperCase()}`;

  const weakHtml = insights.weakTopics.length
    ? insights.weakTopics
        .map(
          (topic) => `
          <article class="insight-card">
            <p><strong>${escapeHtml(topic.conceptLabel)}</strong></p>
            <p>Mastery: ${topic.masteryPercent}%</p>
            <p>Attempts: ${topic.attempts}</p>
          </article>
        `
        )
        .join("")
    : `<article class="insight-card"><p>No weak-topic data yet. Attempt one quiz.</p></article>`;

  const recentHtml = insights.recentScores.length
    ? insights.recentScores
        .map(
          (score) => `
          <article class="insight-card">
            <p><strong>${escapeHtml(score.conceptLabel)}</strong></p>
            <p>Score: ${score.scorePercent}%</p>
            <p>${escapeHtml(formatDateTime(score.submittedAt))}</p>
          </article>
        `
        )
        .join("")
    : `<article class="insight-card"><p>No recent scores yet.</p></article>`;

  elements.studentInsights.innerHTML = `
    <article class="insight-card">
      <p><strong>Quizzes Attempted</strong></p>
      <p>${insights.metrics.attemptedQuizzes}</p>
    </article>
    <article class="insight-card">
      <p><strong>Average Score</strong></p>
      <p>${insights.metrics.averageScore}%</p>
    </article>
    <article class="insight-card">
      <p><strong>Mastery Average</strong></p>
      <p>${insights.metrics.masteryAverage}%</p>
    </article>
    ${weakHtml}
    ${recentHtml}
  `;
};

const loadStudentInsights = async () => {
  if (!requireUserRole("student")) return;
  try {
    const insights = await apiRequest(`/api/student/${encodeURIComponent(state.user.id)}/insights`, { method: "GET" });
    renderStudentInsights(insights);
  } catch (error) {
    elements.studentInsights.innerHTML = `<article class="insight-card"><p>${escapeHtml(error.message)}</p></article>`;
  }
};

const renderTeacherMetrics = (metrics) => {
  const items = [
    ["Total Students", metrics.totalStudents],
    ["Active (7 days)", metrics.activeStudents7d],
    ["Average Score", `${metrics.averageScore}%`],
    ["At Risk", metrics.atRiskCount],
    ["Silent Strugglers", metrics.silentStrugglerCount],
  ];

  elements.teacherMetrics.innerHTML = items
    .map(
      ([label, value]) => `
      <article class="metric">
        <p class="label">${escapeHtml(label)}</p>
        <p class="value">${escapeHtml(String(value))}</p>
      </article>
    `
    )
    .join("");
};

const renderTeacherConfusion = (confusionByConcept) => {
  if (!confusionByConcept.length) {
    elements.confusionBars.innerHTML = `<p class="hint-text">No concept data yet. Seed demo data or wait for quiz submissions.</p>`;
    return;
  }

  elements.confusionBars.innerHTML = confusionByConcept
    .slice(0, 6)
    .map(
      (item) => `
      <div class="bar-row">
        <span>${escapeHtml(item.conceptLabel)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(0, Math.min(item.confusionPercent, 100))}%"></div></div>
        <strong>${item.confusionPercent}%</strong>
      </div>
    `
    )
    .join("");
};

const renderRiskTable = (atRiskStudents) => {
  if (!atRiskStudents.length) {
    elements.atRiskBody.innerHTML = `<tr><td colspan="5">No at-risk students detected from current data.</td></tr>`;
    return;
  }

  elements.atRiskBody.innerHTML = atRiskStudents
    .map(
      (student) => `
      <tr>
        <td>${escapeHtml(student.name)}</td>
        <td><span class="status-pill ${riskClass(student.riskLevel)}">${escapeHtml(student.riskLevel)}</span></td>
        <td>${student.averageMasteryPercent}%</td>
        <td>${escapeHtml(student.weakestConcept)}</td>
        <td>${student.latestScore}%</td>
      </tr>
    `
    )
    .join("");
};

const renderInterventions = (interventions) => {
  if (!interventions.length) {
    elements.interventions.innerHTML = `<p class="hint-text">No interventions generated yet.</p>`;
    return;
  }

  elements.interventions.innerHTML = interventions
    .map(
      (item) => `
      <article class="intervention-card">
        <h4>${escapeHtml(item.title)}</h4>
        <p><strong>Action:</strong> ${escapeHtml(item.action)}</p>
        <p><strong>Why:</strong> ${escapeHtml(item.rationale)}</p>
        <p><strong>Target:</strong> ${escapeHtml(item.target)}</p>
      </article>
    `
    )
    .join("");
};

const loadTeacherDashboard = async () => {
  const classId = getSelectedClassId();
  try {
    const dashboard = await apiRequest(`/api/teacher/${encodeURIComponent(classId)}/dashboard`, { method: "GET" });
    state.dashboard = dashboard;
    renderTeacherMetrics(dashboard.metrics);
    renderTeacherConfusion(dashboard.confusionByConcept || []);
    renderRiskTable(dashboard.atRiskStudents || []);

    if (!elements.interventions.innerHTML.trim()) {
      elements.interventions.innerHTML = `<p class="hint-text">Click “Suggest Interventions” for actionable recommendations.</p>`;
    }
  } catch (error) {
    elements.teacherMetrics.innerHTML = `<article class="metric"><p class="label">Error</p><p class="value">${escapeHtml(
      error.message
    )}</p></article>`;
  }
};

const createOrLoadUser = async (event) => {
  event.preventDefault();

  const payload = {
    name: elements.nameInput.value.trim(),
    classId: classIdSafe(elements.classInput.value),
    language: elements.languageInput.value,
    role: state.role,
  };

  if (!payload.name) {
    setProfileStatus("Name is required.", true);
    return;
  }

  try {
    const result = await apiRequest("/api/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    state.user = result.user;
    elements.classInput.value = state.user.classId;
    elements.teacherClassInput.value = state.user.classId;
    elements.languageInput.value = state.user.language;
    setProfileStatus(`Active ${state.user.role}: ${state.user.name} (${state.user.classId})`);
    persistSession();

    if (state.user.role === "student") {
      await loadStudentInsights();
    } else {
      await loadTeacherDashboard();
    }
  } catch (error) {
    setProfileStatus(error.message, true);
  }
};

const submitExplainRequest = async (event) => {
  event.preventDefault();
  if (!requireUserRole("student")) return;

  const question = elements.studentQuestion.value.trim();
  if (!question) return;

  try {
    elements.explanationOutput.textContent = "Generating explanation...";
    const result = await apiRequest("/api/explain", {
      method: "POST",
      body: JSON.stringify({
        userId: state.user.id,
        conceptId: elements.studentConcept.value,
        question,
        language: state.user.language,
      }),
    });

    elements.explanationOutput.textContent = `Source: ${result.source}\n\n${result.explanation}`;
    elements.speakButton.disabled = false;
  } catch (error) {
    elements.explanationOutput.textContent = `Failed to generate explanation: ${error.message}`;
  }
};

const generateQuiz = async () => {
  if (!requireUserRole("student")) return;
  try {
    elements.quizMeta.textContent = "Generating adaptive quiz...";
    const quiz = await apiRequest("/api/quiz/generate", {
      method: "POST",
      body: JSON.stringify({
        userId: state.user.id,
        conceptId: elements.studentConcept.value,
      }),
    });

    state.currentQuiz = quiz;
    renderQuiz(quiz);
    elements.quizMeta.textContent = `${quiz.conceptLabel} · ${quiz.difficulty} difficulty`;
  } catch (error) {
    elements.quizMeta.textContent = `Quiz generation failed: ${error.message}`;
  }
};

const submitQuiz = async (event) => {
  event.preventDefault();
  if (!state.currentQuiz) return;

  const answers = {};
  state.currentQuiz.questions.forEach((question) => {
    const checked = elements.quizForm.querySelector(`input[name="q-${question.id}"]:checked`);
    if (checked) answers[question.id] = Number(checked.value);
  });

  try {
    const submission = await apiRequest("/api/quiz/submit", {
      method: "POST",
      body: JSON.stringify({
        userId: state.user.id,
        sessionId: state.currentQuiz.sessionId,
        answers,
      }),
    });

    renderQuizResult(submission);
    elements.quizForm.classList.add("hidden");
    elements.quizForm.innerHTML = "";
    state.currentQuiz = null;
    await loadStudentInsights();
  } catch (error) {
    elements.quizResult.textContent = `Quiz submit failed: ${error.message}`;
  }
};

const seedDemoData = async () => {
  const classId = getSelectedClassId();
  try {
    const result = await apiRequest("/api/demo/seed", {
      method: "POST",
      body: JSON.stringify({ classId }),
    });
    setProfileStatus(`Demo seeded: ${result.totalStudents} students in ${classId}`);
    await loadTeacherDashboard();
  } catch (error) {
    setProfileStatus(`Seeding failed: ${error.message}`, true);
  }
};

const suggestInterventions = async () => {
  const classId = getSelectedClassId();
  try {
    const result = await apiRequest(`/api/teacher/${encodeURIComponent(classId)}/interventions`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    renderInterventions(result.interventions || []);
  } catch (error) {
    elements.interventions.innerHTML = `<p class="hint-text">${escapeHtml(error.message)}</p>`;
  }
};

const bindEvents = () => {
  elements.roleStudent.addEventListener("click", () => setRole("student"));
  elements.roleTeacher.addEventListener("click", () => setRole("teacher"));

  elements.contrastToggle.addEventListener("click", () => {
    const active = elements.body.classList.toggle("high-contrast");
    elements.contrastToggle.setAttribute("aria-pressed", String(active));
    persistSession();
  });

  elements.profileForm.addEventListener("submit", createOrLoadUser);
  elements.explainForm.addEventListener("submit", submitExplainRequest);

  elements.speakButton.addEventListener("click", () => {
    const text = elements.explanationOutput.textContent.replace(/^Source:[^\n]*\n\n/, "");
    speakText(text);
  });

  elements.generateQuizButton.addEventListener("click", generateQuiz);
  elements.quizForm.addEventListener("submit", submitQuiz);
  elements.refreshInsightsButton.addEventListener("click", loadStudentInsights);

  elements.loadDashboardButton.addEventListener("click", loadTeacherDashboard);
  elements.seedDemoButton.addEventListener("click", seedDemoData);
  elements.generateInterventionsButton.addEventListener("click", suggestInterventions);
};

const hydrateSessionData = async () => {
  restoreSession();

  if (!state.user) return;

  if (state.user.role === "student") {
    await loadStudentInsights();
  } else {
    await loadTeacherDashboard();
  }
};

const init = async () => {
  bindEvents();
  await Promise.all([checkApiHealth(), loadConcepts()]);
  await hydrateSessionData();
  if (!elements.interventions.innerHTML.trim()) {
    elements.interventions.innerHTML = `<p class="hint-text">Click “Suggest Interventions” to generate actions.</p>`;
  }
};

window.addEventListener("DOMContentLoaded", init);
