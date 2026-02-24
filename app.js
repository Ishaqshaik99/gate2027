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

const LOCAL_DB_KEY = "edutwin.localdb.v1";
let localFallbackEnabled = window.location.hostname.endsWith("github.io");

const LOCAL_CONCEPTS = [
  { id: "recursion", label: "Recursion", analogy: "nested dolls" },
  { id: "arrays", label: "Arrays", analogy: "numbered lockers" },
  { id: "binary-search", label: "Binary Search", analogy: "dictionary lookup" },
  { id: "sql-joins", label: "SQL Joins", analogy: "matching attendance sheets" },
  { id: "stack", label: "Stack", analogy: "a stack of plates" },
];

const createLocalDb = () => ({
  users: [],
  conceptMastery: [],
  quizSessions: [],
  quizAttempts: [],
});

const localNow = () => new Date().toISOString();
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const randomId = (prefix) => `${prefix}_${Math.random().toString(16).slice(2, 12)}`;

const loadLocalDb = () => {
  const raw = localStorage.getItem(LOCAL_DB_KEY);
  if (!raw) return createLocalDb();
  try {
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      conceptMastery: Array.isArray(parsed.conceptMastery) ? parsed.conceptMastery : [],
      quizSessions: Array.isArray(parsed.quizSessions) ? parsed.quizSessions : [],
      quizAttempts: Array.isArray(parsed.quizAttempts) ? parsed.quizAttempts : [],
    };
  } catch (error) {
    return createLocalDb();
  }
};

const saveLocalDb = (db) => {
  localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(db));
};

const parseBody = (body) => {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (error) {
      return {};
    }
  }
  return body;
};

const findConcept = (conceptId) => LOCAL_CONCEPTS.find((item) => item.id === conceptId) || LOCAL_CONCEPTS[0];

const getMasteryRows = (db, userId) => db.conceptMastery.filter((row) => row.userId === userId);

const getConceptMastery = (db, userId, conceptId) =>
  db.conceptMastery.find((row) => row.userId === userId && row.conceptId === conceptId) || null;

const scoreToRisk = (masteryAverage, recentScoreAverage) => {
  if (masteryAverage < 45 || recentScoreAverage < 45) return "high";
  if (masteryAverage < 65 || recentScoreAverage < 65) return "medium";
  return "low";
};

const userRisk = (db, userId) => {
  const masteryRows = getMasteryRows(db, userId);
  const masteryAverage = masteryRows.length
    ? (masteryRows.reduce((sum, row) => sum + row.mastery, 0) / masteryRows.length) * 100
    : 0;
  const recentScores = db.quizAttempts
    .filter((attempt) => attempt.userId === userId)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 3);
  const recentScoreAverage = recentScores.length
    ? recentScores.reduce((sum, item) => sum + item.scorePercent, 0) / recentScores.length
    : 100;
  return scoreToRisk(masteryAverage, recentScoreAverage);
};

const pickDifficulty = (mastery) => {
  if (mastery < 0.4) return "beginner";
  if (mastery < 0.7) return "intermediate";
  return "advanced";
};

const buildQuestionTemplates = (concept, difficulty) => {
  const lower = concept.label.toLowerCase();
  const templates = {
    beginner: [
      {
        stem: `What best describes ${lower}?`,
        options: [
          `Breaking problems into understandable steps`,
          `Skipping examples and memorizing directly`,
          `Avoiding base rules`,
          `Random trial without logic`,
        ],
        answer: 0,
        bloom: "Understand",
        explanation: "Strong understanding starts with clear step-wise reasoning.",
      },
      {
        stem: `In ${lower}, what should learners check first?`,
        options: ["Boundary/base condition", "UI theme", "Database scaling", "Compiler cache"],
        answer: 0,
        bloom: "Remember",
        explanation: "Boundary/base checks prevent common logic errors.",
      },
      {
        stem: `Which habit improves ${lower} mastery fastest?`,
        options: ["Trace with small examples", "Memorize final answers only", "Skip mistakes", "Avoid feedback"],
        answer: 0,
        bloom: "Apply",
        explanation: "Tracing small examples reveals hidden misunderstandings quickly.",
      },
      {
        stem: `Why use analogy while learning ${lower}?`,
        options: [
          "To connect abstract ideas to familiar context",
          "To replace practice entirely",
          "To avoid reading questions",
          "To remove need for logic",
        ],
        answer: 0,
        bloom: "Understand",
        explanation: "Analogies improve comprehension for first-time learners.",
      },
      {
        stem: `A common beginner error in ${lower} is:`,
        options: ["Ignoring edge cases", "Using comments", "Reading output", "Testing code"],
        answer: 0,
        bloom: "Analyze",
        explanation: "Edge-case checks improve correctness and confidence.",
      },
    ],
    intermediate: [
      {
        stem: `How should you debug errors in ${lower}?`,
        options: [
          "Check assumptions and trace each step",
          "Only re-run same input",
          "Hide outputs and guess",
          "Delete constraints",
        ],
        answer: 0,
        bloom: "Analyze",
        explanation: "Tracing assumptions catches logical mistakes systematically.",
      },
      {
        stem: `What indicates improving proficiency in ${lower}?`,
        options: [
          "Consistent performance on varied problems",
          "Memorizing one solved pattern only",
          "Avoiding timed practice",
          "Ignoring wrong attempts",
        ],
        answer: 0,
        bloom: "Evaluate",
        explanation: "Transfer across varied problems indicates deeper understanding.",
      },
      {
        stem: `In ${lower}, intervention after mistakes should be:`,
        options: [
          "Immediate feedback with one corrected example",
          "No feedback and continue",
          "Only final score",
          "Penalty only",
        ],
        answer: 0,
        bloom: "Apply",
        explanation: "Immediate, specific feedback improves retention.",
      },
      {
        stem: `Best self-check for ${lower} before submission?`,
        options: [
          "Run one normal case and one edge case",
          "Check only formatting",
          "Check only variable names",
          "Skip validation",
        ],
        answer: 0,
        bloom: "Apply",
        explanation: "Both regular and edge-case checks reduce silent failures.",
      },
      {
        stem: `How should teacher support ${lower} confusion?`,
        options: [
          "Use short visual walkthrough + quick quiz",
          "Only assign homework",
          "Skip revision",
          "Increase difficulty immediately",
        ],
        answer: 0,
        bloom: "Create",
        explanation: "Visual explanation plus quick checks improves concept clarity.",
      },
    ],
    advanced: [
      {
        stem: `Advanced learning in ${lower} is best measured by:`,
        options: [
          "Explaining solutions and trade-offs clearly",
          "Speed alone",
          "UI styling quality",
          "Number of tabs opened",
        ],
        answer: 0,
        bloom: "Evaluate",
        explanation: "Advanced mastery includes reasoning and trade-off articulation.",
      },
      {
        stem: `When optimizing ${lower}, prioritize:`,
        options: [
          "Correctness first, then efficiency",
          "Efficiency without correctness",
          "Skipping test cases",
          "Ignoring constraints",
        ],
        answer: 0,
        bloom: "Evaluate",
        explanation: "Optimization should not compromise correctness.",
      },
      {
        stem: `A robust strategy for complex ${lower} problems is:`,
        options: [
          "Decompose, test assumptions, iterate",
          "Memorize one answer format",
          "Avoid uncertainty checks",
          "Bypass reviews",
        ],
        answer: 0,
        bloom: "Create",
        explanation: "Structured decomposition prevents brittle solutions.",
      },
      {
        stem: `Which behavior reflects expert-level ${lower}?`,
        options: [
          "Handling corner cases and explaining decisions",
          "Ignoring weak topics",
          "Copying solutions blindly",
          "Skipping reflection",
        ],
        answer: 0,
        bloom: "Analyze",
        explanation: "Experts explain reasoning and handle edge constraints reliably.",
      },
      {
        stem: `Best intervention for high performers in ${lower}:`,
        options: [
          "Challenge problems + peer teaching",
          "Repeat basics only forever",
          "Reduce feedback",
          "Remove progression",
        ],
        answer: 0,
        bloom: "Create",
        explanation: "Challenge plus teaching others solidifies advanced understanding.",
      },
    ],
  };

  return templates[difficulty].map((item, index) => ({
    id: `${concept.id}-${difficulty}-${index + 1}`,
    stem: item.stem,
    options: item.options,
    answer: item.answer,
    bloom: item.bloom,
    difficulty,
    explanation: item.explanation,
  }));
};

const updateMasteryRecord = (db, userId, conceptId, scorePercent, totalQuestions) => {
  const ratio = clamp(scorePercent / 100, 0, 1);
  const record = getConceptMastery(db, userId, conceptId);
  if (!record) {
    const created = {
      id: randomId("mastery"),
      userId,
      conceptId,
      mastery: ratio,
      attempts: 1,
      totalQuestions,
      updatedAt: localNow(),
    };
    db.conceptMastery.push(created);
    return created;
  }

  const previousWeight = Math.max(record.totalQuestions || 0, 1);
  const newWeight = previousWeight + totalQuestions;
  record.mastery = clamp((record.mastery * previousWeight + ratio * totalQuestions) / newWeight, 0, 1);
  record.attempts += 1;
  record.totalQuestions = newWeight;
  record.updatedAt = localNow();
  return record;
};

const localStudentInsights = (db, user) => {
  const attempts = db.quizAttempts
    .filter((item) => item.userId === user.id)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  const masteryRows = getMasteryRows(db, user.id).sort((a, b) => a.mastery - b.mastery);

  const masteryList = masteryRows.map((row) => ({
    conceptId: row.conceptId,
    conceptLabel: findConcept(row.conceptId).label,
    masteryPercent: Math.round(row.mastery * 100),
    attempts: row.attempts,
    updatedAt: row.updatedAt,
  }));

  const averageScore = attempts.length
    ? Math.round(attempts.reduce((sum, item) => sum + item.scorePercent, 0) / attempts.length)
    : 0;
  const masteryAverage = masteryList.length
    ? Math.round(masteryList.reduce((sum, item) => sum + item.masteryPercent, 0) / masteryList.length)
    : 0;

  return {
    student: {
      id: user.id,
      name: user.name,
      classId: user.classId,
      language: user.language,
    },
    metrics: {
      attemptedQuizzes: attempts.length,
      averageScore,
      masteryAverage,
      riskLevel: userRisk(db, user.id),
    },
    weakTopics: masteryList.slice(0, 3),
    strongTopics: [...masteryList].reverse().slice(0, 2),
    recentScores: attempts.slice(0, 5).map((item) => ({
      conceptId: item.conceptId,
      conceptLabel: findConcept(item.conceptId).label,
      scorePercent: item.scorePercent,
      submittedAt: item.submittedAt,
    })),
    mastery: masteryList,
  };
};

const localTeacherDashboard = (db, classId) => {
  const students = db.users.filter((user) => user.role === "student" && user.classId === classId);
  const attempts = db.quizAttempts.filter((item) => item.classId === classId);
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const confusionByConcept = LOCAL_CONCEPTS.map((concept) => {
    const rows = db.conceptMastery.filter(
      (row) => row.conceptId === concept.id && students.some((student) => student.id === row.userId)
    );
    const mastery = rows.length ? rows.reduce((sum, row) => sum + row.mastery, 0) / rows.length : 0;
    return {
      conceptId: concept.id,
      conceptLabel: concept.label,
      confusionPercent: Math.round((1 - mastery) * 100),
      averageMasteryPercent: Math.round(mastery * 100),
      attemptedStudents: rows.length,
    };
  }).sort((a, b) => b.confusionPercent - a.confusionPercent);

  const atRiskStudents = students
    .map((student) => {
      const masteryRows = getMasteryRows(db, student.id);
      const attemptsForStudent = attempts
        .filter((attempt) => attempt.userId === student.id)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      const avgMastery = masteryRows.length
        ? Math.round((masteryRows.reduce((sum, row) => sum + row.mastery, 0) / masteryRows.length) * 100)
        : 0;
      const weakest = masteryRows.sort((a, b) => a.mastery - b.mastery)[0];
      return {
        id: student.id,
        name: student.name,
        riskLevel: userRisk(db, student.id),
        averageMasteryPercent: avgMastery,
        latestScore: attemptsForStudent[0]?.scorePercent || 0,
        attemptCount: attemptsForStudent.length,
        weakestConcept: weakest ? findConcept(weakest.conceptId).label : "No data yet",
      };
    })
    .filter((student) => student.riskLevel !== "low")
    .sort((a, b) => {
      if (a.riskLevel === b.riskLevel) return a.averageMasteryPercent - b.averageMasteryPercent;
      return a.riskLevel === "high" ? -1 : 1;
    });

  const activeStudents7d = new Set(
    attempts.filter((item) => new Date(item.submittedAt).getTime() >= sevenDaysAgo).map((item) => item.userId)
  ).size;

  return {
    classId,
    metrics: {
      totalStudents: students.length,
      activeStudents7d,
      averageScore: attempts.length
        ? Math.round(attempts.reduce((sum, item) => sum + item.scorePercent, 0) / attempts.length)
        : 0,
      atRiskCount: atRiskStudents.length,
      silentStrugglerCount: atRiskStudents.filter((item) => item.attemptCount < 2).length,
    },
    confusionByConcept,
    atRiskStudents,
    silentStrugglers: atRiskStudents.filter((item) => item.attemptCount < 2),
  };
};

const localInterventions = (dashboard) => {
  const list = [];
  const top = dashboard.confusionByConcept[0];
  if (top && top.confusionPercent > 35) {
    list.push({
      title: `Re-teach ${top.conceptLabel} with visual walkthrough`,
      action: "Do a 15-minute example trace and run a 3-question pulse quiz.",
      rationale: `${top.confusionPercent}% confusion detected in this concept.`,
      target: `${top.attemptedStudents} students attempted this topic.`,
    });
  }
  if (dashboard.atRiskStudents.length) {
    list.push({
      title: "Targeted support for at-risk students",
      action: "Assign short remediation set and conduct quick one-on-one check.",
      rationale: `${dashboard.atRiskStudents.length} students are medium/high risk.`,
      target: dashboard.atRiskStudents
        .slice(0, 3)
        .map((item) => item.name)
        .join(", "),
    });
  }
  if (!list.length) {
    list.push({
      title: "Maintain momentum",
      action: "Continue adaptive quizzes and monitor concept confusion trend weekly.",
      rationale: "No major risk spikes in current data.",
      target: "Entire class",
    });
  }
  return list;
};

const localApi = async (path, options = {}) => {
  const method = (options.method || "GET").toUpperCase();
  const body = parseBody(options.body);
  const db = loadLocalDb();

  if (path === "/api/health" && method === "GET") {
    return { ok: true, app: "EduTwin AI", mode: "local-fallback", model: "local" };
  }

  if (path === "/api/concepts" && method === "GET") {
    return LOCAL_CONCEPTS.map((item) => ({ id: item.id, label: item.label }));
  }

  if (path === "/api/users" && method === "POST") {
    const name = String(body.name || "").trim();
    const role = String(body.role || "").trim();
    const classId = classIdSafe(body.classId || "cse-fy-a");
    const language = String(body.language || "en").trim().toLowerCase();

    if (!name) throw new Error("Name is required.");
    if (role !== "student" && role !== "teacher") throw new Error("Role must be student or teacher.");

    let user = db.users.find(
      (item) => item.role === role && item.classId === classId && slugify(item.name) === slugify(name)
    );
    if (!user) {
      user = {
        id: randomId(role),
        name,
        role,
        classId,
        language,
        createdAt: localNow(),
      };
      db.users.push(user);
      saveLocalDb(db);
    }
    return { user };
  }

  if (path === "/api/explain" && method === "POST") {
    const user = db.users.find((item) => item.id === body.userId);
    if (!user) throw new Error("User not found.");
    const concept = findConcept(body.conceptId);
    const question = String(body.question || "").trim();
    if (!question) throw new Error("Question is required.");

    return {
      conceptId: concept.id,
      conceptLabel: concept.label,
      language: user.language,
      source: "local",
      explanation: [
        `Concept: ${concept.label}`,
        `Think of it like ${concept.analogy}.`,
        `Question: ${question}`,
        "",
        "Steps:",
        "1. Start from one small example.",
        "2. Validate boundary or edge case.",
        "3. Explain the rule in your own words.",
        "",
        "Self-check: Can you solve one similar question without notes?",
      ].join("\n"),
    };
  }

  if (path === "/api/quiz/generate" && method === "POST") {
    const user = db.users.find((item) => item.id === body.userId);
    if (!user) throw new Error("User not found.");
    const concept = findConcept(body.conceptId);
    const mastery = getConceptMastery(db, user.id, concept.id)?.mastery || 0.3;
    const difficulty = pickDifficulty(mastery);
    const questions = buildQuestionTemplates(concept, difficulty);
    const sessionId = randomId("quiz");

    db.quizSessions.push({
      id: sessionId,
      userId: user.id,
      conceptId: concept.id,
      difficulty,
      createdAt: localNow(),
      questions,
    });
    saveLocalDb(db);

    return {
      sessionId,
      conceptId: concept.id,
      conceptLabel: concept.label,
      difficulty,
      questions: questions.map((item) => ({
        id: item.id,
        stem: item.stem,
        options: item.options,
        bloom: item.bloom,
        difficulty: item.difficulty,
      })),
    };
  }

  if (path === "/api/quiz/submit" && method === "POST") {
    const user = db.users.find((item) => item.id === body.userId);
    if (!user) throw new Error("User not found.");
    const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
    const sessionIndex = db.quizSessions.findIndex((item) => item.id === body.sessionId && item.userId === user.id);
    if (sessionIndex === -1) throw new Error("Quiz session not found or expired.");

    const session = db.quizSessions[sessionIndex];
    const feedback = session.questions.map((question) => {
      const selectedIndex = Number.isInteger(answers[question.id]) ? answers[question.id] : -1;
      const isCorrect = selectedIndex === question.answer;
      return {
        questionId: question.id,
        stem: question.stem,
        selectedIndex,
        correctIndex: question.answer,
        isCorrect,
        explanation: question.explanation,
      };
    });

    const correctCount = feedback.filter((item) => item.isCorrect).length;
    const totalQuestions = feedback.length;
    const scorePercent = Math.round((correctCount / Math.max(totalQuestions, 1)) * 100);
    const masteryRecord = updateMasteryRecord(db, user.id, session.conceptId, scorePercent, totalQuestions);

    const attempt = {
      id: randomId("attempt"),
      userId: user.id,
      classId: user.classId,
      conceptId: session.conceptId,
      scorePercent,
      correctCount,
      totalQuestions,
      submittedAt: localNow(),
    };
    db.quizAttempts.push(attempt);
    db.quizSessions.splice(sessionIndex, 1);
    saveLocalDb(db);

    return {
      attempt,
      mastery: {
        conceptId: session.conceptId,
        conceptLabel: findConcept(session.conceptId).label,
        masteryPercent: Math.round(masteryRecord.mastery * 100),
        riskLevel: userRisk(db, user.id),
      },
      feedback,
      recommendation:
        scorePercent < 60
          ? "Revise with one worked example and retry a beginner quiz."
          : "Good progress. Continue with intermediate and challenge questions.",
    };
  }

  const studentInsightsMatch = path.match(/^\/api\/student\/([^/]+)\/insights$/);
  if (studentInsightsMatch && method === "GET") {
    const userId = decodeURIComponent(studentInsightsMatch[1]);
    const user = db.users.find((item) => item.id === userId && item.role === "student");
    if (!user) throw new Error("Student not found.");
    return localStudentInsights(db, user);
  }

  if (path === "/api/demo/seed" && method === "POST") {
    const classId = classIdSafe(body.classId || "cse-fy-a");
    const demoNames = ["Anjali", "Rahul", "Meera", "Varun", "Nisha", "Arjun", "Pooja", "Kiran", "Sneha", "Fahad"];

    demoNames.forEach((name, idx) => {
      let student = db.users.find(
        (item) => item.role === "student" && item.classId === classId && slugify(item.name) === slugify(name)
      );
      if (!student) {
        student = {
          id: randomId("student"),
          name,
          role: "student",
          classId,
          language: idx % 3 === 0 ? "te" : "en",
          createdAt: localNow(),
        };
        db.users.push(student);
      }

      LOCAL_CONCEPTS.forEach((concept) => {
        if (!getConceptMastery(db, student.id, concept.id)) {
          const mastery = clamp(0.25 + Math.random() * 0.55, 0, 1);
          db.conceptMastery.push({
            id: randomId("mastery"),
            userId: student.id,
            conceptId: concept.id,
            mastery,
            attempts: 1,
            totalQuestions: 5,
            updatedAt: localNow(),
          });
          db.quizAttempts.push({
            id: randomId("attempt"),
            userId: student.id,
            classId,
            conceptId: concept.id,
            scorePercent: Math.round(mastery * 100),
            correctCount: Math.round(mastery * 5),
            totalQuestions: 5,
            submittedAt: localNow(),
          });
        }
      });
    });

    saveLocalDb(db);
    return {
      classId,
      createdStudents: demoNames.length,
      totalStudents: db.users.filter((item) => item.role === "student" && item.classId === classId).length,
    };
  }

  const dashboardMatch = path.match(/^\/api\/teacher\/([^/]+)\/dashboard$/);
  if (dashboardMatch && method === "GET") {
    const classId = classIdSafe(decodeURIComponent(dashboardMatch[1]));
    return localTeacherDashboard(db, classId);
  }

  const interventionsMatch = path.match(/^\/api\/teacher\/([^/]+)\/interventions$/);
  if (interventionsMatch && method === "POST") {
    const classId = classIdSafe(decodeURIComponent(interventionsMatch[1]));
    const dashboard = localTeacherDashboard(db, classId);
    return {
      classId,
      generatedAt: localNow(),
      interventions: localInterventions(dashboard),
    };
  }

  throw new Error("API route not found.");
};

const enableLocalFallback = () => {
  if (localFallbackEnabled) return;
  localFallbackEnabled = true;
  setApiStatus("Local Mode (Static Deploy)", "medium");
};

const apiRequest = async (path, options = {}) => {
  if (localFallbackEnabled && path.startsWith("/api/")) {
    return localApi(path, options);
  }

  const init = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  try {
    const response = await fetch(path, init);
    const raw = await response.text();
    let data = {};

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (error) {
      if (path.startsWith("/api/") && response.status === 404) {
        enableLocalFallback();
        return localApi(path, options);
      }
      throw new Error("Invalid server response.");
    }

    if (!response.ok) {
      if (path.startsWith("/api/") && response.status === 404) {
        enableLocalFallback();
        return localApi(path, options);
      }
      throw new Error(data?.error || `Request failed (${response.status})`);
    }

    return data;
  } catch (error) {
    const networkLikeError =
      error?.message?.includes("Failed to fetch") ||
      error?.message?.includes("NetworkError") ||
      error?.message?.includes("Invalid server response.");

    if (path.startsWith("/api/") && networkLikeError) {
      enableLocalFallback();
      return localApi(path, options);
    }
    throw error;
  }
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
    if (data?.mode === "local-fallback") {
      setApiStatus("Local Mode (Static Deploy)", "medium");
      return;
    }
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
