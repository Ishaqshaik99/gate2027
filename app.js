const STORAGE_KEYS = {
  targetDate: "gate2027.targetDate",
  dailyPlan: "gate2027.dailyPlan",
  syllabus: "gate2027.syllabusProgress",
  tests: "gate2027.testLog",
  notes: "gate2027.notes",
  focus: "gate2027.weeklyFocus",
  studyLog: "gate2027.studyLog",
  quizLog: "gate2027.quizLog",
  view: "gate2027.view",
  customResources: "gate2027.customResources",
};

const syllabusData = [
  {
    category: "Engineering Mathematics",
    items: [
      { id: "math-discrete", label: "Discrete Mathematics (logic, sets, combinatorics, graphs)" },
      { id: "math-linear", label: "Linear Algebra (matrices, determinants, vector spaces)" },
      { id: "math-calculus", label: "Calculus (limits, differentiation, integration, series)" },
      { id: "math-prob", label: "Probability & Statistics (random variables, distributions)" },
    ],
  },
  {
    category: "Digital Logic",
    items: [
      { id: "dl-boolean", label: "Boolean algebra & logic gates" },
      { id: "dl-comb", label: "Combinational circuits (adders, mux, decoder)" },
      { id: "dl-seq", label: "Sequential circuits (flip-flops, counters, registers)" },
      { id: "dl-number", label: "Number representation & arithmetic" },
    ],
  },
  {
    category: "Computer Organization",
    items: [
      { id: "coa-instructions", label: "Machine instructions & addressing modes" },
      { id: "coa-datapath", label: "ALU, datapath, and control unit" },
      { id: "coa-pipeline", label: "Pipelining and hazards" },
      { id: "coa-memory", label: "Memory hierarchy (cache, virtual memory)" },
      { id: "coa-io", label: "I/O, interrupts, and DMA" },
    ],
  },
  {
    category: "Programming & Data Structures",
    items: [
      { id: "ds-programming", label: "Programming in C (pointers, recursion)" },
      { id: "ds-arrays", label: "Arrays & linked lists" },
      { id: "ds-stack", label: "Stacks & queues" },
      { id: "ds-trees", label: "Trees (BST, heap, traversals)" },
      { id: "ds-graphs", label: "Graphs & representations" },
      { id: "ds-hashing", label: "Hashing and collision resolution" },
    ],
  },
  {
    category: "Algorithms",
    items: [
      { id: "algo-complexity", label: "Time complexity & asymptotic analysis" },
      { id: "algo-sorting", label: "Sorting & searching" },
      { id: "algo-graphs", label: "Graph algorithms (BFS, DFS, shortest paths)" },
      { id: "algo-greedy", label: "Greedy algorithms" },
      { id: "algo-dp", label: "Dynamic programming" },
      { id: "algo-divide", label: "Divide & conquer" },
    ],
  },
  {
    category: "Theory of Computation",
    items: [
      { id: "toc-regular", label: "Regular languages & finite automata" },
      { id: "toc-cfl", label: "Context-free languages & PDA" },
      { id: "toc-tm", label: "Turing machines & decidability" },
      { id: "toc-complexity", label: "Computability & complexity (P, NP)" },
    ],
  },
  {
    category: "Compiler Design",
    items: [
      { id: "comp-lex", label: "Lexical analysis" },
      { id: "comp-parse", label: "Parsing (LL, LR)" },
      { id: "comp-sdt", label: "Syntax-directed translation" },
      { id: "comp-icg", label: "Intermediate code generation" },
      { id: "comp-opt", label: "Code optimization" },
      { id: "comp-codegen", label: "Code generation" },
    ],
  },
  {
    category: "Operating Systems",
    items: [
      { id: "os-process", label: "Processes, threads, and IPC" },
      { id: "os-scheduling", label: "CPU scheduling" },
      { id: "os-sync", label: "Synchronization and deadlocks" },
      { id: "os-memory", label: "Memory management & paging" },
      { id: "os-files", label: "File systems" },
      { id: "os-io", label: "I/O systems" },
    ],
  },
  {
    category: "Databases",
    items: [
      { id: "db-model", label: "ER model & relational model" },
      { id: "db-sql", label: "Relational algebra & SQL" },
      { id: "db-normal", label: "Normalization" },
      { id: "db-transactions", label: "Transactions & concurrency control" },
      { id: "db-index", label: "Indexing (B/B+ trees)" },
    ],
  },
  {
    category: "Computer Networks",
    items: [
      { id: "cn-model", label: "OSI/TCP-IP layers" },
      { id: "cn-datalink", label: "Data link (error & flow control)" },
      { id: "cn-network", label: "Network layer (IP, routing)" },
      { id: "cn-transport", label: "Transport layer (TCP/UDP)" },
      { id: "cn-application", label: "Application layer (HTTP, DNS)" },
    ],
  },
  {
    category: "General Aptitude",
    items: [
      { id: "ga-verbal", label: "Verbal ability & comprehension" },
      { id: "ga-quant", label: "Quantitative aptitude" },
      { id: "ga-reason", label: "Analytical reasoning & data interpretation" },
    ],
  },
];

const resourcesCatalog = [
  {
    id: "res-ocw-18-06",
    category: "Engineering Mathematics",
    title: "MIT OCW 18.06 Linear Algebra",
    type: "Course",
    url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/",
    note: "Full video lectures, problem sets, and exams.",
  },
  {
    id: "res-ocw-18-01",
    category: "Engineering Mathematics",
    title: "MIT OCW 18.01 Calculus I",
    type: "Course",
    url: "https://www.ocw.mit.edu/courses/18-01-calculus-i-single-variable-calculus-fall-2020/",
    note: "Derivatives, integrals, and series with structured practice.",
  },
  {
    id: "res-ocw-6-041",
    category: "Engineering Mathematics",
    title: "MIT OCW 6.041 Probabilistic Systems Analysis",
    type: "Course",
    url: "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/",
    note: "Probability models, distributions, and inference.",
  },
  {
    id: "res-nptel-discrete",
    category: "Engineering Mathematics",
    title: "NPTEL Discrete Mathematics",
    type: "Course",
    url: "https://nptel.ac.in/courses/106/106/106106183/",
    note: "Logic, combinatorics, and graph fundamentals.",
  },
  {
    id: "res-nptel-digital",
    category: "Digital Logic",
    title: "NPTEL Digital Circuits",
    type: "Course",
    url: "https://archive.nptel.ac.in/courses/117/101/117101038/",
    note: "Logic gates, combinational and sequential circuits.",
  },
  {
    id: "res-ocw-6-004",
    category: "Digital Logic",
    title: "MIT OCW 6.004 Computation Structures",
    type: "Course",
    url: "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/",
    note: "Digital logic through computer architecture.",
  },
  {
    id: "res-nptel-coa",
    category: "Computer Organization",
    title: "NPTEL Computer Organization and Architecture",
    type: "Course",
    url: "https://nptel.ac.in/courses/106/103/106103068/",
    note: "Instruction sets, datapath, and memory systems.",
  },
  {
    id: "res-ocw-6-004-coa",
    category: "Computer Organization",
    title: "MIT OCW 6.004 Computation Structures",
    type: "Course",
    url: "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/",
    note: "Bridges hardware design and architecture.",
  },
  {
    id: "res-nptel-ds",
    category: "Programming & Data Structures",
    title: "NPTEL Data Structures and Algorithms Design",
    type: "Course",
    url: "https://nptel.ac.in/courses/106/106/106106179/",
    note: "Data structures with algorithmic design patterns.",
  },
  {
    id: "res-ocw-6-006",
    category: "Programming & Data Structures",
    title: "MIT OCW 6.006 Introduction to Algorithms",
    type: "Course",
    url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
    note: "Core data structures and algorithmic paradigms.",
  },
  {
    id: "res-cp-algorithms",
    category: "Programming & Data Structures",
    title: "CP-Algorithms",
    type: "Reference",
    url: "https://cp-algorithms.com/",
    note: "Quick reference for algorithms and data structures.",
  },
  {
    id: "res-ocw-6-006-algo",
    category: "Algorithms",
    title: "MIT OCW 6.006 Introduction to Algorithms",
    type: "Course",
    url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
    note: "Sorting, graphs, dynamic programming, and more.",
  },
  {
    id: "res-cp-algorithms-algo",
    category: "Algorithms",
    title: "CP-Algorithms",
    type: "Reference",
    url: "https://cp-algorithms.com/",
    note: "Concise algorithm explanations with proofs and code.",
  },
  {
    id: "res-ocw-6-045",
    category: "Theory of Computation",
    title: "MIT OCW 6.045J Automata, Computability, and Complexity",
    type: "Course",
    url: "https://ocw.mit.edu/courses/6-045j-automata-computability-and-complexity-spring-2011/",
    note: "Automata, Turing machines, and complexity.",
  },
  {
    id: "res-nptel-toc",
    category: "Theory of Computation",
    title: "NPTEL Theory of Computation",
    type: "Course",
    url: "https://archive.nptel.ac.in/noc/courses/noc17/SEM2/noc17-cs34/",
    note: "Foundations of automata, grammar, and computability.",
  },
  {
    id: "res-stanford-cs143",
    category: "Compiler Design",
    title: "Stanford CS143 Compilers",
    type: "Course",
    url: "https://web.stanford.edu/class/cs143/",
    note: "Compiler construction with lectures and assignments.",
  },
  {
    id: "res-nptel-compiler",
    category: "Compiler Design",
    title: "NPTEL Compiler Design",
    type: "Course",
    url: "https://nptel.ac.in/courses/106/105/106105190/",
    note: "Lexing, parsing, and code generation basics.",
  },
  {
    id: "res-ostep",
    category: "Operating Systems",
    title: "Operating Systems: Three Easy Pieces (OSTEP)",
    type: "Book",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    note: "Free OS textbook covering processes, memory, and file systems.",
  },
  {
    id: "res-nptel-os",
    category: "Operating Systems",
    title: "NPTEL Operating Systems",
    type: "Course",
    url: "https://nptel.ac.in/courses/106/102/106102132/",
    note: "OS fundamentals with scheduling and memory management.",
  },
  {
    id: "res-cmu-15445",
    category: "Databases",
    title: "CMU 15-445 Database Systems",
    type: "Course",
    url: "https://15445.courses.cs.cmu.edu/fall2023/",
    note: "Database internals, indexing, and transactions.",
  },
  {
    id: "res-stanford-cs144",
    category: "Computer Networks",
    title: "Stanford CS144 Computer Networking",
    type: "Course",
    url: "https://cs144.github.io/",
    note: "End-to-end networking with labs.",
  },
  {
    id: "res-kurose",
    category: "Computer Networks",
    title: "Kurose & Ross Companion Site",
    type: "Book",
    url: "https://gaia.cs.umass.edu/kurose_ross/",
    note: "Companion resources for Computer Networking: A Top-Down Approach.",
  },
  {
    id: "res-nptel-cn",
    category: "Computer Networks",
    title: "NPTEL Computer Networks and Internet Protocol",
    type: "Course",
    url: "https://archive.nptel.ac.in/courses/106/105/106105081/",
    note: "Layered protocols, routing, and congestion control.",
  },
  {
    id: "res-gate-2025-papers",
    category: "General Aptitude",
    title: "GATE 2025 Official Previous Year Papers",
    type: "Practice",
    url: "https://gate2025.iitr.ac.in/download.html",
    note: "Official bulk download of previous years question papers.",
  },
  {
    id: "res-gate-2024-syllabus",
    category: "General Aptitude",
    title: "GATE 2024 Papers & Syllabus",
    type: "Reference",
    url: "https://gate2024.iisc.ac.in/papers-and-syllabus/",
    note: "Official paper codes and syllabus downloads.",
  },
  {
    id: "res-gate-2021-papers",
    category: "General Aptitude",
    title: "GATE 2021 Official Previous Papers",
    type: "Practice",
    url: "https://www.gate.iitb.ac.in/G21/prev_qp.php",
    note: "Official previous year question papers and answer keys.",
  },
  {
    id: "res-yt-mit-1806",
    category: "Engineering Mathematics",
    title: "MIT 18.06 Linear Algebra (YouTube)",
    type: "YouTube Playlist",
    url: "https://www.youtube.com/playlist?list=PLE7DDD91010BC51F8",
    note: "Gilbert Strang's full linear algebra lecture series.",
  },
  {
    id: "res-yt-mit-1801",
    category: "Engineering Mathematics",
    title: "MIT 18.01 Single Variable Calculus (YouTube)",
    type: "YouTube Playlist",
    url: "https://www.youtube.com/playlist?list=PL590CCC2BC5AF3BC1",
    note: "Complete MIT calculus lectures with examples.",
  },
  {
    id: "res-yt-mit-6006",
    category: "Programming & Data Structures",
    title: "MIT 6.006 Introduction to Algorithms (YouTube)",
    type: "YouTube Playlist",
    url: "https://www.youtube.com/playlist?list=PLUl4u3cNGP63EdVPNLG3ToM6LaEUuStEY",
    note: "MIT lectures covering data structures and core algorithms.",
  },
  {
    id: "res-yt-cmu-15445",
    category: "Databases",
    title: "CMU 15-445 Database Systems (YouTube)",
    type: "YouTube Playlist",
    url: "https://www.youtube.com/playlist?list=PLSE8ODhjZXjaKScG3l0nuOiDTTqpfnWFf",
    note: "CMU Database Group lectures with slides and demos.",
  },
  {
    id: "res-yt-nptel-digital",
    category: "Digital Logic",
    title: "NPTEL Digital Circuits Lecture (YouTube)",
    type: "YouTube Lecture",
    url: "https://www.youtube.com/live/X7M3rUxUpOc",
    note: "NPTEL lecture on digital circuits by IIT Kharagpur.",
  },
  {
    id: "res-yt-nptel-coa",
    category: "Computer Organization",
    title: "NPTEL Computer Organization Channel (YouTube)",
    type: "YouTube Channel",
    url: "https://www.youtube.com/channel/UC2GUBG_WsP0OO5tXXocwp3Q",
    note: "NPTEL IITG computer organization lecture series.",
  },
  {
    id: "res-yt-nptel-toc",
    category: "Theory of Computation",
    title: "NPTEL Theory of Computation Lecture (YouTube)",
    type: "YouTube Lecture",
    url: "https://www.youtube.com/watch?v=0cMd3lhjb9A",
    note: "Intro lecture for TOC from NPTEL.",
  },
  {
    id: "res-yt-nptel-compiler",
    category: "Compiler Design",
    title: "NPTEL Compiler Design Special Lecture (YouTube)",
    type: "YouTube Lecture",
    url: "https://www.youtube.com/watch?v=XUmdEBQTtz0",
    note: "NPTEL lecture on compiler design industry perspectives.",
  },
  {
    id: "res-yt-nptel-os",
    category: "Operating Systems",
    title: "NPTEL Intro to Operating Systems (YouTube)",
    type: "YouTube Lecture",
    url: "https://www.youtube.com/watch?v=w8iFQ812oCk",
    note: "NPTEL lecture on OS virtualization basics.",
  },
  {
    id: "res-yt-nptel-cn",
    category: "Computer Networks",
    title: "NPTEL Advanced Computer Networks Intro (YouTube)",
    type: "YouTube Lecture",
    url: "https://www.youtube.com/watch?v=dN-sJpsYBrU",
    note: "NPTEL intro lecture for advanced computer networks.",
  },
  {
    id: "res-tg-gateoverflow-cse",
    category: "Community & Telegram",
    title: "GATE Overflow CSE (Telegram)",
    type: "Telegram",
    url: "https://t.me/gateoverflow_cse",
    note: "Community discussion group for GATE CSE.",
  },
  {
    id: "res-tg-gateoverflow-broadcast",
    category: "Community & Telegram",
    title: "GATE Overflow Announcements (Telegram)",
    type: "Telegram",
    url: "https://t.me/gateoverflow_broadcast",
    note: "Announcement channel for updates and schedules.",
  },
  {
    id: "res-tg-cse-gate-notes",
    category: "Community & Telegram",
    title: "CSE GATE Notes (Telegram)",
    type: "Telegram",
    url: "https://t.me/cse_gate_notes",
    note: "Shared notes and quick revision tips.",
  },
  {
    id: "res-tg-csgate-ankush",
    category: "Community & Telegram",
    title: "CS GATE (Ankush Saklecha) (Telegram)",
    type: "Telegram",
    url: "https://t.me/csgateankushsaklecha",
    note: "Updates and resources from a GATE faculty channel.",
  },
];

const resourcesByCategory = {
  "Engineering Mathematics": [
    "res-ocw-18-06",
    "res-ocw-18-01",
    "res-ocw-6-041",
    "res-nptel-discrete",
    "res-yt-mit-1806",
    "res-yt-mit-1801",
  ],
  "Digital Logic": ["res-nptel-digital", "res-ocw-6-004", "res-yt-nptel-digital"],
  "Computer Organization": ["res-nptel-coa", "res-ocw-6-004-coa", "res-yt-nptel-coa"],
  "Programming & Data Structures": ["res-nptel-ds", "res-ocw-6-006", "res-cp-algorithms", "res-yt-mit-6006"],
  "Algorithms": ["res-ocw-6-006-algo", "res-cp-algorithms-algo", "res-yt-mit-6006"],
  "Theory of Computation": ["res-ocw-6-045", "res-nptel-toc", "res-yt-nptel-toc"],
  "Compiler Design": ["res-stanford-cs143", "res-nptel-compiler", "res-yt-nptel-compiler"],
  "Operating Systems": ["res-ostep", "res-nptel-os", "res-yt-nptel-os"],
  Databases: ["res-cmu-15445", "res-yt-cmu-15445"],
  "Computer Networks": ["res-stanford-cs144", "res-kurose", "res-nptel-cn", "res-yt-nptel-cn"],
  "General Aptitude": ["res-gate-2025-papers", "res-gate-2024-syllabus", "res-gate-2021-papers"],
  "Community & Telegram": [
    "res-tg-gateoverflow-cse",
    "res-tg-gateoverflow-broadcast",
    "res-tg-cse-gate-notes",
    "res-tg-csgate-ankush",
  ],
};

const topicDetails = {
  "math-discrete": {
    summary:
      "Focus on logic, sets, relations, and graph basics. Practice counting and proof techniques (induction, contradiction).",
    quiz: [
      {
        question: "How many edges are in a complete graph K_n?",
        options: ["n^2", "n(n-1)/2", "2n", "n-1"],
        answer: 1,
        explain: "K_n has an edge between every pair of vertices, giving n(n-1)/2 edges.",
      },
    ],
  },
  "math-linear": {
    summary:
      "Master matrices, determinants, eigenvalues, and vector spaces. Link transformations to systems of equations.",
    quiz: [
      {
        question: "If det(A) = 0, then matrix A is:",
        options: ["Orthogonal", "Singular", "Identity", "Diagonal"],
        answer: 1,
        explain: "A zero determinant means A is not invertible, i.e., singular.",
      },
    ],
  },
  "math-calculus": {
    summary:
      "Revise limits, differentiation, integration, and series expansions for quick problem solving.",
    quiz: [
      {
        question: "The derivative of sin(x) is:",
        options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
        answer: 0,
        explain: "d/dx sin(x) = cos(x).",
      },
    ],
  },
  "math-prob": {
    summary:
      "Cover random variables, distributions, expectation, variance, and Bayes theorem with practice problems.",
    quiz: [
      {
        question: "If events A and B are independent, then P(A ∩ B) =",
        options: ["P(A)+P(B)", "P(A)P(B)", "P(A)/P(B)", "P(A)-P(B)"],
        answer: 1,
        explain: "Independence implies P(A ∩ B) = P(A)P(B).",
      },
    ],
  },
  "dl-boolean": {
    summary: "Practice Boolean identities, canonical forms, and logic gate simplifications.",
    quiz: [
      {
        question: "De Morgan's law says that (A + B)' equals:",
        options: ["A' + B'", "A'B'", "A + B", "AB"],
        answer: 1,
        explain: "Complement of OR is AND of complements: (A + B)' = A'B'.",
      },
    ],
  },
  "dl-comb": {
    summary: "Understand mux/demux, encoders/decoders, adders, and combinational circuit design.",
    quiz: [
      {
        question: "A multiplexer selects:",
        options: ["One of many inputs", "One of many outputs", "All inputs", "Only control lines"],
        answer: 0,
        explain: "A mux routes one selected input to the output.",
      },
    ],
  },
  "dl-seq": {
    summary: "Study latches, flip-flops, counters, registers, and FSM design.",
    quiz: [
      {
        question: "A flip-flop stores:",
        options: ["2 bits", "1 bit", "8 bits", "16 bits"],
        answer: 1,
        explain: "A flip-flop is a 1-bit storage element.",
      },
    ],
  },
  "dl-number": {
    summary: "Cover binary arithmetic, two's complement, and overflow detection.",
    quiz: [
      {
        question: "The two's complement of 0101 is:",
        options: ["1010", "1011", "0110", "1111"],
        answer: 1,
        explain: "Invert and add 1: 0101 -> 1010 -> 1011.",
      },
    ],
  },
  "coa-instructions": {
    summary: "Focus on instruction formats, addressing modes, and ISA basics.",
    quiz: [
      {
        question: "Register indirect addressing uses:",
        options: ["Immediate data", "Register value as address", "PC as address", "Index only"],
        answer: 1,
        explain: "The register holds the memory address of the operand.",
      },
    ],
  },
  "coa-datapath": {
    summary: "Understand ALU operations, control signals, and single-cycle datapaths.",
    quiz: [
      {
        question: "The ALU primarily performs:",
        options: ["I/O", "Arithmetic and logic", "Memory refresh", "Branch prediction"],
        answer: 1,
        explain: "ALU is responsible for arithmetic and logical operations.",
      },
    ],
  },
  "coa-pipeline": {
    summary: "Learn pipeline stages, speedup, and hazards with fixes like forwarding.",
    quiz: [
      {
        question: "A data hazard occurs when:",
        options: ["Branch is taken", "Instruction depends on previous result", "Cache miss", "TLB hit"],
        answer: 1,
        explain: "Dependent instructions cause data hazards in pipelines.",
      },
    ],
  },
  "coa-memory": {
    summary: "Revise cache mapping, locality, and virtual memory basics.",
    quiz: [
      {
        question: "Cache memory exploits:",
        options: ["Randomness", "Locality", "Speculation", "Encryption"],
        answer: 1,
        explain: "Caches work due to temporal and spatial locality.",
      },
    ],
  },
  "coa-io": {
    summary: "Study I/O organization, interrupts, DMA, and device controllers.",
    quiz: [
      {
        question: "DMA allows:",
        options: ["CPU-only data transfer", "Device to memory transfer without CPU", "Only cache transfer", "Only I/O polling"],
        answer: 1,
        explain: "DMA bypasses CPU for bulk transfers.",
      },
    ],
  },
  "ds-programming": {
    summary: "C programming essentials: pointers, recursion, and memory management.",
    quiz: [
      {
        question: "A pointer in C stores:",
        options: ["A value", "An address", "A character", "A function"],
        answer: 1,
        explain: "Pointers store memory addresses.",
      },
    ],
  },
  "ds-arrays": {
    summary: "Array indexing, linked list traversal, and complexity trade-offs.",
    quiz: [
      {
        question: "Accessing an array element by index is:",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 0,
        explain: "Array access is constant time.",
      },
    ],
  },
  "ds-stack": {
    summary: "Stacks, queues, and their standard operations with typical use-cases.",
    quiz: [
      {
        question: "A stack follows:",
        options: ["FIFO", "LIFO", "Random", "Priority"],
        answer: 1,
        explain: "Stack order is Last-In First-Out.",
      },
    ],
  },
  "ds-trees": {
    summary: "Binary trees, BST property, heaps, and traversal orders.",
    quiz: [
      {
        question: "In-order traversal of a BST yields:",
        options: ["Random order", "Sorted order", "Reverse order", "Level order"],
        answer: 1,
        explain: "In-order traversal of BST gives keys in sorted order.",
      },
    ],
  },
  "ds-graphs": {
    summary: "Graph representations and basic traversal strategies.",
    quiz: [
      {
        question: "Adjacency matrix uses space:",
        options: ["O(V)", "O(E)", "O(V^2)", "O(log V)"],
        answer: 2,
        explain: "Adjacency matrix stores VxV entries.",
      },
    ],
  },
  "ds-hashing": {
    summary: "Hash functions, collision handling, and load factor impacts.",
    quiz: [
      {
        question: "A common collision resolution technique is:",
        options: ["Chaining", "Sorting", "Scanning", "Partitioning"],
        answer: 0,
        explain: "Chaining stores colliding keys in a list.",
      },
    ],
  },
  "algo-complexity": {
    summary: "Analyze time/space complexity with asymptotic notations.",
    quiz: [
      {
        question: "Binary search runs in:",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        answer: 1,
        explain: "Binary search halves the search space each step.",
      },
    ],
  },
  "algo-sorting": {
    summary: "Sorting algorithms, stability, and average vs worst-case costs.",
    quiz: [
      {
        question: "Which sort is stable?",
        options: ["Quick sort", "Heap sort", "Merge sort", "Selection sort"],
        answer: 2,
        explain: "Merge sort maintains relative order of equal elements.",
      },
    ],
  },
  "algo-graphs": {
    summary: "BFS/DFS, shortest paths, MSTs, and graph traversal properties.",
    quiz: [
      {
        question: "BFS in an unweighted graph finds:",
        options: ["Longest path", "Shortest path in edges", "MST", "Strongly connected components"],
        answer: 1,
        explain: "BFS explores in layers, giving shortest path in edge count.",
      },
    ],
  },
  "algo-greedy": {
    summary: "Greedy choice property and exchange arguments for correctness.",
    quiz: [
      {
        question: "A greedy algorithm makes:",
        options: ["Global optimal choice", "Local optimal choice", "Random choice", "No choice"],
        answer: 1,
        explain: "Greedy picks locally optimal choices hoping for global optimality.",
      },
    ],
  },
  "algo-dp": {
    summary: "Dynamic programming with overlapping subproblems and memoization.",
    quiz: [
      {
        question: "DP is most useful when a problem has:",
        options: ["No subproblems", "Overlapping subproblems", "Only recursion", "Only loops"],
        answer: 1,
        explain: "DP leverages overlapping subproblems and optimal substructure.",
      },
    ],
  },
  "algo-divide": {
    summary: "Divide & conquer strategy with recursion and merge steps.",
    quiz: [
      {
        question: "Merge sort is an example of:",
        options: ["Greedy", "Dynamic programming", "Divide and conquer", "Backtracking"],
        answer: 2,
        explain: "Merge sort splits, sorts, and merges subproblems.",
      },
    ],
  },
  "toc-regular": {
    summary: "Regular languages, DFA/NFA, and regular expressions.",
    quiz: [
      {
        question: "Regular languages are recognized by:",
        options: ["Turing machines", "Pushdown automata", "Finite automata", "Linear bounded automata"],
        answer: 2,
        explain: "Finite automata accept regular languages.",
      },
    ],
  },
  "toc-cfl": {
    summary: "Context-free grammars, PDA, and pumping lemma for CFLs.",
    quiz: [
      {
        question: "Context-free languages are recognized by:",
        options: ["DFA", "PDA", "TM only", "Regex"],
        answer: 1,
        explain: "Pushdown automata recognize CFLs.",
      },
    ],
  },
  "toc-tm": {
    summary: "Turing machines, decidability, and reductions.",
    quiz: [
      {
        question: "The Church-Turing thesis states:",
        options: ["All problems are solvable", "Any computable function can be computed by a TM", "Only finite automata are needed", "NP = P"],
        answer: 1,
        explain: "Turing machines model all effectively computable functions.",
      },
    ],
  },
  "toc-complexity": {
    summary: "Complexity classes, P vs NP, and reductions.",
    quiz: [
      {
        question: "A problem is in NP if:",
        options: ["It can be solved in exponential time", "A solution can be verified in polynomial time", "It is undecidable", "It is in P only"],
        answer: 1,
        explain: "NP problems have polynomial-time verifiable certificates.",
      },
    ],
  },
  "comp-lex": {
    summary: "Tokenization, regular expressions, and lexical analyzers.",
    quiz: [
      {
        question: "The lexical analyzer produces:",
        options: ["Parse tree", "Tokens", "Machine code", "Symbol table only"],
        answer: 1,
        explain: "Lexer converts source code into tokens.",
      },
    ],
  },
  "comp-parse": {
    summary: "Top-down and bottom-up parsing with grammar analysis.",
    quiz: [
      {
        question: "LL parsing is:",
        options: ["Bottom-up", "Top-down", "Random", "Lexical"],
        answer: 1,
        explain: "LL parsers construct parse trees top-down.",
      },
    ],
  },
  "comp-sdt": {
    summary: "Syntax-directed translation with semantic actions.",
    quiz: [
      {
        question: "Syntax-directed translation attaches:",
        options: ["Machine instructions", "Semantic actions to grammar", "Network packets", "Only tokens"],
        answer: 1,
        explain: "SDT uses semantic actions with grammar rules.",
      },
    ],
  },
  "comp-icg": {
    summary: "Intermediate representations such as three-address code.",
    quiz: [
      {
        question: "A common intermediate code form is:",
        options: ["Binary machine code", "Three-address code", "Microcode", "Assembly only"],
        answer: 1,
        explain: "Three-address code is a common IR.",
      },
    ],
  },
  "comp-opt": {
    summary: "Optimization techniques like CSE, loop invariant motion.",
    quiz: [
      {
        question: "Common subexpression elimination reduces:",
        options: ["Memory", "Redundant computations", "Variables", "Compilation time"],
        answer: 1,
        explain: "CSE removes repeated computations.",
      },
    ],
  },
  "comp-codegen": {
    summary: "Register allocation and instruction selection for target machines.",
    quiz: [
      {
        question: "Code generation outputs:",
        options: ["Tokens", "Parse trees", "Target machine code", "IR"],
        answer: 2,
        explain: "The backend generates target machine code.",
      },
    ],
  },
  "os-process": {
    summary: "Process states, threads, IPC mechanisms, and context switching.",
    quiz: [
      {
        question: "A process is:",
        options: ["A program in execution", "A compiler phase", "An OS file", "A hardware device"],
        answer: 0,
        explain: "A process is a running instance of a program.",
      },
    ],
  },
  "os-scheduling": {
    summary: "CPU scheduling policies like FCFS, SJF, and Round Robin.",
    quiz: [
      {
        question: "Round Robin scheduling uses:",
        options: ["Priority queue", "Time quantum", "Deadlock detection", "Paging"],
        answer: 1,
        explain: "Round Robin assigns a fixed time quantum.",
      },
    ],
  },
  "os-sync": {
    summary: "Critical sections, semaphores, mutex, and deadlock prevention.",
    quiz: [
      {
        question: "Semaphores are used for:",
        options: ["Compilation", "Synchronization", "Routing", "Sorting"],
        answer: 1,
        explain: "Semaphores provide synchronization primitives.",
      },
    ],
  },
  "os-memory": {
    summary: "Paging, segmentation, and page replacement policies.",
    quiz: [
      {
        question: "LRU stands for:",
        options: ["Least Recent Use", "Last Recent Use", "Least Recently Used", "Longest Recent Use"],
        answer: 2,
        explain: "LRU replaces the least recently used page.",
      },
    ],
  },
  "os-files": {
    summary: "File system structures, allocation methods, and inodes.",
    quiz: [
      {
        question: "An inode stores:",
        options: ["File name", "File metadata", "File contents", "Network address"],
        answer: 1,
        explain: "Inode stores metadata like permissions and pointers.",
      },
    ],
  },
  "os-io": {
    summary: "Interrupts, device drivers, and I/O scheduling.",
    quiz: [
      {
        question: "Interrupts are used to:",
        options: ["Slow CPU", "Signal hardware events", "Store files", "Manage users"],
        answer: 1,
        explain: "Interrupts notify CPU of hardware events.",
      },
    ],
  },
  "db-model": {
    summary: "Relational model basics, keys, and ER modeling.",
    quiz: [
      {
        question: "A primary key:",
        options: ["Can be NULL", "Uniquely identifies a tuple", "Is optional", "Is always composite"],
        answer: 1,
        explain: "Primary key uniquely identifies each row.",
      },
    ],
  },
  "db-sql": {
    summary: "SQL queries, joins, and relational algebra fundamentals.",
    quiz: [
      {
        question: "SELECT * FROM Students is used to:",
        options: ["Delete rows", "Retrieve all rows", "Update rows", "Create table"],
        answer: 1,
        explain: "SELECT retrieves records from a table.",
      },
    ],
  },
  "db-normal": {
    summary: "Normalization rules (1NF, 2NF, 3NF, BCNF).",
    quiz: [
      {
        question: "3NF removes:",
        options: ["Partial dependency", "Transitive dependency", "All keys", "Foreign keys"],
        answer: 1,
        explain: "3NF eliminates transitive dependencies.",
      },
    ],
  },
  "db-transactions": {
    summary: "ACID properties, scheduling, and concurrency control.",
    quiz: [
      {
        question: "ACID stands for:",
        options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Consistency, Indexing, Durability", "Atomicity, Caching, Isolation, Distribution", "Access, Consistency, Integrity, Durability"],
        answer: 0,
        explain: "ACID: Atomicity, Consistency, Isolation, Durability.",
      },
    ],
  },
  "db-index": {
    summary: "Indexing structures like B/B+ trees and hashing.",
    quiz: [
      {
        question: "B+ trees are mainly used for:",
        options: ["Sorting in memory", "Database indexing", "Compression", "Encryption"],
        answer: 1,
        explain: "B+ trees are common disk-based index structures.",
      },
    ],
  },
  "cn-model": {
    summary: "Layered models, encapsulation, and protocol roles.",
    quiz: [
      {
        question: "In TCP/IP, the transport layer corresponds to OSI layer:",
        options: ["2", "3", "4", "7"],
        answer: 2,
        explain: "Transport is layer 4 in OSI.",
      },
    ],
  },
  "cn-datalink": {
    summary: "Error detection, flow control, and MAC protocols.",
    quiz: [
      {
        question: "CRC is used for:",
        options: ["Routing", "Error detection", "Encryption", "Scheduling"],
        answer: 1,
        explain: "CRC detects errors in transmitted frames.",
      },
    ],
  },
  "cn-network": {
    summary: "IP addressing, routing, and subnetting.",
    quiz: [
      {
        question: "IP routers use:",
        options: ["Exact match", "Longest prefix match", "Random forwarding", "Round robin"],
        answer: 1,
        explain: "Routers match the longest prefix in routing tables.",
      },
    ],
  },
  "cn-transport": {
    summary: "TCP/UDP, flow control, and congestion handling.",
    quiz: [
      {
        question: "TCP provides:",
        options: ["Unreliable delivery", "Reliable ordered delivery", "Broadcast only", "No congestion control"],
        answer: 1,
        explain: "TCP ensures reliable, ordered delivery with congestion control.",
      },
    ],
  },
  "cn-application": {
    summary: "Application protocols like HTTP, DNS, SMTP.",
    quiz: [
      {
        question: "DNS is used to:",
        options: ["Encrypt traffic", "Resolve names to IPs", "Allocate ports", "Route packets"],
        answer: 1,
        explain: "DNS maps domain names to IP addresses.",
      },
    ],
  },
  "ga-verbal": {
    summary: "Grammar, comprehension, and vocabulary basics.",
    quiz: [
      {
        question: "The word 'concise' means:",
        options: ["Wordy", "Brief", "Confusing", "Late"],
        answer: 1,
        explain: "Concise means brief and to the point.",
      },
    ],
  },
  "ga-quant": {
    summary: "Arithmetic, algebra, and data interpretation.",
    quiz: [
      {
        question: "If x = 2 and y = 3, then x + y =",
        options: ["4", "5", "6", "7"],
        answer: 1,
        explain: "2 + 3 = 5.",
      },
    ],
  },
  "ga-reason": {
    summary: "Patterns, sequences, and logical reasoning practice.",
    quiz: [
      {
        question: "Find the next number in 2, 4, 8, 16, ?",
        options: ["18", "20", "24", "32"],
        answer: 3,
        explain: "Each term doubles; next is 32.",
      },
    ],
  },
};

const resourceMap = Object.fromEntries(resourcesCatalog.map((resource) => [resource.id, resource]));

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

const todayISO = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const toLocalISO = (date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const parseLocalDate = (value) => new Date(`${value}T00:00:00`);

const formatDate = (value) => {
  if (!value) return "";
  const date = parseLocalDate(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatMinutes = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const safeId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const state = {
  plan: store.get(STORAGE_KEYS.dailyPlan, []),
  syllabus: store.get(STORAGE_KEYS.syllabus, {}),
  tests: store.get(STORAGE_KEYS.tests, []),
  targetDate: store.get(STORAGE_KEYS.targetDate, ""),
  notes: store.get(STORAGE_KEYS.notes, ""),
  focus: store.get(STORAGE_KEYS.focus, ["", "", ""]),
  studyLog: store.get(STORAGE_KEYS.studyLog, []),
  quizLog: store.get(STORAGE_KEYS.quizLog, []),
  view: store.get(STORAGE_KEYS.view, { category: "", topic: "", filter: "All" }),
  customResources: store.get(STORAGE_KEYS.customResources, []),
  lastQuizTopic: null,
};

const elements = {
  targetDate: document.getElementById("targetDate"),
  daysLeft: document.getElementById("daysLeft"),
  overallProgressText: document.getElementById("overallProgressText"),
  overallProgressBar: document.getElementById("overallProgressBar"),
  statDays: document.getElementById("statDays"),
  statTopics: document.getElementById("statTopics"),
  statTasks: document.getElementById("statTasks"),
  statScore: document.getElementById("statScore"),
  statStreak: document.getElementById("statStreak"),
  statBest: document.getElementById("statBest"),
  subjectNav: document.getElementById("subjectNav"),
  streakGrid: document.getElementById("streakGrid"),
  quizHistory: document.getElementById("quizHistory"),
  logStudy: document.getElementById("logStudy"),
  planForm: document.getElementById("planForm"),
  planList: document.getElementById("planList"),
  showAllTasks: document.getElementById("showAllTasks"),
  syllabus: document.getElementById("syllabus"),
  testForm: document.getElementById("testForm"),
  testList: document.getElementById("testList"),
  testStats: document.getElementById("testStats"),
  notes: document.getElementById("notes"),
  notesSave: document.getElementById("notesSave"),
  notesStatus: document.getElementById("notesStatus"),
  focusInputs: [
    document.getElementById("focus1"),
    document.getElementById("focus2"),
    document.getElementById("focus3"),
  ],
  resetButton: document.getElementById("resetButton"),
  exportButton: document.getElementById("exportButton"),
  importButton: document.getElementById("importButton"),
  importFile: document.getElementById("importFile"),
  pomodoroClock: document.getElementById("pomodoroClock"),
  pomodoroMode: document.getElementById("pomodoroMode"),
  pomodoroCycle: document.getElementById("pomodoroCycle"),
  pomodoroStart: document.getElementById("pomodoroStart"),
  pomodoroPause: document.getElementById("pomodoroPause"),
  pomodoroReset: document.getElementById("pomodoroReset"),
  pomodoroSwitch: document.getElementById("pomodoroSwitch"),
  subjectSelect: document.getElementById("subjectSelect"),
  topicSelect: document.getElementById("topicSelect"),
  topicSummary: document.getElementById("topicSummary"),
  topicComplete: document.getElementById("topicComplete"),
  topicQuizButton: document.getElementById("topicQuizButton"),
  topicStatus: document.getElementById("topicStatus"),
  topicResourceList: document.getElementById("topicResourceList"),
  topicVisual: document.getElementById("topicVisual"),
  doubtTopic: document.getElementById("doubtTopic"),
  doubtQuestion: document.getElementById("doubtQuestion"),
  doubtAsk: document.getElementById("doubtAsk"),
  doubtAnswer: document.getElementById("doubtAnswer"),
  resourceSearch: document.getElementById("resourceSearch"),
  resourceForm: document.getElementById("resourceForm"),
  resourceCategory: document.getElementById("resourceCategory"),
  resourceTitle: document.getElementById("resourceTitle"),
  resourceUrl: document.getElementById("resourceUrl"),
  resourceType: document.getElementById("resourceType"),
  resourceNote: document.getElementById("resourceNote"),
  resourcesGrid: document.getElementById("resourcesGrid"),
  quizModal: document.getElementById("quizModal"),
  quizTitle: document.getElementById("quizTitle"),
  quizForm: document.getElementById("quizForm"),
  quizResult: document.getElementById("quizResult"),
  quizClose: document.getElementById("quizClose"),
  quizSubmit: document.getElementById("quizSubmit"),
  quizAsk: document.getElementById("quizAsk"),
  toast: document.getElementById("toast"),
};

const pomodoro = {
  mode: "focus",
  focusMinutes: 25,
  breakMinutes: 5,
  remaining: 25 * 60,
  running: false,
  cycle: 1,
  timerId: null,
};

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getAllCategories = () => {
  const syllabusCategories = syllabusData.map((section) => section.category);
  const resourceCategories = Object.keys(resourcesByCategory);
  return Array.from(new Set([...syllabusCategories, ...resourceCategories]));
};

const getResourcesForCategory = (category) => {
  const baseIds = resourcesByCategory[category] || [];
  const baseResources = baseIds.map((id) => resourceMap[id]).filter(Boolean);
  const customResources = (state.customResources || []).filter((resource) => resource.category === category);
  return [...baseResources, ...customResources];
};

const dedupeResources = (resources) => {
  const seen = new Set();
  return resources.filter((resource) => {
    const key = `${resource.title}-${resource.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getSubjectCategories = () => syllabusData.map((section) => section.category);

const registerCustomResources = () => {
  if (!state.customResources?.length) return;
  state.customResources.forEach((resource) => {
    resourceMap[resource.id] = resource;
  });
};

const categoryVisuals = {
  "Engineering Mathematics": (label) => `
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="200" rx="18" fill="#f7f1e7" />
      <path d="M20 150 C80 80, 140 200, 220 60 S320 120, 340 40" stroke="#1f6f78" stroke-width="4" fill="none" />
      <line x1="40" y1="30" x2="40" y2="170" stroke="#9fb8bc" />
      <line x1="20" y1="150" x2="330" y2="150" stroke="#9fb8bc" />
      <text x="24" y="28" font-size="12" fill="#56636a">f(x)</text>
      <text x="24" y="192" font-size="12" fill="#56636a">x</text>
      <text x="180" y="40" text-anchor="middle" font-size="16" fill="#1f2a2e">${escapeHtml(label)}</text>
    </svg>
  `,
  "Digital Logic": (label) => `
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="200" rx="18" fill="#f6f1e9" />
      <rect x="40" y="60" width="80" height="80" rx="10" fill="#1f6f78" opacity="0.15" />
      <path d="M80 60 L140 100 L80 140 Z" fill="#1f6f78" opacity="0.3" />
      <circle cx="160" cy="100" r="8" fill="#ff835c" />
      <line x1="20" y1="80" x2="40" y2="80" stroke="#1f6f78" stroke-width="4" />
      <line x1="20" y1="120" x2="40" y2="120" stroke="#1f6f78" stroke-width="4" />
      <line x1="168" y1="100" x2="220" y2="100" stroke="#1f6f78" stroke-width="4" />
      <rect x="230" y="70" width="90" height="60" rx="10" fill="#ff835c" opacity="0.2" />
      <text x="180" y="40" text-anchor="middle" font-size="16" fill="#1f2a2e">${escapeHtml(label)}</text>
    </svg>
  `,
  "Computer Organization": (label) => `
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="200" rx="18" fill="#f6f1e9" />
      <rect x="40" y="50" width="120" height="100" rx="12" fill="#1f6f78" opacity="0.15" />
      <rect x="60" y="70" width="80" height="60" rx="8" fill="#1f6f78" opacity="0.3" />
      <rect x="200" y="60" width="120" height="80" rx="12" fill="#ff835c" opacity="0.2" />
      <line x1="160" y1="100" x2="200" y2="100" stroke="#1f6f78" stroke-width="4" />
      <text x="100" y="112" font-size="14" fill="#1f2a2e">CPU</text>
      <text x="230" y="105" font-size="14" fill="#1f2a2e">Memory</text>
      <text x="180" y="40" text-anchor="middle" font-size="16" fill="#1f2a2e">${escapeHtml(label)}</text>
    </svg>
  `,
  "Programming & Data Structures": (label) => `
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="200" rx="18" fill="#f6f1e9" />
      <circle cx="80" cy="90" r="22" fill="#1f6f78" opacity="0.25" />
      <circle cx="160" cy="90" r="22" fill="#1f6f78" opacity="0.25" />
      <circle cx="240" cy="90" r="22" fill="#1f6f78" opacity="0.25" />
      <line x1="102" y1="90" x2="138" y2="90" stroke="#1f6f78" stroke-width="4" />
      <line x1="182" y1="90" x2="218" y2="90" stroke="#1f6f78" stroke-width="4" />
      <rect x="120" y="120" width="120" height="40" rx="10" fill="#ff835c" opacity="0.2" />
      <text x="180" y="145" text-anchor="middle" font-size="14" fill="#1f2a2e">Structure</text>
      <text x="180" y="40" text-anchor="middle" font-size="16" fill="#1f2a2e">${escapeHtml(label)}</text>
    </svg>
  `,
  Algorithms: (label) => `
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="200" rx="18" fill="#f6f1e9" />
      <circle cx="80" cy="90" r="16" fill="#1f6f78" />
      <circle cx="180" cy="60" r="16" fill="#1f6f78" />
      <circle cx="260" cy="120" r="16" fill="#1f6f78" />
      <line x1="96" y1="84" x2="164" y2="66" stroke="#ff835c" stroke-width="3" />
      <line x1="190" y1="74" x2="250" y2="110" stroke="#ff835c" stroke-width="3" />
      <line x1="96" y1="96" x2="244" y2="114" stroke="#9fb8bc" stroke-width="2" />
      <text x="180" y="40" text-anchor="middle" font-size="16" fill="#1f2a2e">${escapeHtml(label)}</text>
    </svg>
  `,
  "Theory of Computation": (label) => `
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="200" rx="18" fill="#f6f1e9" />
      <circle cx="90" cy="100" r="30" fill="#1f6f78" opacity="0.2" />
      <circle cx="200" cy="100" r="30" fill="#1f6f78" opacity="0.2" />
      <path d="M120 100 Q150 60 180 100" stroke="#ff835c" stroke-width="3" fill="none" />
      <path d="M180 100 Q150 140 120 100" stroke="#ff835c" stroke-width="3" fill="none" />
      <text x="90" y="105" text-anchor="middle" font-size="14" fill="#1f2a2e">q0</text>
      <text x="200" y="105" text-anchor="middle" font-size="14" fill="#1f2a2e">q1</text>
      <text x="180" y="40" text-anchor="middle" font-size="16" fill="#1f2a2e">${escapeHtml(label)}</text>
    </svg>
  `,
  "Compiler Design": (label) => `
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="200" rx="18" fill="#f6f1e9" />
      <rect x="30" y="80" width="70" height="40" rx="8" fill="#1f6f78" opacity="0.2" />
      <rect x="120" y="80" width="70" height="40" rx="8" fill="#1f6f78" opacity="0.2" />
      <rect x="210" y="80" width="70" height="40" rx="8" fill="#1f6f78" opacity="0.2" />
      <rect x="300" y="80" width="50" height="40" rx="8" fill="#ff835c" opacity="0.2" />
      <line x1="100" y1="100" x2="120" y2="100" stroke="#1f6f78" stroke-width="3" />
      <line x1="190" y1="100" x2="210" y2="100" stroke="#1f6f78" stroke-width="3" />
      <line x1="280" y1="100" x2="300" y2="100" stroke="#1f6f78" stroke-width="3" />
      <text x="65" y="105" text-anchor="middle" font-size="12" fill="#1f2a2e">Lex</text>
      <text x="155" y="105" text-anchor="middle" font-size="12" fill="#1f2a2e">Parse</text>
      <text x="245" y="105" text-anchor="middle" font-size="12" fill="#1f2a2e">IR</text>
      <text x="325" y="105" text-anchor="middle" font-size="12" fill="#1f2a2e">ASM</text>
      <text x="180" y="40" text-anchor="middle" font-size="16" fill="#1f2a2e">${escapeHtml(label)}</text>
    </svg>
  `,
  "Operating Systems": (label) => `
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="200" rx="18" fill="#f6f1e9" />
      <rect x="40" y="70" width="260" height="20" rx="8" fill="#1f6f78" opacity="0.2" />
      <rect x="40" y="110" width="120" height="20" rx="8" fill="#ff835c" opacity="0.2" />
      <rect x="180" y="110" width="120" height="20" rx="8" fill="#1f6f78" opacity="0.2" />
      <text x="60" y="86" font-size="12" fill="#1f2a2e">Scheduler</text>
      <text x="50" y="126" font-size="12" fill="#1f2a2e">P1</text>
      <text x="190" y="126" font-size="12" fill="#1f2a2e">P2</text>
      <text x="180" y="40" text-anchor="middle" font-size="16" fill="#1f2a2e">${escapeHtml(label)}</text>
    </svg>
  `,
  Databases: (label) => `
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="200" rx="18" fill="#f6f1e9" />
      <rect x="60" y="60" width="90" height="70" rx="8" fill="#1f6f78" opacity="0.2" />
      <rect x="210" y="60" width="90" height="70" rx="8" fill="#ff835c" opacity="0.2" />
      <line x1="150" y1="95" x2="210" y2="95" stroke="#1f6f78" stroke-width="3" />
      <text x="105" y="100" text-anchor="middle" font-size="12" fill="#1f2a2e">Table A</text>
      <text x="255" y="100" text-anchor="middle" font-size="12" fill="#1f2a2e">Table B</text>
      <text x="180" y="40" text-anchor="middle" font-size="16" fill="#1f2a2e">${escapeHtml(label)}</text>
    </svg>
  `,
  "Computer Networks": (label) => `
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="200" rx="18" fill="#f6f1e9" />
      <rect x="70" y="40" width="220" height="20" rx="8" fill="#1f6f78" opacity="0.2" />
      <rect x="70" y="70" width="220" height="20" rx="8" fill="#1f6f78" opacity="0.3" />
      <rect x="70" y="100" width="220" height="20" rx="8" fill="#1f6f78" opacity="0.4" />
      <rect x="70" y="130" width="220" height="20" rx="8" fill="#1f6f78" opacity="0.5" />
      <text x="180" y="155" text-anchor="middle" font-size="12" fill="#1f2a2e">Layers</text>
      <text x="180" y="30" text-anchor="middle" font-size="16" fill="#1f2a2e">${escapeHtml(label)}</text>
    </svg>
  `,
  "General Aptitude": (label) => `
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="200" rx="18" fill="#f6f1e9" />
      <rect x="80" y="120" width="30" height="40" rx="6" fill="#1f6f78" opacity="0.3" />
      <rect x="130" y="90" width="30" height="70" rx="6" fill="#1f6f78" opacity="0.4" />
      <rect x="180" y="70" width="30" height="90" rx="6" fill="#ff835c" opacity="0.4" />
      <rect x="230" y="100" width="30" height="60" rx="6" fill="#1f6f78" opacity="0.2" />
      <text x="180" y="40" text-anchor="middle" font-size="16" fill="#1f2a2e">${escapeHtml(label)}</text>
    </svg>
  `,
};

const buildTopicVisual = (label, tags) => `
  <svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="topicGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1f6f78" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#ff835c" stop-opacity="0.18" />
      </linearGradient>
    </defs>
    <rect width="360" height="220" rx="18" fill="#f7f1e7" />
    <circle cx="180" cy="110" r="48" fill="url(#topicGrad)" stroke="#1f6f78" stroke-width="2" />
    <text x="180" y="114" text-anchor="middle" font-size="12" fill="#1f2a2e">Core</text>
    <text x="180" y="32" text-anchor="middle" font-size="16" fill="#1f2a2e">${escapeHtml(label)}</text>
    <g>
      <circle cx="70" cy="60" r="22" fill="#1f6f78" opacity="0.18" />
      <circle cx="300" cy="70" r="22" fill="#1f6f78" opacity="0.18" />
      <circle cx="280" cy="170" r="22" fill="#ff835c" opacity="0.25" />
      <circle cx="80" cy="170" r="22" fill="#ff835c" opacity="0.2" />
      <line x1="90" y1="70" x2="150" y2="100" stroke="#1f6f78" stroke-width="2" />
      <line x1="270" y1="80" x2="210" y2="100" stroke="#1f6f78" stroke-width="2" />
      <line x1="265" y1="160" x2="210" y2="125" stroke="#ff835c" stroke-width="2" />
      <line x1="95" y1="160" x2="150" y2="125" stroke="#ff835c" stroke-width="2" />
      <text x="70" y="64" text-anchor="middle" font-size="10" fill="#1f2a2e">${escapeHtml(tags[0] || "Concepts")}</text>
      <text x="300" y="74" text-anchor="middle" font-size="10" fill="#1f2a2e">${escapeHtml(tags[1] || "Formula")}</text>
      <text x="280" y="174" text-anchor="middle" font-size="10" fill="#1f2a2e">${escapeHtml(tags[2] || "Practice")}</text>
      <text x="80" y="174" text-anchor="middle" font-size="10" fill="#1f2a2e">${escapeHtml(tags[3] || "Pitfalls")}</text>
    </g>
  </svg>
`;

const stopwords = new Set([
  "the",
  "is",
  "are",
  "a",
  "an",
  "and",
  "or",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "what",
  "how",
  "why",
  "when",
  "where",
  "which",
  "it",
  "this",
  "that",
  "these",
  "those",
  "explain",
  "define",
  "about",
  "help",
  "me",
  "i",
  "we",
  "you",
]);

const extractTopicTags = (topicId) => {
  const detail = topicDetails[topicId];
  if (detail?.tags?.length) {
    return detail.tags.slice(0, 4);
  }

  const raw = detail?.summary || "";
  const tokens = tokenize(raw).filter((token) => token.length > 3);
  const counts = new Map();
  tokens.forEach((token) => {
    counts.set(token, (counts.get(token) || 0) + 1);
  });

  const sorted = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([token]) => token);

  const formatted = sorted.slice(0, 4).map((token) => token[0].toUpperCase() + token.slice(1));
  return formatted.length ? formatted : ["Concepts", "Formula", "Practice", "Pitfalls"];
};

const tokenize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token && !stopwords.has(token));

const knowledgeBase = (() => {
  const docs = [];
  syllabusData.forEach((section) => {
    section.items.forEach((item) => {
      const detail = topicDetails[item.id];
      docs.push({
        id: `topic-${item.id}`,
        title: item.label,
        text: detail ? detail.summary : "",
        tags: [section.category, item.id],
        sources: resourcesByCategory[section.category] || [],
      });
    });
  });

  resourcesCatalog.forEach((resource) => {
    docs.push({
      id: `res-${resource.id}`,
      title: resource.title,
      text: resource.note,
      tags: [resource.category, resource.type],
      sources: [resource.id],
    });
  });

  return docs;
})();

const markStudyDay = () => {
  const today = todayISO();
  if (!state.studyLog.includes(today)) {
    state.studyLog.push(today);
    store.set(STORAGE_KEYS.studyLog, state.studyLog);
  }
  updateStreaks();
  renderStreakGrid();
};

const computeStreaks = (dates) => {
  if (!dates.length) {
    return { current: 0, best: 0 };
  }

  const sorted = Array.from(new Set(dates)).sort();
  const toDate = (value) => parseLocalDate(value);

  let best = 1;
  let current = 1;
  let temp = 1;

  for (let i = 1; i < sorted.length; i += 1) {
    const prev = toDate(sorted[i - 1]);
    const next = toDate(sorted[i]);
    const diff = (next - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      temp += 1;
      best = Math.max(best, temp);
    } else {
      temp = 1;
    }
  }

  const today = todayISO();
  let cursor = parseLocalDate(today);
  current = 0;
  while (true) {
    const cursorIso = toLocalISO(cursor);
    if (sorted.includes(cursorIso)) {
      current += 1;
      cursor = new Date(cursor.getTime() - 86400000);
    } else {
      break;
    }
  }

  return { current, best };
};

const updateStreaks = () => {
  const { current, best } = computeStreaks(state.studyLog);
  elements.statStreak.textContent = `${current} days`;
  elements.statBest.textContent = `Best: ${best}`;
};

const renderStreakGrid = () => {
  if (!elements.streakGrid) return;
  elements.streakGrid.innerHTML = "";
  const daysToShow = 30;
  const today = parseLocalDate(todayISO());

  for (let i = daysToShow - 1; i >= 0; i -= 1) {
    const date = new Date(today.getTime() - i * 86400000);
    const iso = toLocalISO(date);
    const cell = document.createElement("div");
    cell.className = "streak-cell";
    if (state.studyLog.includes(iso)) {
      cell.classList.add("active");
    }
    cell.title = `${formatDate(iso)} • ${state.studyLog.includes(iso) ? "Studied" : "No log"}`;
    elements.streakGrid.appendChild(cell);
  }
};

const renderQuizHistory = () => {
  if (!elements.quizHistory) return;
  elements.quizHistory.innerHTML = "";
  const recent = [...state.quizLog]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 5);

  if (!recent.length) {
    const empty = document.createElement("li");
    empty.className = "list-item";
    empty.textContent = "No quizzes yet. Mark a topic complete to trigger a quiz.";
    elements.quizHistory.appendChild(empty);
    return;
  }

  recent.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "list-item";

    const topicLabel = syllabusData
      .flatMap((section) => section.items)
      .find((topic) => topic.id === entry.topicId)?.label;

    const info = document.createElement("div");
    info.className = "task-main";

    const summary = document.createElement("div");
    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = `${entry.score}/${entry.total}`;

    const meta = document.createElement("p");
    meta.className = "task-meta";
    meta.textContent = `${topicLabel || "Topic quiz"} • ${formatDate(entry.date)}`;

    summary.appendChild(title);
    summary.appendChild(meta);
    info.appendChild(summary);

    item.appendChild(info);
    elements.quizHistory.appendChild(item);
  });
};

const showToast = (message) => {
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  window.setTimeout(() => elements.toast.classList.add("hidden"), 2400);
};

const renderSubjectNav = () => {
  if (!elements.subjectNav) return;
  elements.subjectNav.innerHTML = "";
  const subjects = getSubjectCategories();
  const items = ["All", ...subjects];

  items.forEach((subject) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = subject;
    const isActive =
      (subject === "All" && (!state.view.filter || state.view.filter === "All")) ||
      state.view.filter === subject;
    if (isActive) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      if (subject === "All") {
        state.view.filter = "All";
        store.set(STORAGE_KEYS.view, state.view);
        renderSubjectNav();
        renderResourcesLibrary();
        return;
      }

      state.view.filter = subject;
      state.view.category = subject;
      const section = syllabusData.find((item) => item.category === subject);
      state.view.topic = section?.items[0]?.id || "";
      store.set(STORAGE_KEYS.view, state.view);
      renderSubjectNav();
      renderTopicExplorer();
      renderResourcesLibrary();
      document.getElementById("topicStudio")?.scrollIntoView({ behavior: "smooth" });
    });
    elements.subjectNav.appendChild(button);
  });
};

const renderSyllabus = () => {
  elements.syllabus.innerHTML = "";
  syllabusData.forEach((section) => {
    const card = document.createElement("div");
    card.className = "syllabus-category";

    const head = document.createElement("div");
    head.className = "category-head";

    const title = document.createElement("h3");
    title.textContent = section.category;

    const progress = document.createElement("div");
    progress.className = "category-progress";

    const progressText = document.createElement("span");
    progressText.className = "progress-text";

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";

    const progressFill = document.createElement("span");
    progressFill.className = "progress-fill";
    progressBar.appendChild(progressFill);

    progress.appendChild(progressText);
    progress.appendChild(progressBar);
    head.appendChild(title);
    head.appendChild(progress);

    const list = document.createElement("ul");
    list.className = "topic-list";

    section.items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "topic-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.topicId = item.id;
      checkbox.checked = Boolean(state.syllabus[item.id]);

      checkbox.addEventListener("change", (event) => {
        const wasCompleted = Boolean(state.syllabus[item.id]);
        const isCompleted = event.target.checked;
        state.syllabus[item.id] = isCompleted;
        store.set(STORAGE_KEYS.syllabus, state.syllabus);
        updateProgress();
        renderTopicExplorer();
        if (!wasCompleted && isCompleted) {
          markStudyDay();
          openQuiz(item.id);
        }
      });

      const label = document.createElement("label");
      label.textContent = item.label;
      label.style.cursor = "pointer";
      label.addEventListener("click", () => {
        selectTopic(item.id);
      });

      li.appendChild(checkbox);
      li.appendChild(label);
      list.appendChild(li);
    });

    card.appendChild(head);
    card.appendChild(list);
    elements.syllabus.appendChild(card);
  });

  updateProgress();
};

const updateProgress = () => {
  let total = 0;
  let completed = 0;

  const cards = elements.syllabus.querySelectorAll(".syllabus-category");
  cards.forEach((card, index) => {
    const section = syllabusData[index];
    const totalTopics = section.items.length;
    const doneTopics = section.items.filter((item) => state.syllabus[item.id]).length;

    total += totalTopics;
    completed += doneTopics;

    const progressText = card.querySelector(".progress-text");
    const progressFill = card.querySelector(".progress-fill");

    const percent = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0;
    progressText.textContent = `${doneTopics}/${totalTopics}`;
    progressFill.style.width = `${percent}%`;
  });

  const overallPercent = total ? Math.round((completed / total) * 100) : 0;
  elements.overallProgressText.textContent = `${completed}/${total}`;
  elements.overallProgressBar.style.width = `${overallPercent}%`;
  elements.statTopics.textContent = `${completed}`;

  updateStats();
};

const renderPlan = () => {
  elements.planList.innerHTML = "";
  const showAll = elements.showAllTasks.checked;
  const today = todayISO();
  const visible = (showAll ? state.plan : state.plan.filter((task) => task.date === today)).sort(
    (a, b) => (a.time || "").localeCompare(b.time || "")
  );

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "list-item";
    empty.textContent = showAll
      ? "No tasks yet. Add your first task to build momentum."
      : "No tasks for today. Add a focus block.";
    elements.planList.appendChild(empty);
    updateStats();
    return;
  }

  visible.forEach((task) => {
    const item = document.createElement("li");
    item.className = "list-item";

    const main = document.createElement("div");
    main.className = "task-main";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      const wasDone = task.done;
      task.done = checkbox.checked;
      store.set(STORAGE_KEYS.dailyPlan, state.plan);
      renderPlan();
      if (!wasDone && task.done) {
        markStudyDay();
      }
    });

    const info = document.createElement("div");
    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.task;

    const meta = document.createElement("p");
    meta.className = "task-meta";
    const timeLabel = task.time ? task.time : "Anytime";
    const dateLabel = formatDate(task.date);
    meta.textContent = `${timeLabel} • ${task.type}${showAll ? ` • ${dateLabel}` : ""}`;

    info.appendChild(title);
    info.appendChild(meta);

    main.appendChild(checkbox);
    main.appendChild(info);

    const remove = document.createElement("button");
    remove.className = "icon-btn";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      state.plan = state.plan.filter((entry) => entry.id !== task.id);
      store.set(STORAGE_KEYS.dailyPlan, state.plan);
      renderPlan();
    });

    item.appendChild(main);
    item.appendChild(remove);
    elements.planList.appendChild(item);
  });

  updateStats();
};

const renderTests = () => {
  elements.testList.innerHTML = "";
  const sorted = [...state.tests].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  if (sorted.length === 0) {
    const empty = document.createElement("li");
    empty.className = "list-item";
    empty.textContent = "No tests logged yet. Add one to track your improvement.";
    elements.testList.appendChild(empty);
    elements.testStats.textContent = "";
    updateStats();
    return;
  }

  let sumPercent = 0;
  let percentCount = 0;

  sorted.forEach((test) => {
    const item = document.createElement("li");
    item.className = "list-item";

    const info = document.createElement("div");
    info.className = "task-main";

    const summary = document.createElement("div");

    const title = document.createElement("p");
    title.className = "task-title";

    const maxLabel = test.max ? ` / ${test.max}` : "";
    title.textContent = `${test.score}${maxLabel}`;

    const meta = document.createElement("p");
    meta.className = "task-meta";
    const dateLabel = test.date ? formatDate(test.date) : "";
    const notes = test.notes ? ` • ${test.notes}` : "";
    meta.textContent = `${dateLabel}${notes}`.trim();

    summary.appendChild(title);
    summary.appendChild(meta);
    info.appendChild(summary);

    if (test.max) {
      sumPercent += (Number(test.score) / Number(test.max)) * 100;
      percentCount += 1;
    }

    const remove = document.createElement("button");
    remove.className = "icon-btn";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      state.tests = state.tests.filter((entry) => entry.id !== test.id);
      store.set(STORAGE_KEYS.tests, state.tests);
      renderTests();
    });

    item.appendChild(info);
    item.appendChild(remove);
    elements.testList.appendChild(item);
  });

  if (percentCount) {
    const avg = Math.round(sumPercent / percentCount);
    elements.testStats.textContent = `Average score: ${avg}% (from ${percentCount} tests with max score)`;
  } else {
    elements.testStats.textContent = "Add a max score to calculate average percentage.";
  }

  updateStats();
};

const updateTargetDate = () => {
  const value = elements.targetDate.value;
  state.targetDate = value;
  store.set(STORAGE_KEYS.targetDate, state.targetDate);
  updateStats();
};

const updateStats = () => {
  const targetDate = state.targetDate;
  if (targetDate) {
    const diffMs = parseLocalDate(targetDate) - parseLocalDate(todayISO());
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    elements.statDays.textContent = daysLeft >= 0 ? String(daysLeft) : "0";
    elements.daysLeft.textContent =
      daysLeft >= 0 ? `${daysLeft} days to your target date.` : "Target date passed. Pick a new date.";
  } else {
    elements.statDays.textContent = "--";
    elements.daysLeft.textContent = "Set a date to start the countdown.";
  }

  const today = todayISO();
  const todaysTasks = state.plan.filter((task) => task.date === today);
  const doneTasks = todaysTasks.filter((task) => task.done).length;
  elements.statTasks.textContent = `${doneTasks}/${todaysTasks.length}`;

  const testsWithMax = state.tests.filter((test) => test.max);
  if (testsWithMax.length) {
    const avg =
      testsWithMax.reduce((sum, test) => sum + (Number(test.score) / Number(test.max)) * 100, 0) /
      testsWithMax.length;
    elements.statScore.textContent = `${Math.round(avg)}%`;
  } else {
    elements.statScore.textContent = "--";
  }

  updateStreaks();
};

const getCategoryByTopic = (topicId) =>
  syllabusData.find((section) => section.items.some((item) => item.id === topicId))?.category ||
  "";

const renderTopicExplorer = () => {
  const categories = syllabusData.map((section) => section.category);
  if (!state.view.category || !categories.includes(state.view.category)) {
    state.view.category = categories[0];
  }
  if (!state.view.filter) {
    state.view.filter = "All";
  }

  elements.subjectSelect.innerHTML = "";
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    if (category === state.view.category) {
      option.selected = true;
    }
    elements.subjectSelect.appendChild(option);
  });

  const currentSection = syllabusData.find((section) => section.category === state.view.category);
  const topics = currentSection ? currentSection.items : [];
  if (!topics.length) return;

  if (!state.view.topic || !topics.some((item) => item.id === state.view.topic)) {
    state.view.topic = topics[0].id;
  }

  elements.topicSelect.innerHTML = "";
  topics.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic.id;
    option.textContent = topic.label;
    if (topic.id === state.view.topic) {
      option.selected = true;
    }
    elements.topicSelect.appendChild(option);
  });

  const detail = topicDetails[state.view.topic];
  const topicLabel = topics.find((topic) => topic.id === state.view.topic)?.label || "";
  elements.topicSummary.textContent = detail?.summary || "Add notes to clarify this topic.";
  elements.topicComplete.checked = Boolean(state.syllabus[state.view.topic]);
  elements.topicStatus.textContent =
    state.syllabus[state.view.topic] ? "Status: Completed" : "Status: In progress";

  const directResources = (detail?.resources || [])
    .map((resourceId) => resourceMap[resourceId])
    .filter(Boolean);
  const categoryResources = getResourcesForCategory(state.view.category);
  const combinedResources = dedupeResources([...directResources, ...categoryResources]);

  elements.topicResourceList.innerHTML = "";
  if (!combinedResources.length) {
    const empty = document.createElement("li");
    empty.textContent = "No resources yet. Add one below.";
    elements.topicResourceList.appendChild(empty);
  }
  combinedResources.forEach((resource) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${resource.url}" target="_blank" rel="noreferrer">${resource.title}</a><span class="resource-meta">${resource.type} • ${resource.note}</span>`;
    elements.topicResourceList.appendChild(li);
  });

  const tags = extractTopicTags(state.view.topic);
  elements.topicVisual.innerHTML = buildTopicVisual(topicLabel, tags);

  store.set(STORAGE_KEYS.view, state.view);

  if (elements.doubtTopic) {
    elements.doubtTopic.value = state.view.topic;
  }
};

const renderResourcesLibrary = () => {
  const query = (elements.resourceSearch?.value || "").trim().toLowerCase();
  elements.resourcesGrid.innerHTML = "";
  const filter = state.view?.filter || "All";
  const categories = getAllCategories().filter((category) => filter === "All" || category === filter);

  categories.forEach((category) => {
    const resources = dedupeResources(getResourcesForCategory(category));
    const filtered = query
      ? resources.filter((resource) => {
          const haystack = `${resource.title} ${resource.note} ${resource.type} ${resource.category}`
            .toLowerCase();
          return haystack.includes(query);
        })
      : resources;

    if (!filtered.length) return;

    const card = document.createElement("div");
    card.className = "resource-card";

    const title = document.createElement("h3");
    title.textContent = category;
    card.appendChild(title);

    filtered.forEach((resource) => {
      const item = document.createElement("div");
      item.className = "resource-item";
      item.innerHTML = `<a href="${resource.url}" target="_blank" rel="noreferrer">${resource.title}</a><div class="resource-tags">${resource.type} • ${resource.note}</div>`;
      card.appendChild(item);
    });

    elements.resourcesGrid.appendChild(card);
  });

  if (!elements.resourcesGrid.children.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = query ? `No resources match "${query}".` : "No resources yet.";
    elements.resourcesGrid.appendChild(empty);
  }
};

const populateDoubtTopics = () => {
  elements.doubtTopic.innerHTML = "";
  syllabusData.forEach((section) => {
    const group = document.createElement("optgroup");
    group.label = section.category;
    section.items.forEach((topic) => {
      const option = document.createElement("option");
      option.value = topic.id;
      option.textContent = topic.label;
      group.appendChild(option);
    });
    elements.doubtTopic.appendChild(group);
  });
};

const populateResourceCategories = () => {
  if (!elements.resourceCategory) return;
  elements.resourceCategory.innerHTML = "";
  const preferred = state.view.category;
  getAllCategories().forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    if (category === preferred) {
      option.selected = true;
    }
    elements.resourceCategory.appendChild(option);
  });
};

const addCustomResource = () => {
  const title = elements.resourceTitle.value.trim();
  const urlRaw = elements.resourceUrl.value.trim();
  const category = elements.resourceCategory.value;
  const type = elements.resourceType.value;
  const note = elements.resourceNote.value.trim();

  if (!title || !urlRaw) {
    showToast("Title and URL are required.");
    return;
  }

  const url = urlRaw.startsWith("http") ? urlRaw : `https://${urlRaw}`;
  const entry = {
    id: safeId(),
    category,
    title,
    type,
    url,
    note: note || "User added resource.",
    custom: true,
  };

  state.customResources.push(entry);
  resourceMap[entry.id] = entry;
  store.set(STORAGE_KEYS.customResources, state.customResources);
  elements.resourceForm.reset();
  renderResourcesLibrary();
  renderTopicExplorer();
  showToast("Resource added.");
};

const selectTopic = (topicId) => {
  const category = getCategoryByTopic(topicId);
  if (!category) return;
  state.view.category = category;
  state.view.topic = topicId;
  renderTopicExplorer();
};

const openQuiz = (topicId) => {
  const detail = topicDetails[topicId];
  if (!detail || !detail.quiz?.length) {
    showToast("No quiz available yet for this topic.");
    return;
  }

  state.lastQuizTopic = topicId;
  const topicLabel = syllabusData
    .flatMap((section) => section.items)
    .find((topic) => topic.id === topicId)?.label;

  elements.quizTitle.textContent = topicLabel ? `Quiz: ${topicLabel}` : "Topic Quiz";
  elements.quizForm.innerHTML = "";
  elements.quizResult.textContent = "";

  detail.quiz.forEach((question, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "quiz-question";

    const prompt = document.createElement("p");
    prompt.innerHTML = `<strong>Q${index + 1}.</strong> ${question.question}`;
    wrapper.appendChild(prompt);

    const options = document.createElement("div");
    options.className = "quiz-options";

    question.options.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      label.className = "quiz-option";
      label.innerHTML = `<input type="radio" name="q-${index}" value="${optionIndex}" /> ${option}`;
      options.appendChild(label);
    });

    wrapper.appendChild(options);
    elements.quizForm.appendChild(wrapper);
  });

  elements.quizModal.classList.remove("hidden");
};

const closeQuiz = () => {
  elements.quizModal.classList.add("hidden");
};

const submitQuiz = () => {
  const topicId = state.lastQuizTopic;
  if (!topicId) return;

  const detail = topicDetails[topicId];
  if (!detail || !detail.quiz?.length) return;

  const answers = detail.quiz.map((question, index) => {
    const selected = elements.quizForm.querySelector(`input[name="q-${index}"]:checked`);
    return selected ? Number(selected.value) : null;
  });

  const total = detail.quiz.length;
  const correct = detail.quiz.reduce((sum, question, idx) => {
    if (answers[idx] === question.answer) return sum + 1;
    return sum;
  }, 0);

  elements.quizResult.innerHTML = `Score: <strong>${correct}/${total}</strong><br />`;

  detail.quiz.forEach((question, idx) => {
    const explanation = document.createElement("div");
    explanation.className = "quiz-result";
    const userAnswer = answers[idx];
    const status = userAnswer === question.answer ? "Correct" : "Incorrect";
    explanation.innerHTML = `<strong>${status}:</strong> ${question.explain}`;
    elements.quizResult.appendChild(explanation);
  });

  state.quizLog.push({ id: safeId(), topicId, date: todayISO(), score: correct, total });
  store.set(STORAGE_KEYS.quizLog, state.quizLog);
  renderQuizHistory();
  markStudyDay();
};

const retrieveDocs = (query, topicId) => {
  const tokens = tokenize(query);
  const category = getCategoryByTopic(topicId);

  const customDocs = (state.customResources || []).map((resource) => ({
    id: `custom-${resource.id}`,
    title: resource.title,
    text: resource.note || "",
    tags: [resource.category, resource.type],
    sources: [resource.id],
  }));

  const scored = [...knowledgeBase, ...customDocs]
    .map((doc) => {
      const textTokens = tokenize(doc.text + " " + doc.title);
      const overlap = tokens.filter((token) => textTokens.includes(token)).length;
      let score = overlap;
      if (doc.tags.includes(topicId)) score += 4;
      if (doc.tags.includes(category)) score += 2;
      return { ...doc, score };
    })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return scored;
};

const offlineAnswer = (question, docs) => {
  if (!docs.length) {
    return "I could not find a close match in the local knowledge base. Try adding more details or check the resources list.";
  }

  const bullets = docs.map((doc) => `- ${doc.text}`).join("\n");
  return `Here is a quick explanation based on the most relevant notes:\n${bullets}`;
};

const renderAnswer = (answer, docsOrResources = []) => {
  const lines = answer.split("\n").filter(Boolean);
  const htmlLines = lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");

  let sources = [];
  if (Array.isArray(docsOrResources) && docsOrResources.length && docsOrResources[0].url) {
    sources = docsOrResources;
  } else {
    sources = Array.from(
      new Set(
        docsOrResources
          .flatMap((doc) => doc.sources || [])
          .map((sourceId) => resourceMap[sourceId])
          .filter(Boolean)
      )
    );
  }

  if (!sources.length) {
    elements.doubtAnswer.innerHTML = htmlLines;
    return;
  }

  const sourceList = sources
    .map(
      (resource) =>
        `<li><a href="${resource.url}" target="_blank" rel="noreferrer">${resource.title}</a></li>`
    )
    .join("");

  elements.doubtAnswer.innerHTML = `${htmlLines}<p><strong>Sources:</strong></p><ul>${sourceList}</ul>`;
};

const handleDoubtAsk = async () => {
  const question = elements.doubtQuestion.value.trim();
  if (!question) {
    showToast("Type a question first.");
    return;
  }

  const topicId = elements.doubtTopic.value;
  const category = getCategoryByTopic(topicId);
  const categoryResources = dedupeResources(getResourcesForCategory(category));

  elements.doubtAnswer.textContent = "Thinking...";

  const docs = retrieveDocs(question, topicId);
  const answer = offlineAnswer(question, docs);
  renderAnswer(answer, docs);

  markStudyDay();
};

const bindEvents = () => {
  elements.targetDate.addEventListener("change", updateTargetDate);

  elements.planForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const time = document.getElementById("planTime").value;
    const task = document.getElementById("planTask").value.trim();
    const type = document.getElementById("planType").value;

    if (!task) return;

    state.plan.push({
      id: safeId(),
      date: todayISO(),
      time,
      task,
      type,
      done: false,
    });

    store.set(STORAGE_KEYS.dailyPlan, state.plan);
    elements.planForm.reset();
    renderPlan();
  });

  elements.showAllTasks.addEventListener("change", renderPlan);

  elements.testForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = document.getElementById("testDate").value;
    const score = document.getElementById("testScore").value;
    const max = document.getElementById("testMax").value;
    const notes = document.getElementById("testNotes").value.trim();

    state.tests.push({
      id: safeId(),
      date,
      score: Number(score),
      max: max ? Number(max) : null,
      notes,
    });

    store.set(STORAGE_KEYS.tests, state.tests);
    elements.testForm.reset();
    renderTests();
    markStudyDay();
  });

  elements.notes.addEventListener("input", (event) => {
    state.notes = event.target.value;
    elements.notesStatus.textContent = "Unsaved changes";
  });

  elements.notesSave.addEventListener("click", () => {
    store.set(STORAGE_KEYS.notes, state.notes);
    elements.notesStatus.textContent = `Saved ${new Date().toLocaleTimeString()}`;
    markStudyDay();
  });

  elements.focusInputs.forEach((input, index) => {
    input.addEventListener("input", (event) => {
      state.focus[index] = event.target.value;
      store.set(STORAGE_KEYS.focus, state.focus);
    });
  });

  elements.resetButton.addEventListener("click", () => {
    const confirmed = window.confirm("Reset all saved data? This cannot be undone.");
    if (!confirmed) return;

    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    state.plan = [];
    state.syllabus = {};
    state.tests = [];
    state.targetDate = "";
    state.notes = "";
    state.focus = ["", "", ""];
    state.studyLog = [];
    state.quizLog = [];
    state.view = { category: "", topic: "" };
    state.customResources = [];

    loadState();
    renderAll();
  });

  elements.exportButton.addEventListener("click", () => {
    const data = {
      exportedAt: new Date().toISOString(),
      payload: {
        plan: state.plan,
        syllabus: state.syllabus,
        tests: state.tests,
        targetDate: state.targetDate,
        notes: state.notes,
        focus: state.focus,
        studyLog: state.studyLog,
        quizLog: state.quizLog,
        view: state.view,
        customResources: state.customResources,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateTag = todayISO().replace(/-/g, "");
    link.href = url;
    link.download = `gate2027-backup-${dateTag}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });

  elements.importButton.addEventListener("click", () => {
    elements.importFile.click();
  });

  elements.importFile.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const payload = parsed.payload || parsed;
        state.plan = payload.plan || [];
        state.syllabus = payload.syllabus || {};
        state.tests = payload.tests || [];
        state.targetDate = payload.targetDate || "";
        state.notes = payload.notes || "";
        state.focus = payload.focus || ["", "", ""];
        state.studyLog = payload.studyLog || [];
        state.quizLog = payload.quizLog || [];
        state.view = payload.view || { category: "", topic: "" };
        state.customResources = payload.customResources || [];

        store.set(STORAGE_KEYS.dailyPlan, state.plan);
        store.set(STORAGE_KEYS.syllabus, state.syllabus);
        store.set(STORAGE_KEYS.tests, state.tests);
        store.set(STORAGE_KEYS.targetDate, state.targetDate);
        store.set(STORAGE_KEYS.notes, state.notes);
        store.set(STORAGE_KEYS.focus, state.focus);
        store.set(STORAGE_KEYS.studyLog, state.studyLog);
        store.set(STORAGE_KEYS.quizLog, state.quizLog);
        store.set(STORAGE_KEYS.view, state.view);
        store.set(STORAGE_KEYS.customResources, state.customResources);

        loadState();
        renderAll();
      } catch (error) {
        window.alert("Import failed. Please use a valid backup file.");
      }
    };
    reader.readAsText(file);
  });

  if (elements.resourceSearch) {
    elements.resourceSearch.addEventListener("input", renderResourcesLibrary);
  }

  if (elements.resourceForm) {
    elements.resourceForm.addEventListener("submit", (event) => {
      event.preventDefault();
      addCustomResource();
    });
  }

  if (elements.logStudy) {
    elements.logStudy.addEventListener("click", () => {
      markStudyDay();
      showToast("Logged study for today.");
    });
  }

  elements.pomodoroStart.addEventListener("click", () => {
    if (pomodoro.running) return;
    pomodoro.running = true;
    pomodoro.timerId = setInterval(() => {
      if (pomodoro.remaining > 0) {
        pomodoro.remaining -= 1;
        updatePomodoroUI();
        return;
      }

      switchPomodoroMode();
    }, 1000);
  });

  elements.pomodoroPause.addEventListener("click", () => {
    if (!pomodoro.running) return;
    pomodoro.running = false;
    clearInterval(pomodoro.timerId);
  });

  elements.pomodoroReset.addEventListener("click", () => {
    pomodoro.running = false;
    clearInterval(pomodoro.timerId);
    pomodoro.remaining = pomodoro.mode === "focus" ? pomodoro.focusMinutes * 60 : pomodoro.breakMinutes * 60;
    updatePomodoroUI();
  });

  elements.pomodoroSwitch.addEventListener("click", () => {
    switchPomodoroMode();
  });

  elements.subjectSelect.addEventListener("change", (event) => {
    state.view.category = event.target.value;
    const section = syllabusData.find((item) => item.category === state.view.category);
    state.view.topic = section?.items[0]?.id || "";
    renderTopicExplorer();
  });

  elements.topicSelect.addEventListener("change", (event) => {
    state.view.topic = event.target.value;
    renderTopicExplorer();
  });

  elements.topicComplete.addEventListener("change", (event) => {
    const topicId = state.view.topic;
    const wasCompleted = Boolean(state.syllabus[topicId]);
    const isCompleted = event.target.checked;
    state.syllabus[topicId] = isCompleted;
    store.set(STORAGE_KEYS.syllabus, state.syllabus);
    renderSyllabus();
    renderTopicExplorer();
    if (!wasCompleted && isCompleted) {
      markStudyDay();
      openQuiz(topicId);
    }
  });

  elements.topicQuizButton.addEventListener("click", () => {
    openQuiz(state.view.topic);
  });

  elements.doubtAsk.addEventListener("click", handleDoubtAsk);

  elements.quizClose.addEventListener("click", closeQuiz);
  elements.quizSubmit.addEventListener("click", submitQuiz);
  elements.quizAsk.addEventListener("click", () => {
    if (!state.lastQuizTopic) return;
    const topicLabel = syllabusData
      .flatMap((section) => section.items)
      .find((topic) => topic.id === state.lastQuizTopic)?.label;
    elements.doubtTopic.value = state.lastQuizTopic;
    elements.doubtQuestion.value = `Explain the quiz answers for ${topicLabel || "this topic"}.`;
    closeQuiz();
    elements.doubtQuestion.focus();
  });
};

const switchPomodoroMode = () => {
  pomodoro.running = false;
  clearInterval(pomodoro.timerId);
  pomodoro.mode = pomodoro.mode === "focus" ? "break" : "focus";
  if (pomodoro.mode === "focus") {
    pomodoro.cycle += 1;
  }
  pomodoro.remaining = pomodoro.mode === "focus" ? pomodoro.focusMinutes * 60 : pomodoro.breakMinutes * 60;
  updatePomodoroUI();
};

const updatePomodoroUI = () => {
  elements.pomodoroClock.textContent = formatMinutes(pomodoro.remaining);
  elements.pomodoroMode.textContent = pomodoro.mode === "focus" ? "Focus" : "Break";
  elements.pomodoroCycle.textContent = `Cycle ${pomodoro.cycle}`;
};

const loadState = () => {
  elements.targetDate.value = state.targetDate || "";
  elements.notes.value = state.notes || "";
  elements.notesStatus.textContent = state.notes ? "Saved" : "Not saved yet.";
  elements.focusInputs.forEach((input, index) => {
    input.value = state.focus[index] || "";
  });
  registerCustomResources();
};

const renderAll = () => {
  renderSyllabus();
  renderPlan();
  renderTests();
  renderStreakGrid();
  renderQuizHistory();
  renderSubjectNav();
  populateResourceCategories();
  renderResourcesLibrary();
  populateDoubtTopics();
  renderTopicExplorer();
  updatePomodoroUI();
  updateStats();
};

loadState();
bindEvents();
renderAll();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
