/* =====================================================================
   portfolio.js — ALL the words, numbers and links on your site.
   ---------------------------------------------------------------------
   • Change any text below and save — the site updates instantly.
   • Icons: use a name from src/lib/icons.jsx (add new ones there).
   • New project: copy one block inside WORK and give it a new unique id.
   • New skill: add it to a group in SKILL_GROUPS, then put the exact same
     text in the `tags` of any WORK item that used it.
   ===================================================================== */

export const PROFILE = {
  name: "Rithvik Pratapani",
  first: "Rithvik",
  last: "Pratapani",
  initials: "RP",
  shortName: "Rithvik P.",
  role: "Junior Software Developer",
  company: "Arminta Solutions",
  location: "Hyderabad, India",
  timezone: "Asia/Kolkata",
  timezoneLabel: "IST",
  email: "rithvik.pratapani03@gmail.com",
  phone: "+91-9063172924",
  phoneHref: "tel:+919063172924",
  linkedin: "https://linkedin.com/in/rithvik-pratapani",
  linkedinLabel: "linkedin.com/in/rithvik-pratapani",
  summary:
    "Backend Software Developer with 1+ year of experience building Node.js/Fastify and Python/FastAPI services for an IoT water-management platform. Built an LLM-powered prompt suggestion engine using Sentence Transformers, PostgreSQL pgvector, Redis vector caching, and Gemini, focused on low-latency APIs and reduced LLM cost.",
  // Photo file goes in the /public folder. zoom/position/focus frame your face in the circle.
  // Using a close-up square headshot? Set zoom: 1 and position: "50% 20%".
  photo: { src: "/photo.jpg", zoom: 2, position: "50% 21%", focus: "47% 45%" },
};

/* Page sections, in order. `colors` = [main, secondary] accent for that section.
   `shape` = 3D background shape: sphere | wave | knot | cube | helix | galaxy.
   `side`  = where the shape sits on wide screens: 1 right, -1 left, 0 centre. */
export const SECTIONS = [
  { id: "home", label: "Home", icon: "Home", colors: ["#2EF2C4", "#3B9BFF"], shape: "sphere", side: 1 },
  {
    id: "impact", label: "Impact", icon: "Gauge", colors: ["#5B9DFF", "#22D3EE"], shape: "wave", side: -1,
    title: "Numbers from", accent: "production work.",
    sub: "Every figure comes straight from my resume. Tap one to see the work behind it.",
  },
  {
    id: "work", label: "Work", icon: "Briefcase", colors: ["#B794FF", "#FF7AC6"], shape: "knot", side: 1,
    title: "Selected work,", accent: "unpacked.",
    sub: "Tap any card for the problem, what I built, and the measurable impact.",
  },
  {
    id: "skills", label: "Skills", icon: "Layers", colors: ["#7CF29A", "#38BDF8"], shape: "cube", side: -1,
    eyebrow: "Toolkit", title: "Skills, wired to", accent: "real work.",
    sub: "Spin the globe or tap any skill to trace it to the work where I used it.",
  },
  {
    id: "journey", label: "Journey", icon: "GraduationCap", colors: ["#FFC861", "#FF8A7A"], shape: "helix", side: 1,
    title: "From classroom", accent: "to production.",
  },
  { id: "contact", label: "Contact", icon: "Mail", colors: ["#FF7AC6", "#B794FF"], shape: "galaxy", side: 0 },
];

export const HERO = {
  badge: "1+ yr · backend",
  tagline: "Backend developer building",
  // Tabs under your name. `work` = id of the WORK item opened by "Details".
  rotator: [
    { label: "APIs", icon: "Server", line: "REST APIs on Fastify", work: "water", proof: "40+ endpoints across tank monitoring, tanker booking, supplier, delivery and inventory modules." },
    { label: "IoT", icon: "Radio", line: "IoT telemetry pipelines", work: "water", proof: "MQTT telemetry and emergency alerts from 50+ tank sensors, persisted in MongoDB." },
    { label: "Search", icon: "Search", line: "semantic search", work: "prompt", proof: "Sentence Transformers embeddings with PostgreSQL pgvector as the persistent vector store." },
    { label: "LLM", icon: "Sparkles", line: "cost-aware LLM features", work: "prompt", proof: "Redis semantic caching with HNSW indexing cut Gemini API calls by ~40%." },
  ],
  highlights: [
    { value: "~40%", label: "fewer Gemini API calls", work: "prompt" },
    { value: "<200ms", label: "suggestion responses", work: "prompt" },
    { value: "40+", label: "REST endpoints built", work: "water" },
  ],
  telemetryLink: "water",
  nowCards: ["water", "prompt"],
  nowPeriod: "Sep 2025 – Present",
};

/* The FIRST metric is shown as the big featured card. */
export const METRICS = [
  {
    to: 40, prefix: "~", suffix: "%", icon: "Sparkles", tag: "LLM cost", work: "prompt",
    label: "fewer Gemini 2.5 Flash Lite API calls",
    detail: "Redis embedding + semantic caching with HNSW vector indexing serves similar queries from cache.",
    compare: [
      { label: "Without semantic cache", value: 100 },
      { label: "With Redis semantic cache", value: 60 },
    ],
    compareNote: "Relative Gemini call volume (~40% reduction)",
  },
  { to: 40, suffix: "+", icon: "Server", work: "water", label: "REST API endpoints", detail: "Tank monitoring, booking, supplier, delivery & inventory." },
  { to: 50, suffix: "+", icon: "Radio", work: "water", label: "IoT tank sensors", detail: "MQTT telemetry & emergency alerts into MongoDB." },
  { to: 200, prefix: "<", suffix: "ms", icon: "Zap", work: "prompt", label: "suggestion response time", detail: "spaCy NLP turns partial input into keywords." },
  { to: 5, icon: "Users", work: "water", label: "user roles secured", detail: "JWT + role-based access control." },
];

export const WORK_FILTERS = ["All", "Experience", "Project", "IoT", "AI / LLM", "Serverless"];

/* The FIRST work item gets the big card in the grid. */
export const WORK = [
  {
    id: "water",
    title: "Water Management Platform",
    short: "Water Management Platform",
    type: "Experience",
    categories: ["Experience", "IoT"],
    org: "Arminta Solutions · Hyderabad",
    period: "Sep 2025 – Present",
    icon: "Droplets",
    summary: "Backend for an IoT water-management platform — from tank sensors to tanker bookings and deliveries.",
    stack: ["Node.js", "Fastify", "MongoDB", "Mongoose", "MQTT"],
    resumeStack: "Node.js, Fastify, MongoDB, Mongoose, MQTT",
    tags: ["JavaScript", "Node.js", "Fastify", "REST API Design", "JWT Authentication", "Role-Based Access Control", "MongoDB (Mongoose)", "MQTT"],
    roles: ["Customers", "Operators", "Suppliers", "Delivery agents", "Administrators"],
    problem: "One backend has to serve five very different users — customers, operators, suppliers, delivery agents and administrators — while telemetry and emergency alerts stream in from IoT tank sensors.",
    flowLabel: "Data path",
    flow: ["50+ tank sensors", "MQTT", "Fastify services", "MongoDB", "Role-based APIs"],
    bullets: [
      "Built and maintained 40+ REST API endpoints across tank monitoring, tanker booking, supplier, delivery, and inventory modules using Fastify routes, controllers, and Mongoose models.",
      "Developed JWT-secured, role-based workflows for 5 user roles: customers, operators, suppliers, delivery agents, and administrators.",
      "Handled MQTT telemetry and emergency-event alerts from 50+ IoT tank sensors, processing and persisting readings in MongoDB; traced and resolved telemetry data issues through MongoDB queries.",
      "Integrated real-time updates, push notifications, file storage, and location services into backend booking and delivery flows.",
    ],
    impact: [
      { value: "40+", label: "REST API endpoints" },
      { value: "5", label: "user roles on JWT + RBAC" },
      { value: "50+", label: "IoT tank sensors" },
    ],
  },
  {
    id: "prompt",
    title: "AI-Powered Prompt Suggestion Engine",
    short: "AI Prompt Suggestion Engine",
    type: "Experience",
    categories: ["Experience", "AI / LLM"],
    org: "Arminta Solutions · Hyderabad",
    period: "Sep 2025 – Present",
    icon: "Sparkles",
    summary: "Real-time suggestions from partial input, with semantic caching that keeps LLM spend down.",
    stack: ["Python", "FastAPI", "spaCy", "Sentence Transformers", "pgvector", "Redis", "Gemini"],
    resumeStack: "Python, FastAPI, Redis, PostgreSQL, Gemini",
    tags: ["Python", "SQL", "FastAPI", "REST API Design", "PostgreSQL (pgvector)", "Redis (Vector Search)", "NLP (spaCy)", "Sentence Transformers", "Semantic Search", "Vector Indexing (HNSW)", "Gemini API"],
    problem: "Suggestions have to appear while the user is still typing — and sending every similar query to an LLM adds latency and cost.",
    flowLabel: "Request path",
    flow: ["Partial input", "spaCy NLP", "Embeddings", "Redis semantic cache", "pgvector", "Gemini 2.5 Flash Lite"],
    bullets: [
      "Built a real-time FastAPI service that uses spaCy NLP to turn partial user input into contextual keyword suggestions, responding in under 200 ms.",
      "Implemented semantic retrieval with Sentence Transformers embeddings and PostgreSQL pgvector as the persistent vector store for context lookup.",
      "Added Redis embedding and semantic caching with HNSW vector indexing to serve similar queries from cache, cutting Gemini 2.5 Flash Lite API calls by ~40%.",
    ],
    impact: [
      { value: "<200 ms", label: "suggestion responses" },
      { value: "~40%", label: "fewer Gemini API calls" },
    ],
  },
  {
    id: "bookstore",
    title: "Serverless E-Commerce Bookstore on AWS",
    short: "Serverless Bookstore",
    type: "Project",
    categories: ["Project", "Serverless"],
    org: "Lambda · API Gateway · DynamoDB · S3 · Cognito",
    period: "Serverless · AWS",
    icon: "Cloud",
    summary: "A serverless backend for book catalog, shopping cart and order management.",
    stack: ["AWS Lambda", "API Gateway", "DynamoDB", "S3", "Cognito"],
    resumeStack: "Lambda, API Gateway, DynamoDB, S3, Cognito",
    tags: ["AWS Lambda", "API Gateway", "DynamoDB", "S3", "Cognito", "REST API Design"],
    problem: "Run a complete store backend — catalog, cart, orders and user accounts — without provisioning or managing servers.",
    flowLabel: "Request path",
    flow: ["Client", "Cognito auth", "API Gateway", "Lambda", "DynamoDB + S3"],
    bullets: [
      "Built a serverless e-commerce backend with AWS Lambda and API Gateway REST endpoints for book catalog, shopping cart, and order management, using DynamoDB for data persistence.",
      "Secured user sign-up, login, and protected APIs with Amazon Cognito, and stored book cover images in Amazon S3.",
    ],
    impact: [
      { value: "5", label: "AWS services integrated" },
      { value: "3", label: "domains: catalog, cart, orders" },
    ],
  },
];

export const SKILL_GROUPS = [
  { title: "Languages", icon: "Terminal", skills: ["JavaScript", "Python", "SQL"] },
  { title: "Backend & APIs", icon: "Server", skills: ["Node.js", "Fastify", "FastAPI", "REST API Design", "JWT Authentication", "Role-Based Access Control"] },
  { title: "Databases & Caching", icon: "Database", skills: ["MongoDB (Mongoose)", "PostgreSQL (pgvector)", "Redis (Vector Search)"] },
  { title: "AI & LLM Integration", icon: "Brain", skills: ["NLP (spaCy)", "Sentence Transformers", "Semantic Search", "Vector Indexing (HNSW)", "Gemini API"] },
  { title: "Cloud & Messaging", icon: "Cloud", skills: ["AWS Lambda", "API Gateway", "DynamoDB", "S3", "Cognito", "MQTT"] },
  { title: "Tools", icon: "Wrench", skills: ["Git", "GitHub", "Docker", "SQLAlchemy"] },
];

export const JOURNEY = {
  timeline: [
    { when: "2021 – 2025", icon: "GraduationCap", title: "Bachelor of Technology in Computer Science", place: "Institute of Aeronautical Engineering, Hyderabad" },
    { when: "Sep 2025 – Present", icon: "Briefcase", title: "Junior Software Developer", place: "Arminta Solutions · Hyderabad", links: ["water", "prompt"], current: true },
    { when: "Project", icon: "Cloud", title: "Serverless E-Commerce Bookstore on AWS", place: "Lambda · API Gateway · DynamoDB · S3 · Cognito", links: ["bookstore"] },
  ],
  glance: [
    ["Experience", "1+ year"],
    ["Core stacks", "Node.js · Python"],
    ["Based in", "Hyderabad"],
    ["Degree", "B.Tech, CS"],
  ],
};

export const CONTACT = {
  title: "Let's talk APIs, IoT, or",
  accent: "applied AI.",
  text: "The fastest way to reach me is email — one tap copies it.",
};

export const RESUME = {
  skills: [
    ["Languages", "JavaScript, Python, SQL"],
    ["Backend & APIs", "Node.js, Fastify, FastAPI, REST API Design, JWT Authentication, Role-Based Access Control"],
    ["Databases & Caching", "MongoDB (Mongoose), PostgreSQL (pgvector), Redis (Vector Search)"],
    ["AI & LLM Integration", "NLP (spaCy), Sentence Transformers, Semantic Search, Vector Indexing (HNSW), Gemini API"],
    ["Cloud & Messaging", "AWS (Lambda, API Gateway, DynamoDB, S3, Cognito), MQTT"],
    ["Tools", "Git, GitHub, Docker, SQLAlchemy"],
  ],
  experience: [
    { role: "Junior Software Developer", company: "Arminta Solutions Private Limited | Hyderabad", period: "Sep 2025 – Present", projects: ["water", "prompt"] },
  ],
  projects: ["bookstore"],
  education: [
    { degree: "Bachelor of Technology in Computer Science", school: "Institute of Aeronautical Engineering, Hyderabad", period: "2021 – 2025" },
  ],
};

/* ---------- Derived data (no need to edit below) ---------- */
export const WORK_BY_ID = Object.fromEntries(WORK.map((w) => [w.id, w]));
export const ALL_SKILLS = SKILL_GROUPS.flatMap((g) => g.skills);
export const SKILL_USAGE = Object.fromEntries(ALL_SKILLS.map((s) => [s, WORK.filter((w) => w.tags.includes(s)).length]));
export const KEYWORD_BANDS = [
  { after: "home", words: ["Node.js", "Fastify", "FastAPI", "MQTT", "MongoDB", "pgvector"] },
  { after: "skills", words: ["Redis", "Gemini", "spaCy", "AWS Lambda", "DynamoDB", "Cognito"], reverse: true },
];