const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 3000);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");
const DB_FILE = path.join(DATA_DIR, "edutwin-db.json");
const MAX_BODY_SIZE = 1_000_000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
  ".json": "application/json; charset=utf-8",
};

const LANGUAGE_LABELS = {
  en: "English",
  te: "Telugu",
  hi: "Hindi",
  ta: "Tamil",
  kn: "Kannada",
};

const CONCEPTS = {
  recursion: {
    id: "recursion",
    label: "Recursion",
    analogy: "a set of nested dolls where each doll opens one smaller doll until the smallest one",
    questionBank: [
      {
        id: "rec-b-1",
        difficulty: "beginner",
        bloom: "Remember",
        stem: "What is recursion in programming?",
        options: [
          "A loop that always runs forever",
          "A function calling itself with smaller input",
          "A variable that changes type at runtime",
          "A compiler optimization",
        ],
        answer: 1,
        explanation: "Recursion means solving a problem by calling the same function on smaller subproblems.",
      },
      {
        id: "rec-b-2",
        difficulty: "beginner",
        bloom: "Understand",
        stem: "Why is a base case required in recursion?",
        options: [
          "To improve syntax highlighting",
          "To terminate recursive calls",
          "To allocate dynamic memory",
          "To avoid function parameters",
        ],
        answer: 1,
        explanation: "Without a base case, recursive calls continue indefinitely and cause stack overflow.",
      },
      {
        id: "rec-b-3",
        difficulty: "beginner",
        bloom: "Understand",
        stem: "In factorial recursion, what is usually the base case?",
        options: ["n == 0 returns 1", "n == 0 returns 0", "n == 1 returns n-1", "n < 0 returns n"],
        answer: 0,
        explanation: "Factorial commonly stops at 0! = 1 (and often 1! = 1 as an additional base case).",
      },
      {
        id: "rec-i-1",
        difficulty: "intermediate",
        bloom: "Apply",
        stem: "Which issue is common in naive recursive Fibonacci implementation?",
        options: ["No stack usage", "Repeated subproblem computation", "Constant-time runtime", "No base case needed"],
        answer: 1,
        explanation: "Naive Fibonacci recomputes the same values many times, causing exponential runtime.",
      },
      {
        id: "rec-i-2",
        difficulty: "intermediate",
        bloom: "Apply",
        stem: "Which conversion often improves recursive performance?",
        options: ["Replace with more global variables", "Memoization of subproblems", "Increase recursion depth limit", "Use floating point"],
        answer: 1,
        explanation: "Memoization caches previously computed values and avoids repeated work.",
      },
      {
        id: "rec-i-3",
        difficulty: "intermediate",
        bloom: "Analyze",
        stem: "A recursive function makes 2 calls of size n/2 and does O(n) combine work. Time complexity?",
        options: ["O(log n)", "O(n)", "O(n log n)", "O(n^2)"],
        answer: 2,
        explanation: "By Master theorem, T(n)=2T(n/2)+O(n) gives O(n log n).",
      },
      {
        id: "rec-a-1",
        difficulty: "advanced",
        bloom: "Analyze",
        stem: "Tail recursion helps primarily because:",
        options: [
          "It always reduces algorithmic complexity",
          "Compilers may optimize stack frames in some languages",
          "It removes base cases",
          "It eliminates function parameters",
        ],
        answer: 1,
        explanation: "Tail-call optimization can reuse stack frames in languages/compilers that support it.",
      },
      {
        id: "rec-a-2",
        difficulty: "advanced",
        bloom: "Evaluate",
        stem: "When should recursion be avoided?",
        options: [
          "When depth may exceed stack limits",
          "When code has any loops",
          "When input is sorted",
          "When using arrays",
        ],
        answer: 0,
        explanation: "Deep recursion can overflow call stack; iterative approaches are safer in such cases.",
      },
      {
        id: "rec-a-3",
        difficulty: "advanced",
        bloom: "Create",
        stem: "Best strategy to teach recursion to beginners?",
        options: [
          "Start from recurrence relation and proof first",
          "Use trace tables and shrinking-input examples",
          "Skip base case discussion",
          "Only use compiler internals",
        ],
        answer: 1,
        explanation: "Tracing concrete shrinking examples builds intuition before formal proof.",
      },
    ],
  },
  arrays: {
    id: "arrays",
    label: "Arrays",
    analogy: "numbered lockers in a straight corridor where each locker has an index",
    questionBank: [
      {
        id: "arr-b-1",
        difficulty: "beginner",
        bloom: "Remember",
        stem: "In most languages, array indexing starts at:",
        options: ["0", "1", "-1", "Depends on CPU"],
        answer: 0,
        explanation: "Most mainstream languages use zero-based indexing.",
      },
      {
        id: "arr-b-2",
        difficulty: "beginner",
        bloom: "Understand",
        stem: "Random access in array is usually:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 0,
        explanation: "Given index i, memory offset can be computed directly in constant time.",
      },
      {
        id: "arr-b-3",
        difficulty: "beginner",
        bloom: "Understand",
        stem: "What happens on out-of-bounds array access in safe languages?",
        options: ["Always returns 0", "Raises an error/exception", "Compiles faster", "Sorts array automatically"],
        answer: 1,
        explanation: "Safe languages detect invalid index access and throw error/exception.",
      },
      {
        id: "arr-i-1",
        difficulty: "intermediate",
        bloom: "Apply",
        stem: "Time complexity of inserting at middle of dynamic array?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        answer: 2,
        explanation: "Elements after insertion point need shifting, so insertion is linear.",
      },
      {
        id: "arr-i-2",
        difficulty: "intermediate",
        bloom: "Analyze",
        stem: "Two-dimensional array in row-major order stores:",
        options: [
          "Each row contiguously",
          "Each column contiguously",
          "Random block order",
          "Hash buckets only",
        ],
        answer: 0,
        explanation: "Row-major layout stores one full row after another in memory.",
      },
      {
        id: "arr-i-3",
        difficulty: "intermediate",
        bloom: "Analyze",
        stem: "Which bug appears when loop runs i <= arr.length?",
        options: ["Memory leak only", "Missed first element", "Out-of-bounds on last iteration", "Infinite recursion"],
        answer: 2,
        explanation: "Valid indices go from 0 to arr.length - 1.",
      },
      {
        id: "arr-a-1",
        difficulty: "advanced",
        bloom: "Evaluate",
        stem: "Why choose array over linked list for frequent reads?",
        options: [
          "Better cache locality and O(1) index access",
          "Constant-time insertion everywhere",
          "No memory usage",
          "Automatic sorting",
        ],
        answer: 0,
        explanation: "Arrays are contiguous and cache-friendly, giving strong read performance.",
      },
      {
        id: "arr-a-2",
        difficulty: "advanced",
        bloom: "Analyze",
        stem: "Amortized append in dynamic arrays is usually:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 0,
        explanation: "Occasional resize is costly, but averaged over many appends it's constant.",
      },
      {
        id: "arr-a-3",
        difficulty: "advanced",
        bloom: "Create",
        stem: "For very large sparse data, better than dense array is:",
        options: ["Stack", "Hash map / sparse representation", "Queue", "Pointer-free recursion"],
        answer: 1,
        explanation: "Sparse structures store only present entries and save memory.",
      },
    ],
  },
  "binary-search": {
    id: "binary-search",
    label: "Binary Search",
    analogy: "opening a dictionary near the middle each time to find a word faster",
    questionBank: [
      {
        id: "bs-b-1",
        difficulty: "beginner",
        bloom: "Remember",
        stem: "Binary search works correctly when data is:",
        options: ["Sorted", "Random", "All negative", "All duplicate-free"],
        answer: 0,
        explanation: "Binary search requires monotonic ordering to discard half each step.",
      },
      {
        id: "bs-b-2",
        difficulty: "beginner",
        bloom: "Understand",
        stem: "Binary search repeatedly does what?",
        options: ["Scans full array", "Splits search space in half", "Shuffles data", "Builds hash table"],
        answer: 1,
        explanation: "Each comparison halves the remaining interval.",
      },
      {
        id: "bs-b-3",
        difficulty: "beginner",
        bloom: "Understand",
        stem: "Worst-case time complexity of binary search?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 1,
        explanation: "Each step halves search interval, giving logarithmic complexity.",
      },
      {
        id: "bs-i-1",
        difficulty: "intermediate",
        bloom: "Apply",
        stem: "Overflow-safe midpoint formula is:",
        options: ["(low + high) / 2", "low + (high - low) / 2", "high - low / 2", "2 * low + high"],
        answer: 1,
        explanation: "low + (high - low)/2 avoids potential overflow in low + high.",
      },
      {
        id: "bs-i-2",
        difficulty: "intermediate",
        bloom: "Analyze",
        stem: "If target is smaller than arr[mid], update:",
        options: ["low = mid + 1", "high = mid - 1", "mid = low", "arr[mid] = target"],
        answer: 1,
        explanation: "Discard right half and continue searching left half.",
      },
      {
        id: "bs-i-3",
        difficulty: "intermediate",
        bloom: "Analyze",
        stem: "Common binary search bug causing infinite loop:",
        options: [
          "Using sorted array",
          "Not updating low/high properly",
          "Using integers",
          "Checking equality",
        ],
        answer: 1,
        explanation: "If boundaries do not move, search interval never shrinks.",
      },
      {
        id: "bs-a-1",
        difficulty: "advanced",
        bloom: "Apply",
        stem: "To find first occurrence among duplicates, when arr[mid] == target:",
        options: ["Return immediately always", "Search left half as well", "Search right half only", "Stop with error"],
        answer: 1,
        explanation: "Continue to left to ensure earliest index is found.",
      },
      {
        id: "bs-a-2",
        difficulty: "advanced",
        bloom: "Evaluate",
        stem: "When is linear search better than binary search?",
        options: [
          "Very small unsorted lists",
          "Always for sorted lists",
          "Always for large arrays",
          "Never",
        ],
        answer: 0,
        explanation: "If data is tiny/unsorted, sort+binary may cost more than a simple scan.",
      },
      {
        id: "bs-a-3",
        difficulty: "advanced",
        bloom: "Create",
        stem: "Binary search can also solve:",
        options: [
          "Only exact value match",
          "Monotonic answer-space problems",
          "Graph coloring only",
          "String concatenation only",
        ],
        answer: 1,
        explanation: "Binary search applies to monotonic predicates over ranges.",
      },
    ],
  },
  "sql-joins": {
    id: "sql-joins",
    label: "SQL Joins",
    analogy: "matching student attendance sheets from two classrooms using roll numbers",
    questionBank: [
      {
        id: "sql-b-1",
        difficulty: "beginner",
        bloom: "Remember",
        stem: "INNER JOIN returns:",
        options: [
          "All rows from left table",
          "Only matching rows from both tables",
          "All rows from both tables with nulls",
          "Only non-matching rows",
        ],
        answer: 1,
        explanation: "INNER JOIN keeps records with matching join keys on both sides.",
      },
      {
        id: "sql-b-2",
        difficulty: "beginner",
        bloom: "Understand",
        stem: "LEFT JOIN returns:",
        options: [
          "Only right-table rows",
          "All left rows and matched right rows",
          "Only unmatched rows",
          "Only duplicate rows",
        ],
        answer: 1,
        explanation: "LEFT JOIN preserves all left rows; unmatched right columns become NULL.",
      },
      {
        id: "sql-b-3",
        difficulty: "beginner",
        bloom: "Understand",
        stem: "Join condition is written using:",
        options: ["ORDER BY", "ON", "GROUP BY", "LIMIT"],
        answer: 1,
        explanation: "The ON clause specifies how rows should be matched between tables.",
      },
      {
        id: "sql-i-1",
        difficulty: "intermediate",
        bloom: "Apply",
        stem: "To find students with no submissions, use:",
        options: [
          "INNER JOIN + WHERE submissions.id IS NOT NULL",
          "LEFT JOIN + WHERE submissions.id IS NULL",
          "CROSS JOIN",
          "RIGHT JOIN + ORDER BY",
        ],
        answer: 1,
        explanation: "LEFT JOIN keeps all students; NULL on right indicates no match.",
      },
      {
        id: "sql-i-2",
        difficulty: "intermediate",
        bloom: "Analyze",
        stem: "Joining on non-indexed large columns often causes:",
        options: ["Lower memory usage", "Slower query performance", "Automatic deduplication", "No effect"],
        answer: 1,
        explanation: "Without useful indexes, database may scan many rows to evaluate join conditions.",
      },
      {
        id: "sql-i-3",
        difficulty: "intermediate",
        bloom: "Analyze",
        stem: "Which clause filters grouped results?",
        options: ["WHERE", "HAVING", "ON", "FROM"],
        answer: 1,
        explanation: "HAVING filters after GROUP BY aggregation.",
      },
      {
        id: "sql-a-1",
        difficulty: "advanced",
        bloom: "Evaluate",
        stem: "Cartesian explosion is usually caused by:",
        options: ["Proper join keys", "Missing/incorrect join condition", "Using COUNT(*)", "Using LIMIT"],
        answer: 1,
        explanation: "If join condition is wrong or omitted, many unintended row combinations appear.",
      },
      {
        id: "sql-a-2",
        difficulty: "advanced",
        bloom: "Analyze",
        stem: "To optimize join-heavy analytics, a common step is:",
        options: [
          "Use random column types",
          "Create indexes on join keys",
          "Disable query planner",
          "Avoid normalization always",
        ],
        answer: 1,
        explanation: "Indexes on join keys significantly reduce lookup and join cost.",
      },
      {
        id: "sql-a-3",
        difficulty: "advanced",
        bloom: "Create",
        stem: "Best way to explain JOINs to beginners:",
        options: ["Start with query planner internals", "Use simple table diagrams and key matching", "Only use subqueries", "Avoid sample data"],
        answer: 1,
        explanation: "Visual key matching with sample rows builds intuition quickly.",
      },
    ],
  },
  stack: {
    id: "stack",
    label: "Stack",
    analogy: "a pile of plates where you add and remove only from the top",
    questionBank: [
      {
        id: "stk-b-1",
        difficulty: "beginner",
        bloom: "Remember",
        stem: "Stack follows which order?",
        options: ["FIFO", "LIFO", "Priority order", "Random"],
        answer: 1,
        explanation: "Stack is Last-In, First-Out.",
      },
      {
        id: "stk-b-2",
        difficulty: "beginner",
        bloom: "Understand",
        stem: "Which operation removes top element from stack?",
        options: ["enqueue", "dequeue", "pop", "peek"],
        answer: 2,
        explanation: "pop removes and returns the top element.",
      },
      {
        id: "stk-b-3",
        difficulty: "beginner",
        bloom: "Understand",
        stem: "Which operation reads top element without removing it?",
        options: ["push", "peek", "append", "insert"],
        answer: 1,
        explanation: "peek (or top) accesses current top element.",
      },
      {
        id: "stk-i-1",
        difficulty: "intermediate",
        bloom: "Apply",
        stem: "A common stack use-case is:",
        options: [
          "Binary heap balancing",
          "Parentheses matching",
          "Hashing strings",
          "B-tree insertion",
        ],
        answer: 1,
        explanation: "Balanced parentheses checking is a classic stack problem.",
      },
      {
        id: "stk-i-2",
        difficulty: "intermediate",
        bloom: "Analyze",
        stem: "Recursion internally uses:",
        options: ["Queue", "Heap only", "Call stack", "Graph"],
        answer: 2,
        explanation: "Each function call frame is pushed onto the call stack.",
      },
      {
        id: "stk-i-3",
        difficulty: "intermediate",
        bloom: "Analyze",
        stem: "Underflow in stack means:",
        options: [
          "Pushing into full stack",
          "Popping from empty stack",
          "Reading from disk",
          "Sorting stack incorrectly",
        ],
        answer: 1,
        explanation: "Underflow occurs when pop is attempted on an empty stack.",
      },
      {
        id: "stk-a-1",
        difficulty: "advanced",
        bloom: "Evaluate",
        stem: "Time complexity of push/pop in linked-list stack is typically:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 0,
        explanation: "Top insert/delete in linked list is constant time.",
      },
      {
        id: "stk-a-2",
        difficulty: "advanced",
        bloom: "Analyze",
        stem: "Which expression conversion heavily uses stack?",
        options: [
          "Infix to postfix conversion",
          "Binary to decimal",
          "Merge two arrays",
          "Linear search",
        ],
        answer: 0,
        explanation: "Operator precedence handling in infix->postfix uses stack operations.",
      },
      {
        id: "stk-a-3",
        difficulty: "advanced",
        bloom: "Create",
        stem: "Best intervention when students confuse stack vs queue:",
        options: [
          "Only show formulas",
          "Use physical push/pop and enqueue/dequeue simulation",
          "Skip examples",
          "Teach trees first",
        ],
        answer: 1,
        explanation: "Hands-on simulation helps students internalize operation order.",
      },
    ],
  },
};

const DIFFICULTY_ORDER = ["beginner", "intermediate", "advanced"];

const LOCALIZED_HINTS = {
  en: "Focus on one small step at a time.",
  te: "ఒక్కో స్టెప్ ను సింపుల్ గా అర్థం చేసుకుందాం.",
  hi: "इसे छोटे-छोटे चरणों में समझते हैं।",
  ta: "இதைக் குறுகிய படிகளாகப் புரிந்துகொள்வோம்.",
  kn: "ಇದನ್ನು ಸಣ್ಣ ಹಂತಗಳಲ್ಲಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳೋಣ.",
};

const createEmptyDb = () => ({
  users: [],
  conceptMastery: [],
  quizSessions: [],
  quizAttempts: [],
  learningEvents: [],
});

const sendJson = (res, statusCode, payload) => {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  res.end(body);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > MAX_BODY_SIZE) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });

const parseJsonBody = async (req, res) => {
  try {
    const raw = await readBody(req);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (error) {
    sendJson(res, 400, { error: "Invalid JSON payload." });
    return null;
  }
};

const safeText = (value, max = 2000) => {
  if (value == null) return "";
  const text = String(value).replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max)}...` : text;
};

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const uid = (prefix) => `${prefix}_${crypto.randomBytes(6).toString("hex")}`;

const nowIso = () => new Date().toISOString();

const shuffle = (input) => {
  const items = [...input];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

const ensureStore = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(createEmptyDb(), null, 2), "utf-8");
  }
};

const readDb = () => {
  ensureStore();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      conceptMastery: Array.isArray(parsed.conceptMastery) ? parsed.conceptMastery : [],
      quizSessions: Array.isArray(parsed.quizSessions) ? parsed.quizSessions : [],
      quizAttempts: Array.isArray(parsed.quizAttempts) ? parsed.quizAttempts : [],
      learningEvents: Array.isArray(parsed.learningEvents) ? parsed.learningEvents : [],
    };
  } catch (error) {
    return createEmptyDb();
  }
};

const writeDb = (db) => {
  ensureStore();
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), "utf-8");
  fs.renameSync(tempFile, DB_FILE);
};

const normalizeLanguage = (language) => {
  const normalized = slugify(language).slice(0, 5);
  if (LANGUAGE_LABELS[normalized]) return normalized;
  if (normalized.startsWith("tel")) return "te";
  if (normalized.startsWith("hin")) return "hi";
  if (normalized.startsWith("tam")) return "ta";
  if (normalized.startsWith("kan")) return "kn";
  return "en";
};

const resolveConceptId = (input) => {
  const key = slugify(input);
  if (CONCEPTS[key]) return key;

  if (key.includes("binary")) return "binary-search";
  if (key.includes("sql")) return "sql-joins";
  if (key.includes("join")) return "sql-joins";
  if (key.includes("stack")) return "stack";
  if (key.includes("array")) return "arrays";
  if (key.includes("recur")) return "recursion";
  return "recursion";
};

const getConcept = (input) => {
  const id = resolveConceptId(input);
  return CONCEPTS[id];
};

const getMasteryRecord = (db, userId, conceptId) =>
  db.conceptMastery.find((item) => item.userId === userId && item.conceptId === conceptId) || null;

const getStudentAverageMastery = (db, userId) => {
  const rows = db.conceptMastery.filter((item) => item.userId === userId);
  if (!rows.length) return 0;
  return rows.reduce((sum, row) => sum + row.mastery, 0) / rows.length;
};

const getRecentQuizScores = (db, userId, limit = 5) =>
  db.quizAttempts
    .filter((attempt) => attempt.userId === userId)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, limit)
    .map((attempt) => attempt.scorePercent);

const getRiskLevel = (db, userId) => {
  const avgMastery = getStudentAverageMastery(db, userId);
  const recent = getRecentQuizScores(db, userId, 2);
  const recentAvg = recent.length ? recent.reduce((sum, value) => sum + value, 0) / recent.length : 100;

  if (avgMastery < 0.45 || recentAvg < 45) return "high";
  if (avgMastery < 0.65 || recentAvg < 65) return "medium";
  return "low";
};

const getTargetDifficulty = (mastery) => {
  if (mastery < 0.4) return "beginner";
  if (mastery < 0.7) return "intermediate";
  return "advanced";
};

const generateFallbackQuestion = (concept, difficulty, index) => {
  const stems = [
    `Which statement is most accurate about ${concept.label}?`,
    `Which learning action best improves ${concept.label} understanding?`,
    `Which error is common while practicing ${concept.label}?`,
  ];
  const optionsSets = [
    [
      `Break ${concept.label} into smaller examples and trace steps`,
      `Memorize only definitions without practice`,
      `Avoid feedback after quizzes`,
      `Skip base rules and jump to advanced proofs`,
    ],
    [
      `Practice with 3 small examples and explain in your own words`,
      `Only copy solved answers`,
      `Avoid checking mistakes`,
      `Depend on one-line shortcuts only`,
    ],
    [
      `Missing boundary/base conditions`,
      `Using a keyboard`,
      `Naming variables clearly`,
      `Writing tests`,
    ],
  ];
  return {
    id: `${slugify(concept.id)}-f-${difficulty}-${index}`,
    difficulty,
    bloom: difficulty === "advanced" ? "Analyze" : "Apply",
    stem: stems[index % stems.length],
    options: optionsSets[index % optionsSets.length],
    answer: 0,
    explanation: "Strong learning comes from stepwise tracing, feedback, and boundary-checking.",
  };
};

const pickQuizQuestions = (conceptId, difficulty, total = 5) => {
  const concept = CONCEPTS[conceptId] || CONCEPTS.recursion;
  const bank = concept.questionBank || [];
  const rank = DIFFICULTY_ORDER.indexOf(difficulty);
  const targetRank = rank === -1 ? 1 : rank;

  const sorted = shuffle(bank).sort((a, b) => {
    const aGap = Math.abs(DIFFICULTY_ORDER.indexOf(a.difficulty) - targetRank);
    const bGap = Math.abs(DIFFICULTY_ORDER.indexOf(b.difficulty) - targetRank);
    return aGap - bGap;
  });

  const picked = sorted.slice(0, total);
  while (picked.length < total) {
    picked.push(generateFallbackQuestion(concept, difficulty, picked.length));
  }

  return picked;
};

const updateMastery = (db, userId, conceptId, correctCount, totalQuestions) => {
  const quizRatio = totalQuestions > 0 ? correctCount / totalQuestions : 0;
  let record = getMasteryRecord(db, userId, conceptId);

  if (!record) {
    record = {
      id: uid("mastery"),
      userId,
      conceptId,
      mastery: quizRatio,
      attempts: 1,
      correctAnswers: correctCount,
      totalQuestions,
      updatedAt: nowIso(),
    };
    db.conceptMastery.push(record);
    return record;
  }

  const previousAnswered = record.totalQuestions || 0;
  const totalAnswered = previousAnswered + totalQuestions;
  const weightedMastery =
    totalAnswered > 0
      ? (record.mastery * previousAnswered + quizRatio * totalQuestions) / totalAnswered
      : quizRatio;

  record.mastery = clamp(weightedMastery, 0, 1);
  record.attempts += 1;
  record.correctAnswers += correctCount;
  record.totalQuestions += totalQuestions;
  record.updatedAt = nowIso();
  return record;
};

const extractOutputText = (data) => {
  if (!data) return "";
  if (typeof data.output_text === "string") return data.output_text.trim();
  if (!Array.isArray(data.output)) return "";

  const message = data.output.find((item) => item.type === "message");
  if (!message || !Array.isArray(message.content)) return "";

  return message.content
    .filter((part) => part.type === "output_text")
    .map((part) => part.text)
    .join("\n")
    .trim();
};

const buildLocalExplanation = ({ concept, question, language }) => {
  const localizedTip = LOCALIZED_HINTS[language] || LOCALIZED_HINTS.en;
  const base = [
    `Concept: ${concept.label}`,
    `Think of it like ${concept.analogy}.`,
    `Question: ${question}`,
    "",
    "Step-by-step:",
    "1. Start with the smallest valid case.",
    "2. Identify the rule that repeats each step.",
    "3. Test with one simple example and one edge case.",
    "",
    `Learning tip (${LANGUAGE_LABELS[language] || "English"}): ${localizedTip}`,
    "Quick check: Explain this concept to a friend in 3 lines without code first.",
  ];
  return base.join("\n");
};

const generateExplanation = async ({ user, concept, question, language }) => {
  if (!OPENAI_API_KEY || typeof fetch !== "function") {
    return {
      source: "local",
      text: buildLocalExplanation({ concept, question, language }),
    };
  }

  const prompt = [
    `Student name: ${user.name}`,
    `Class: ${user.classId}`,
    `Concept: ${concept.label}`,
    `Question: ${question}`,
    `Preferred language: ${LANGUAGE_LABELS[language] || "English"} (${language})`,
    "",
    "Give a concise explanation:",
    "- Use very simple terms for first-year students",
    "- Add one local analogy",
    "- Add one short self-check question",
    "- Keep answer under 170 words",
  ].join("\n");

  const instructions =
    "You are an inclusive education assistant. Answer in the requested language when possible. " +
    "Keep explanations simple, concrete, and supportive for non-native learners.";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        instructions,
        input: prompt,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      return {
        source: "local",
        text: buildLocalExplanation({ concept, question, language }),
      };
    }

    const data = await response.json();
    const text = extractOutputText(data);
    if (!text) {
      return {
        source: "local",
        text: buildLocalExplanation({ concept, question, language }),
      };
    }

    return { source: "openai", text };
  } catch (error) {
    return {
      source: "local",
      text: buildLocalExplanation({ concept, question, language }),
    };
  }
};

const summarizeStudentInsights = (db, user) => {
  const mastery = db.conceptMastery
    .filter((row) => row.userId === user.id)
    .sort((a, b) => a.mastery - b.mastery)
    .map((row) => ({
      conceptId: row.conceptId,
      conceptLabel: CONCEPTS[row.conceptId]?.label || row.conceptId,
      masteryPercent: Math.round(row.mastery * 100),
      attempts: row.attempts,
      updatedAt: row.updatedAt,
    }));

  const attempts = db.quizAttempts
    .filter((attempt) => attempt.userId === user.id)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const averageScore = attempts.length
    ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.scorePercent, 0) / attempts.length)
    : 0;

  const masteryAverage = mastery.length
    ? Math.round(mastery.reduce((sum, row) => sum + row.masteryPercent, 0) / mastery.length)
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
      riskLevel: getRiskLevel(db, user.id),
    },
    weakTopics: mastery.slice(0, 3),
    strongTopics: [...mastery].reverse().slice(0, 2),
    recentScores: attempts.slice(0, 5).map((attempt) => ({
      conceptId: attempt.conceptId,
      conceptLabel: CONCEPTS[attempt.conceptId]?.label || attempt.conceptId,
      scorePercent: attempt.scorePercent,
      submittedAt: attempt.submittedAt,
    })),
    mastery,
  };
};

const buildTeacherDashboard = (db, classId) => {
  const students = db.users.filter((user) => user.role === "student" && user.classId === classId);
  const attempts = db.quizAttempts.filter((attempt) => attempt.classId === classId);
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const conceptStats = Object.values(CONCEPTS)
    .map((concept) => {
      const rows = db.conceptMastery.filter(
        (mastery) =>
          mastery.conceptId === concept.id &&
          students.some((student) => student.id === mastery.userId)
      );
      if (!rows.length) {
        return {
          conceptId: concept.id,
          conceptLabel: concept.label,
          confusionPercent: 0,
          averageMasteryPercent: 0,
          attemptedStudents: 0,
        };
      }

      const avgMastery = rows.reduce((sum, row) => sum + row.mastery, 0) / rows.length;
      return {
        conceptId: concept.id,
        conceptLabel: concept.label,
        confusionPercent: Math.round((1 - avgMastery) * 100),
        averageMasteryPercent: Math.round(avgMastery * 100),
        attemptedStudents: rows.length,
      };
    })
    .sort((a, b) => b.confusionPercent - a.confusionPercent);

  const studentCards = students.map((student) => {
    const masteryRows = db.conceptMastery.filter((row) => row.userId === student.id);
    const avgMastery = masteryRows.length
      ? masteryRows.reduce((sum, row) => sum + row.mastery, 0) / masteryRows.length
      : 0;
    const weakest = masteryRows
      .slice()
      .sort((a, b) => a.mastery - b.mastery)
      .map((item) => CONCEPTS[item.conceptId]?.label || item.conceptId)[0];
    const recent = getRecentQuizScores(db, student.id, 1)[0] || 0;
    const attemptCount = db.quizAttempts.filter((attempt) => attempt.userId === student.id).length;

    return {
      id: student.id,
      name: student.name,
      riskLevel: getRiskLevel(db, student.id),
      averageMasteryPercent: Math.round(avgMastery * 100),
      latestScore: recent,
      attemptCount,
      weakestConcept: weakest || "No data yet",
    };
  });

  const atRiskStudents = studentCards
    .filter((student) => student.riskLevel !== "low")
    .sort((a, b) => {
      if (a.riskLevel === b.riskLevel) return a.averageMasteryPercent - b.averageMasteryPercent;
      return a.riskLevel === "high" ? -1 : 1;
    });

  const silentStrugglers = atRiskStudents.filter((student) => student.attemptCount < 2);

  const averageScore = attempts.length
    ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.scorePercent, 0) / attempts.length)
    : 0;

  const activeStudentIds = new Set(
    attempts
      .filter((attempt) => new Date(attempt.submittedAt).getTime() >= sevenDaysAgo)
      .map((attempt) => attempt.userId)
  );

  return {
    classId,
    metrics: {
      totalStudents: students.length,
      activeStudents7d: activeStudentIds.size,
      averageScore,
      atRiskCount: atRiskStudents.length,
      silentStrugglerCount: silentStrugglers.length,
    },
    confusionByConcept: conceptStats,
    atRiskStudents,
    silentStrugglers,
  };
};

const buildInterventions = (dashboard) => {
  const interventions = [];
  const worstConcept = dashboard.confusionByConcept[0];

  if (worstConcept && worstConcept.confusionPercent > 35) {
    interventions.push({
      title: `Re-teach ${worstConcept.conceptLabel} with visual walkthrough`,
      action: "Run a 15-minute live tracing exercise with one solved and one unsolved problem.",
      rationale: `${worstConcept.confusionPercent}% concept confusion indicates low classroom clarity.`,
      target: `${worstConcept.attemptedStudents || 0} students attempted this concept.`,
    });
  }

  if (dashboard.atRiskStudents.length > 0) {
    const topStudents = dashboard.atRiskStudents
      .slice(0, 3)
      .map((student) => student.name)
      .join(", ");
    interventions.push({
      title: "Targeted support for at-risk learners",
      action: "Assign a short remediation quiz and one-on-one check-in.",
      rationale: `${dashboard.atRiskStudents.length} students are currently medium/high risk.`,
      target: topStudents || "No specific students available",
    });
  }

  if (dashboard.silentStrugglers.length > 0) {
    interventions.push({
      title: "Activate silent strugglers",
      action: "Use anonymous 3-question pulse quiz at start of class.",
      rationale: `${dashboard.silentStrugglers.length} high-risk students have low participation.`,
      target: "Whole class anonymous poll",
    });
  }

  if (!interventions.length) {
    interventions.push({
      title: "Maintain learning momentum",
      action: "Continue adaptive quizzes twice weekly and monitor concept confusion trend.",
      rationale: "No major risk spikes detected in current data.",
      target: "Entire class",
    });
  }

  return interventions;
};

const seedDemoClass = (db, classId) => {
  const names = [
    "Anjali",
    "Vikram",
    "Fahad",
    "Sneha",
    "Arjun",
    "Meera",
    "Rahul",
    "Pooja",
    "Varun",
    "Nisha",
  ];
  const conceptIds = Object.keys(CONCEPTS);

  let createdStudents = 0;

  names.forEach((name, index) => {
    const existing = db.users.find(
      (user) => user.role === "student" && user.classId === classId && user.name === name
    );
    let student = existing;
    if (!student) {
      student = {
        id: uid("student"),
        name,
        role: "student",
        classId,
        language: index % 3 === 0 ? "te" : "en",
        createdAt: nowIso(),
      };
      db.users.push(student);
      createdStudents += 1;
    }

    conceptIds.forEach((conceptId) => {
      const exists = getMasteryRecord(db, student.id, conceptId);
      if (exists) return;
      const mastery = clamp(0.25 + Math.random() * 0.6, 0, 1);
      db.conceptMastery.push({
        id: uid("mastery"),
        userId: student.id,
        conceptId,
        mastery,
        attempts: 1,
        correctAnswers: Math.round(mastery * 5),
        totalQuestions: 5,
        updatedAt: nowIso(),
      });

      db.quizAttempts.push({
        id: uid("attempt"),
        userId: student.id,
        classId,
        conceptId,
        scorePercent: Math.round(mastery * 100),
        correctCount: Math.round(mastery * 5),
        totalQuestions: 5,
        submittedAt: nowIso(),
      });
    });
  });

  return {
    createdStudents,
    totalStudents: db.users.filter((user) => user.role === "student" && user.classId === classId).length,
  };
};

const handleCreateUser = async (req, res) => {
  const payload = await parseJsonBody(req, res);
  if (!payload) return;

  const name = safeText(payload.name, 80);
  const role = slugify(payload.role);
  const classId = slugify(payload.classId || "cse-fy-a");
  const language = normalizeLanguage(payload.language || "en");

  if (!name) {
    sendJson(res, 400, { error: "Name is required." });
    return;
  }
  if (role !== "student" && role !== "teacher") {
    sendJson(res, 400, { error: "Role must be student or teacher." });
    return;
  }

  const db = readDb();
  let user = db.users.find(
    (item) =>
      item.role === role &&
      item.classId === classId &&
      slugify(item.name) === slugify(name)
  );

  if (!user) {
    user = {
      id: uid(role),
      name,
      role,
      classId,
      language,
      createdAt: nowIso(),
    };
    db.users.push(user);
    writeDb(db);
  }

  sendJson(res, 200, { user });
};

const handleExplain = async (req, res) => {
  const payload = await parseJsonBody(req, res);
  if (!payload) return;

  const userId = safeText(payload.userId, 120);
  const question = safeText(payload.question, 1200);
  const concept = getConcept(payload.conceptId || payload.conceptLabel);
  const language = normalizeLanguage(payload.language || "en");

  if (!userId || !question) {
    sendJson(res, 400, { error: "userId and question are required." });
    return;
  }

  const db = readDb();
  const user = db.users.find((item) => item.id === userId);
  if (!user) {
    sendJson(res, 404, { error: "User not found." });
    return;
  }

  const result = await generateExplanation({ user, concept, question, language });
  db.learningEvents.push({
    id: uid("event"),
    type: "explanation",
    userId,
    classId: user.classId,
    conceptId: concept.id,
    question,
    language,
    source: result.source,
    createdAt: nowIso(),
  });
  writeDb(db);

  sendJson(res, 200, {
    conceptId: concept.id,
    conceptLabel: concept.label,
    language,
    source: result.source,
    explanation: result.text,
  });
};

const handleGenerateQuiz = async (req, res) => {
  const payload = await parseJsonBody(req, res);
  if (!payload) return;

  const userId = safeText(payload.userId, 120);
  const concept = getConcept(payload.conceptId || payload.conceptLabel);
  if (!userId) {
    sendJson(res, 400, { error: "userId is required." });
    return;
  }

  const db = readDb();
  const user = db.users.find((item) => item.id === userId);
  if (!user) {
    sendJson(res, 404, { error: "User not found." });
    return;
  }

  const mastery = getMasteryRecord(db, userId, concept.id)?.mastery || 0.3;
  const difficulty = getTargetDifficulty(mastery);
  const fullQuestions = pickQuizQuestions(concept.id, difficulty, 5);

  const sessionId = uid("quiz");
  db.quizSessions.push({
    id: sessionId,
    userId,
    conceptId: concept.id,
    difficulty,
    createdAt: nowIso(),
    questions: fullQuestions,
  });
  writeDb(db);

  sendJson(res, 200, {
    sessionId,
    conceptId: concept.id,
    conceptLabel: concept.label,
    difficulty,
    questions: fullQuestions.map((question) => ({
      id: question.id,
      stem: question.stem,
      options: question.options,
      bloom: question.bloom,
      difficulty: question.difficulty,
    })),
  });
};

const handleSubmitQuiz = async (req, res) => {
  const payload = await parseJsonBody(req, res);
  if (!payload) return;

  const userId = safeText(payload.userId, 120);
  const sessionId = safeText(payload.sessionId, 120);
  const answers = payload.answers && typeof payload.answers === "object" ? payload.answers : {};

  if (!userId || !sessionId) {
    sendJson(res, 400, { error: "userId and sessionId are required." });
    return;
  }

  const db = readDb();
  const user = db.users.find((item) => item.id === userId);
  if (!user) {
    sendJson(res, 404, { error: "User not found." });
    return;
  }

  const session = db.quizSessions.find((item) => item.id === sessionId && item.userId === userId);
  if (!session) {
    sendJson(res, 404, { error: "Quiz session not found or expired." });
    return;
  }

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
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  const mastery = updateMastery(db, userId, session.conceptId, correctCount, totalQuestions);
  const attempt = {
    id: uid("attempt"),
    userId,
    classId: user.classId,
    conceptId: session.conceptId,
    scorePercent,
    correctCount,
    totalQuestions,
    submittedAt: nowIso(),
  };
  db.quizAttempts.push(attempt);
  db.quizSessions = db.quizSessions.filter((item) => item.id !== sessionId);
  db.learningEvents.push({
    id: uid("event"),
    type: "quiz_submit",
    userId,
    classId: user.classId,
    conceptId: session.conceptId,
    scorePercent,
    createdAt: nowIso(),
  });
  writeDb(db);

  sendJson(res, 200, {
    attempt,
    mastery: {
      conceptId: mastery.conceptId,
      conceptLabel: CONCEPTS[mastery.conceptId]?.label || mastery.conceptId,
      masteryPercent: Math.round(mastery.mastery * 100),
      riskLevel: getRiskLevel(db, userId),
    },
    feedback,
    recommendation:
      scorePercent < 60
        ? "Revise with one worked example and retry a beginner quiz."
        : "Good progress. Move to intermediate examples and explain to a peer.",
  });
};

const handleStudentInsights = (res, userId) => {
  const db = readDb();
  const user = db.users.find((item) => item.id === userId && item.role === "student");
  if (!user) {
    sendJson(res, 404, { error: "Student not found." });
    return;
  }
  sendJson(res, 200, summarizeStudentInsights(db, user));
};

const handleTeacherDashboard = (res, classIdRaw) => {
  const classId = slugify(classIdRaw || "cse-fy-a");
  const db = readDb();
  const dashboard = buildTeacherDashboard(db, classId);
  sendJson(res, 200, dashboard);
};

const handleTeacherInterventions = async (req, res, classIdRaw) => {
  const payload = await parseJsonBody(req, res);
  if (!payload) return;

  const classId = slugify(classIdRaw || "cse-fy-a");
  const db = readDb();
  const dashboard = buildTeacherDashboard(db, classId);
  const interventions = buildInterventions(dashboard);
  sendJson(res, 200, {
    classId,
    generatedAt: nowIso(),
    interventions,
  });
};

const handleSeedDemo = async (req, res) => {
  const payload = await parseJsonBody(req, res);
  if (!payload) return;
  const classId = slugify(payload.classId || "cse-fy-a");
  const db = readDb();
  const seeded = seedDemoClass(db, classId);
  writeDb(db);
  sendJson(res, 200, { classId, ...seeded });
};

const serveStatic = (req, res, pathname) => {
  const normalizedPath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.join(ROOT_DIR, normalizedPath);
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
};

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname;

  if (pathname.startsWith("/api/")) {
    if (pathname === "/api/health" && req.method === "GET") {
      sendJson(res, 200, {
        ok: true,
        app: "EduTwin AI",
        timestamp: nowIso(),
        model: OPENAI_MODEL,
        hasOpenAIKey: Boolean(OPENAI_API_KEY),
      });
      return;
    }

    if (pathname === "/api/concepts" && req.method === "GET") {
      sendJson(
        res,
        200,
        Object.values(CONCEPTS).map((concept) => ({
          id: concept.id,
          label: concept.label,
        }))
      );
      return;
    }

    if (pathname === "/api/users" && req.method === "POST") {
      await handleCreateUser(req, res);
      return;
    }

    if (pathname === "/api/explain" && req.method === "POST") {
      await handleExplain(req, res);
      return;
    }

    if (pathname === "/api/quiz/generate" && req.method === "POST") {
      await handleGenerateQuiz(req, res);
      return;
    }

    if (pathname === "/api/quiz/submit" && req.method === "POST") {
      await handleSubmitQuiz(req, res);
      return;
    }

    if (pathname === "/api/demo/seed" && req.method === "POST") {
      await handleSeedDemo(req, res);
      return;
    }

    const studentMatch = pathname.match(/^\/api\/student\/([^/]+)\/insights$/);
    if (studentMatch && req.method === "GET") {
      handleStudentInsights(res, studentMatch[1]);
      return;
    }

    const teacherDashboardMatch = pathname.match(/^\/api\/teacher\/([^/]+)\/dashboard$/);
    if (teacherDashboardMatch && req.method === "GET") {
      handleTeacherDashboard(res, teacherDashboardMatch[1]);
      return;
    }

    const teacherInterventionsMatch = pathname.match(/^\/api\/teacher\/([^/]+)\/interventions$/);
    if (teacherInterventionsMatch && req.method === "POST") {
      await handleTeacherInterventions(req, res, teacherInterventionsMatch[1]);
      return;
    }

    sendJson(res, 404, { error: "API route not found." });
    return;
  }

  if (req.method === "GET") {
    serveStatic(req, res, pathname);
    return;
  }

  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(PORT, () => {
  ensureStore();
  console.log(`EduTwin server running at http://localhost:${PORT}`);
});
