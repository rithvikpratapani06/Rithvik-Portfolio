// ╔══════════════════════════════════════════════════════════════════════╗
// ║  YOUR PHOTO → paste its URL or local path between the quotes below.  ║
// ╚══════════════════════════════════════════════════════════════════════╝
const PROFILE_PHOTO_URL = "/photo.jpg"; // file in /public, or a full https:// URL. "" = RP monogram

// Avatar framing — tuned for your full-length photo (zooms onto your face).
// Using a tight square headshot instead? Set PHOTO_ZOOM = 1 and PHOTO_POSITION = "50% 20%".
const PHOTO_ZOOM = 1.9;
const PHOTO_POSITION = "50% 21%";
const PHOTO_FOCUS = "42% 45%";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  Activity, ArrowRight, ArrowUpRight, Brain, Briefcase, Check, ChevronLeft, ChevronRight,
  Cloud, CornerDownLeft, Copy, Database, Droplets, FileText, Filter, Gauge, GraduationCap,
  Home, Layers, Mail, MapPin, Phone, Printer, Radio, Search, Server, Sparkles, Terminal,
  Users, Wrench, X, Zap,
} from "lucide-react";

/* ───────────────────────── Content (strictly from resume) ───────────────────────── */

const PROFILE = {
  name: "Rithvik Pratapani",
  first: "Rithvik",
  last: "Pratapani",
  title: "Backend Software Developer",
  currentRole: "Junior Software Developer",
  company: "Arminta Solutions",
  location: "Hyderabad, India",
  email: "rithvik.pratapani03@gmail.com",
  phone: "+91-9063172924",
  phoneHref: "tel:+919063172924",
  linkedin: "https://linkedin.com/in/rithvik-pratapani",
  linkedinLabel: "linkedin.com/in/rithvik-pratapani",
  summary:
    "Backend Software Developer with 1+ year of experience building Node.js/Fastify and Python/FastAPI services for an IoT water-management platform. Built an LLM-powered prompt suggestion engine using Sentence Transformers, PostgreSQL pgvector, Redis vector caching, and Gemini, focused on low-latency APIs and reduced LLM cost.",
};

const LinkedinIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const WORK = [
  {
    id: "water",
    short: "Water Management Platform",
    title: "Water Management Platform",
    type: "Experience",
    categories: ["Experience", "IoT"],
    org: "Arminta Solutions · Hyderabad",
    period: "Sep 2025 – Present",
    icon: Droplets,
    summary: "Backend for an IoT water-management platform — from tank sensors to tanker bookings and deliveries.",
    stack: ["Node.js", "Fastify", "MongoDB", "Mongoose", "MQTT"],
    tags: ["JavaScript", "Node.js", "Fastify", "REST API Design", "JWT Authentication", "Role-Based Access Control", "MongoDB (Mongoose)", "MQTT"],
    roles: ["Customers", "Operators", "Suppliers", "Delivery agents", "Administrators"],
    problem:
      "One backend has to serve five very different users — customers, operators, suppliers, delivery agents and administrators — while telemetry and emergency alerts stream in from IoT tank sensors.",
    flowLabel: "Data path",
    flow: ["50+ tank sensors", "MQTT", "Fastify services", "MongoDB", "Role-based APIs"],
    bullets: [
      "Built and maintained 40+ REST API endpoints across tank monitoring, tanker booking, supplier, delivery, and inventory modules using Fastify routes, controllers, and Mongoose models.",
      "Developed JWT-secured, role-based workflows for 5 user roles: customers, operators, suppliers, delivery agents, and administrators.",
      "Handled MQTT telemetry and emergency-event alerts from 50+ IoT tank sensors, processing and persisting readings in MongoDB; traced and resolved telemetry data issues through MongoDB queries.",
      "Integrated real-time updates, push notifications, file storage, and location services into backend booking and delivery flows.",
    ],
    impact: [
      { k: "40+", v: "REST API endpoints" },
      { k: "5", v: "user roles on JWT + RBAC" },
      { k: "50+", v: "IoT tank sensors" },
    ],
  },
  {
    id: "prompt",
    short: "AI Prompt Suggestion Engine",
    title: "AI-Powered Prompt Suggestion Engine",
    type: "Experience",
    categories: ["Experience", "AI / LLM"],
    org: "Arminta Solutions · Hyderabad",
    period: "Sep 2025 – Present",
    icon: Sparkles,
    summary: "Real-time suggestions from partial input, with semantic caching that keeps LLM spend down.",
    stack: ["Python", "FastAPI", "spaCy", "Sentence Transformers", "pgvector", "Redis", "Gemini"],
    tags: ["Python", "SQL", "FastAPI", "REST API Design", "PostgreSQL (pgvector)", "Redis (Vector Search)", "NLP (spaCy)", "Sentence Transformers", "Semantic Search", "Vector Indexing (HNSW)", "Gemini API"],
    problem:
      "Suggestions have to appear while the user is still typing — and sending every similar query to an LLM adds latency and cost.",
    flowLabel: "Request path",
    flow: ["Partial input", "spaCy NLP", "Embeddings", "Redis semantic cache", "pgvector", "Gemini 2.5 Flash Lite"],
    bullets: [
      "Built a real-time FastAPI service that uses spaCy NLP to turn partial user input into contextual keyword suggestions, responding in under 200 ms.",
      "Implemented semantic retrieval with Sentence Transformers embeddings and PostgreSQL pgvector as the persistent vector store for context lookup.",
      "Added Redis embedding and semantic caching with HNSW vector indexing to serve similar queries from cache, cutting Gemini 2.5 Flash Lite API calls by ~40%.",
    ],
    impact: [
      { k: "<200 ms", v: "suggestion responses" },
      { k: "~40%", v: "fewer Gemini API calls" },
    ],
  },
  {
    id: "bookstore",
    short: "Serverless Bookstore",
    title: "Serverless E-Commerce Bookstore on AWS",
    type: "Project",
    categories: ["Project", "Serverless"],
    org: "Lambda · API Gateway · DynamoDB · S3 · Cognito",
    period: "Serverless · AWS",
    icon: Cloud,
    summary: "A serverless backend for book catalog, shopping cart and order management.",
    stack: ["AWS Lambda", "API Gateway", "DynamoDB", "S3", "Cognito"],
    tags: ["AWS Lambda", "API Gateway", "DynamoDB", "S3", "Cognito", "REST API Design"],
    problem:
      "Run a complete store backend — catalog, cart, orders and user accounts — without provisioning or managing servers.",
    flowLabel: "Request path",
    flow: ["Client", "Cognito auth", "API Gateway", "Lambda", "DynamoDB + S3"],
    bullets: [
      "Built a serverless e-commerce backend with AWS Lambda and API Gateway REST endpoints for book catalog, shopping cart, and order management, using DynamoDB for data persistence.",
      "Secured user sign-up, login, and protected APIs with Amazon Cognito, and stored book cover images in Amazon S3.",
    ],
    impact: [
      { k: "5", v: "AWS services integrated" },
      { k: "3", v: "domains: catalog, cart, orders" },
    ],
  },
];
const WORK_BY_ID = Object.fromEntries(WORK.map((w) => [w.id, w]));

const ROTATOR = [
  { k: "APIs", icon: Server, line: "REST APIs on Fastify", work: "water", proof: "40+ endpoints across tank monitoring, tanker booking, supplier, delivery and inventory modules." },
  { k: "IoT", icon: Radio, line: "IoT telemetry pipelines", work: "water", proof: "MQTT telemetry and emergency alerts from 50+ tank sensors, persisted in MongoDB." },
  { k: "Search", icon: Search, line: "semantic search", work: "prompt", proof: "Sentence Transformers embeddings with PostgreSQL pgvector as the persistent vector store." },
  { k: "LLM", icon: Sparkles, line: "cost-aware LLM features", work: "prompt", proof: "Redis semantic caching with HNSW indexing cut Gemini API calls by ~40%." },
];

const METRICS = [
  { id: "llm", to: 40, prefix: "~", suffix: "%", label: "fewer Gemini 2.5 Flash Lite API calls", detail: "Redis embedding + semantic caching with HNSW vector indexing serves similar queries from cache.", work: "prompt", icon: Sparkles },
  { id: "api", to: 40, suffix: "+", label: "REST API endpoints", detail: "Tank monitoring, booking, supplier, delivery & inventory.", work: "water", icon: Server },
  { id: "iot", to: 50, suffix: "+", label: "IoT tank sensors", detail: "MQTT telemetry & emergency alerts into MongoDB.", work: "water", icon: Radio },
  { id: "lat", to: 200, prefix: "<", suffix: "ms", label: "suggestion response time", detail: "spaCy NLP turns partial input into keywords.", work: "prompt", icon: Zap },
  { id: "roles", to: 5, label: "user roles secured", detail: "JWT + role-based access control.", work: "water", icon: Users },
];

const SKILL_GROUPS = [
  { id: "lang", title: "Languages", icon: Terminal, skills: ["JavaScript", "Python", "SQL"] },
  { id: "backend", title: "Backend & APIs", icon: Server, skills: ["Node.js", "Fastify", "FastAPI", "REST API Design", "JWT Authentication", "Role-Based Access Control"] },
  { id: "data", title: "Databases & Caching", icon: Database, skills: ["MongoDB (Mongoose)", "PostgreSQL (pgvector)", "Redis (Vector Search)"] },
  { id: "ai", title: "AI & LLM Integration", icon: Brain, skills: ["NLP (spaCy)", "Sentence Transformers", "Semantic Search", "Vector Indexing (HNSW)", "Gemini API"] },
  { id: "cloud", title: "Cloud & Messaging", icon: Cloud, skills: ["AWS Lambda", "API Gateway", "DynamoDB", "S3", "Cognito", "MQTT"] },
  { id: "tools", title: "Tools", icon: Wrench, skills: ["Git", "GitHub", "Docker", "SQLAlchemy"] },
];
const ALL_SKILLS = SKILL_GROUPS.flatMap((g) => g.skills);
const USAGE = Object.fromEntries(ALL_SKILLS.map((s) => [s, WORK.filter((w) => w.tags.includes(s)).length]));

const NAV = [
  { id: "home", label: "Home", icon: Home },
  { id: "impact", label: "Impact", icon: Gauge },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Layers },
  { id: "journey", label: "Journey", icon: GraduationCap },
  { id: "contact", label: "Contact", icon: Mail },
];
const SECTION_IDS = NAV.map((n) => n.id);

/* Section colour journey — the whole site (and the 3D scene) morphs between these */
const THEMES = {
  home: { a: "#2EF2C4", b: "#3B9BFF" }, // aqua → ocean
  impact: { a: "#5B9DFF", b: "#22D3EE" }, // electric blue → cyan
  work: { a: "#B794FF", b: "#FF7AC6" }, // lavender → pink
  skills: { a: "#7CF29A", b: "#38BDF8" }, // mint → sky
  journey: { a: "#FFC861", b: "#FF8A7A" }, // amber → coral
  contact: { a: "#FF7AC6", b: "#B794FF" }, // pink → lavender
};
/* Where the 3D shape sits for each section (dir: -1 left, 1 right, 0 centre) */
const LAYOUT = [
  { dir: 1, tilt: 0.15 },
  { dir: -1, tilt: 0.6 },
  { dir: 1, tilt: 0.35 },
  { dir: -1, tilt: 0.4 },
  { dir: 1, tilt: 0.1 },
  { dir: 0, tilt: 1.05 },
];

const RESUME_SKILLS = [
  ["Languages", "JavaScript, Python, SQL"],
  ["Backend & APIs", "Node.js, Fastify, FastAPI, REST API Design, JWT Authentication, Role-Based Access Control"],
  ["Databases & Caching", "MongoDB (Mongoose), PostgreSQL (pgvector), Redis (Vector Search)"],
  ["AI & LLM Integration", "NLP (spaCy), Sentence Transformers, Semantic Search, Vector Indexing (HNSW), Gemini API"],
  ["Cloud & Messaging", "AWS (Lambda, API Gateway, DynamoDB, S3, Cognito), MQTT"],
  ["Tools", "Git, GitHub, Docker, SQLAlchemy"],
];

/* ───────────────────────── Styles ───────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600&display=swap');
@property --accent{syntax:'<color>';inherits:true;initial-value:#2EF2C4}
@property --accent-2{syntax:'<color>';inherits:true;initial-value:#3B9BFF}
@property --angle{syntax:'<angle>';inherits:false;initial-value:0deg}
:root{--bg:#04050B;--line:rgba(255,255,255,.09);--line-strong:rgba(255,255,255,.16);--text:#EDF1F7;--muted:#98A1B4;--ink:#05060D;--k:1}
@media (max-width:767px){:root{--k:.55}}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;transition:--accent 1.1s ease,--accent-2 1.1s ease}
body{background:var(--bg);margin:0}
.app-root{background:var(--bg);color:var(--text);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;overflow-x:clip}
.font-display{font-family:'Bricolage Grotesque','Inter',sans-serif}
.font-mono-ui{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.text-muted{color:var(--muted)}
.text-accent{color:var(--accent)}
.bg-accent{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--ink)}
.tint{background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--accent)}
.tint-soft{background:color-mix(in srgb,var(--accent) 6%,transparent);border-color:color-mix(in srgb,var(--accent) 30%,transparent)}
.ring-accent{border-color:color-mix(in srgb,var(--accent) 65%,transparent)!important;box-shadow:0 0 0 1px color-mix(in srgb,var(--accent) 35%,transparent),0 30px 70px -35px color-mix(in srgb,var(--accent) 70%,transparent)}
.hairline{border-color:var(--line)}
.chip{border:1px solid var(--line);background:rgba(255,255,255,.035)}
.glass{background:rgba(9,11,22,.8);border:1px solid var(--line)}
@media (min-width:768px){.glass{background:linear-gradient(180deg,rgba(18,22,40,.55),rgba(8,10,20,.42));backdrop-filter:blur(18px) saturate(150%);-webkit-backdrop-filter:blur(18px) saturate(150%)}}
.glass-strong{background:rgba(8,10,20,.8);border:1px solid var(--line-strong);backdrop-filter:blur(20px) saturate(150%);-webkit-backdrop-filter:blur(20px) saturate(150%)}
.h-display{font-size:clamp(2.75rem,6.2vw + .6rem,6.5rem);line-height:.92;letter-spacing:-.04em}
.h-section{font-size:clamp(2rem,3.1vw + 1rem,3.75rem);line-height:1.02;letter-spacing:-.03em}
.h-card{font-size:clamp(1.3rem,1.1vw + 1rem,1.95rem);line-height:1.15;letter-spacing:-.02em}
.h-metric{font-size:clamp(3rem,4.5vw + 1rem,5.5rem);line-height:.9;letter-spacing:-.045em}
.h-metric-sm{font-size:clamp(2rem,2.4vw + 1rem,3.25rem);line-height:.95;letter-spacing:-.04em}
.lead{font-size:clamp(1rem,.3vw + .93rem,1.15rem);line-height:1.65}
.text-gradient{background:linear-gradient(90deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent}
.glow-text{text-shadow:0 0 42px color-mix(in srgb,var(--accent) 38%,transparent)}
.bg-grid{background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:56px 56px;-webkit-mask-image:radial-gradient(ellipse at 50% 0%,#000 20%,transparent 70%);mask-image:radial-gradient(ellipse at 50% 0%,#000 20%,transparent 70%)}
.ambient{background:radial-gradient(520px circle at var(--mx,25%) var(--my,15%),color-mix(in srgb,var(--accent) 14%,transparent),transparent 62%)}
.glow-accent{background:radial-gradient(closest-side,color-mix(in srgb,var(--accent) 34%,transparent),color-mix(in srgb,var(--accent-2) 14%,transparent) 60%,transparent)}
.photo-aspect{aspect-ratio:4/5}
@media (min-width:1024px){.photo-aspect{aspect-ratio:auto;height:100%;min-height:34rem}}
.sheet-h{max-height:88vh;max-height:88dvh}
@media (min-width:768px){.sheet-h{max-height:none}}
.rotator-box{min-height:2.4em}
.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{scrollbar-width:none}
.reveal{opacity:0;transform:perspective(1100px) translate3d(0,50px,-80px) rotateX(18deg);transform-origin:50% 100%;transition:opacity .9s cubic-bezier(.16,1,.3,1),transform 1.1s cubic-bezier(.16,1,.3,1)}
.reveal.is-in{opacity:1;transform:none}
.char{display:inline-block;transform-origin:50% 100%;animation:charIn 1.1s cubic-bezier(.16,1,.3,1) both}
@keyframes charIn{from{opacity:0;transform:perspective(600px) translate3d(0,.45em,0) rotateX(-85deg)}to{opacity:1;transform:none}}
.rot-enter{animation:rotIn .55s cubic-bezier(.16,1,.3,1) both}
@keyframes rotIn{from{opacity:0;transform:perspective(500px) translateY(.4em) rotateX(-40deg)}to{opacity:1;transform:none}}
.pulse-dot{background:var(--accent);animation:pulse 2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 60%,transparent)}70%{box-shadow:0 0 0 9px transparent}100%{box-shadow:0 0 0 0 transparent}}
.tilt{position:relative;transform:perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .6s cubic-bezier(.16,1,.3,1),border-color .4s,opacity .4s,box-shadow .4s}
.tilt::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:radial-gradient(420px circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.1),transparent 45%);opacity:0;transition:opacity .4s}
@media (hover:hover){.tilt:hover::after{opacity:1}.tilt:hover{border-color:color-mix(in srgb,var(--accent) 45%,transparent)}}
.magnet{transform:translate3d(var(--tx,0px),var(--ty,0px),0);transition:transform .4s cubic-bezier(.16,1,.3,1)}
.btn-shine{position:relative;overflow:hidden}
.btn-shine::after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);transition:left .7s ease}
@media (hover:hover){.btn-shine:hover::after{left:120%}}
.spin-border::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1.5px;background:conic-gradient(from var(--angle),transparent 0 55%,var(--accent) 72%,var(--accent-2) 88%,transparent);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:spin 5s linear infinite;pointer-events:none;z-index:2}
@keyframes spin{to{--angle:360deg}}
.scroll-3d{transform:perspective(1600px) translate3d(0,calc(var(--pin,0) * 70px * var(--k)),0) rotateX(calc(var(--pin,0) * -16deg * var(--k))) scale(calc(1 - var(--pin,0) * .06 * var(--k)));transform-origin:50% 0%}
.hero-exit{transform:perspective(1600px) translate3d(0,calc(var(--h,0) * -60px),0) rotateX(calc(var(--h,0) * 10deg)) scale(calc(1 - var(--h,0) * .07));opacity:calc(1 - var(--h,0) * .75);transform-origin:50% 100%}
.parallax{transform:translate3d(0,calc(var(--py,0) * var(--speed,40px)),0)}
.section-num{font-size:clamp(6rem,15vw,13rem);line-height:.8;color:transparent;-webkit-text-stroke:1px color-mix(in srgb,var(--accent) 40%,transparent);letter-spacing:-.05em}
.band-wrap{margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);overflow:hidden;transform:rotate(-2.5deg);border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--accent) 6%,rgba(4,5,11,.7));padding:.35em 0}
.band{display:flex;width:max-content;white-space:nowrap;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:clamp(2.4rem,7vw,6.5rem);line-height:1.05;letter-spacing:-.03em;transform:translate3d(calc(var(--py,0) * 700px * var(--dir,1) - 30%),0,0)}
.band-outline{color:transparent;-webkit-text-stroke:1.5px var(--accent)}
.band-star{color:var(--accent);margin:0 .4em;font-size:.45em;vertical-align:middle}
.marquee{display:flex;width:max-content;animation:marquee 40s linear infinite}
.marquee-wrap:hover .marquee{animation-play-state:paused}
@keyframes marquee{to{transform:translateX(-50%)}}
.water{transition:height 1.2s cubic-bezier(.16,1,.3,1);background:linear-gradient(180deg,var(--accent-2),var(--accent))}
.bar-fill{transition:width 1.4s cubic-bezier(.16,1,.3,1)}
.line-fill{transform-origin:top;transition:transform 1.6s cubic-bezier(.16,1,.3,1);background:linear-gradient(180deg,var(--accent),var(--accent-2))}
.fade-in{animation:fadeIn .22s ease both}@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.pop-in{animation:popIn .3s cubic-bezier(.16,1,.3,1) both}@keyframes popIn{from{opacity:0;transform:translateY(8px) scale(.985)}to{opacity:1;transform:none}}
.cursor-glow{width:420px;height:420px;border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,var(--accent) 18%,transparent),transparent);transition:opacity .5s}
.progress{transform-origin:0 50%;background:linear-gradient(90deg,var(--accent),var(--accent-2))}
.rail,.hud{display:none}
@media (min-width:1440px){.rail{display:flex;flex-direction:column}.hud{display:block}}
.rail-dot{display:block;width:6px;height:6px;border-radius:9999px;background:rgba(255,255,255,.3);transition:height .4s cubic-bezier(.16,1,.3,1),background .4s,box-shadow .4s}
.rail-dot[data-on="true"]{height:26px;background:linear-gradient(var(--accent),var(--accent-2));box-shadow:0 0 14px color-mix(in srgb,var(--accent) 60%,transparent)}
.globe{height:19rem;cursor:grab}
.globe:active{cursor:grabbing}
.globe-core{position:absolute;inset:16%;border-radius:50%;background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--accent) 22%,transparent),transparent 62%);border:1px solid color-mix(in srgb,var(--accent) 18%,transparent);pointer-events:none}
.globe-core::before,.globe-core::after{content:"";position:absolute;inset:0;border-radius:50%;border:1px dashed color-mix(in srgb,var(--accent) 22%,transparent)}
.globe-core::before{transform:scaleY(.32)}
.globe-core::after{transform:scaleX(.32)}
.globe-item{transform:translate(-50%,-50%)}
.tap{-webkit-tap-highlight-color:transparent;touch-action:manipulation}
button:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}html{scroll-behavior:auto}.reveal,.hero-exit{opacity:1!important;transform:none!important}.tilt,.scroll-3d,.parallax,.magnet{transform:none!important}.band{transform:translate3d(-30%,0,0)!important}}
.h-display{font-size:clamp(2.75rem,5.4vw + .6rem,6rem)}
.avatar-ring{position:relative;border-radius:9999px;padding:3px;background:conic-gradient(from var(--angle),var(--accent),var(--accent-2),transparent 55%,var(--accent));animation:spin 4s linear infinite}
.avatar-inner{position:relative;overflow:hidden;border-radius:9999px;background:#0A0D1A;border:3px solid var(--bg)}
.avatar-size{width:5.5rem;height:5.5rem}
@media (min-width:640px){.avatar-size{width:7rem;height:7rem}}
@media (min-width:1024px){.avatar-size{width:9rem;height:9rem}}
@media (min-width:1280px){.avatar-size{width:10rem;height:10rem}}
@media print{
  @page{margin:.5in}
  .screen-only,.resume-chrome{display:none!important}
  html,body,.app-root{background:#fff!important;overflow:visible!important;height:auto!important}
  .resume-shell{position:static!important;overflow:visible!important;background:none!important;animation:none!important}
  .resume-shell>div{padding:0!important;max-width:none!important}
  #resume-print{box-shadow:none!important;border-radius:0!important;padding:0!important;margin:0!important;animation:none!important}
  #resume-print a{color:#000!important;text-decoration:none!important}
  #resume-print li{break-inside:avoid}
}
`;

/* ───────────────────────── Utilities ───────────────────────── */

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

/* 3D tilt toward the mouse (mouse only — touch stays flat) */
const tilt = (max = 8) => ({
  onPointerMove: (e) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${((x - 0.5) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
  },
  onPointerLeave: (e) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  },
});

/* Buttons that lean toward the cursor */
const magnet = {
  onPointerMove: (e) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--tx", `${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px`);
    el.style.setProperty("--ty", `${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px`);
  },
  onPointerLeave: (e) => {
    e.currentTarget.style.setProperty("--tx", "0px");
    e.currentTarget.style.setProperty("--ty", "0px");
  },
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ as: Tag = "div", delay = 0, className = "", style, children, ...rest }) {
  const [ref, inView] = useInView(0.12);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setSettled(true), delay + 1100);
    return () => clearTimeout(t);
  }, [inView, delay]);
  const cls = settled ? className : `reveal ${inView ? "is-in" : ""} ${className}`;
  return (
    <Tag ref={ref} className={cls} style={settled ? style : { transitionDelay: `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

function CountUp({ to, prefix = "", suffix = "", start, duration = 1400 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, duration]);
  return (
    <span className="tabular-nums">
      {prefix}
      {n}
      {suffix && <span style={{ fontSize: suffix.length > 1 ? "0.45em" : "0.7em", marginLeft: "0.04em" }}>{suffix}</span>}
    </span>
  );
}

/* ───────────────────────── 3D particle scene ───────────────────────── */

function buildShapes(N) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const r = () => Math.random() - 0.5;
  const make = (fn) => {
    const a = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const p = fn(i, i / N);
      a[i * 3] = p[0];
      a[i * 3 + 1] = p[1];
      a[i * 3 + 2] = p[2];
    }
    return a;
  };
  // Home — water-drop sphere
  const sphere = make((i, u) => {
    const y = 1 - 2 * u;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    const R = 3 + r() * 0.15;
    return [Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R];
  });
  // Impact — wave field
  const side = Math.ceil(Math.sqrt(N));
  const wave = make((i) => {
    const x = ((i % side) / side - 0.5) * 10;
    const z = (Math.floor(i / side) / side - 0.5) * 10;
    return [x, Math.sin(x * 0.9) * 0.55 + Math.cos(z * 0.75) * 0.55, z];
  });
  // Work — torus knot
  const knot = make((i, u) => {
    const t = u * Math.PI * 2;
    const rr = Math.cos(3 * t) + 2;
    return [rr * Math.cos(2 * t) * 1.05 + r() * 0.3, rr * Math.sin(2 * t) * 1.05 + r() * 0.3, -Math.sin(3 * t) * 1.05 + r() * 0.3];
  });
  // Skills — lattice cube
  const cube = make(() => {
    const s = 2.3;
    const g = (v) => Math.round(v / 0.46) * 0.46;
    const a = g((Math.random() * 2 - 1) * s);
    const b = g((Math.random() * 2 - 1) * s);
    const c = [[s, a, b], [-s, a, b], [a, s, b], [a, -s, b], [a, b, s], [a, b, -s]][Math.floor(Math.random() * 6)];
    return [c[0] + r() * 0.05, c[1] + r() * 0.05, c[2] + r() * 0.05];
  });
  // Journey — double helix
  const helix = make((i, u) => {
    const t = u * Math.PI * 9;
    const y = (u - 0.5) * 8.5;
    const R = 1.6;
    if (i % 9 === 0) {
      const f = Math.random() * 2 - 1;
      return [Math.cos(t) * R * f, y, Math.sin(t) * R * f];
    }
    const ang = t + (i % 2) * Math.PI;
    return [Math.cos(ang) * R + r() * 0.15, y + r() * 0.1, Math.sin(ang) * R + r() * 0.15];
  });
  // Contact — spiral galaxy
  const galaxy = make((i) => {
    const rr = Math.pow(Math.random(), 0.65) * 3.8;
    const ang = ((i % 3) / 3) * Math.PI * 2 + rr * 1.25;
    const sp = 0.35 * (0.4 + rr * 0.25);
    return [Math.cos(ang) * rr + r() * sp, r() * 0.3 * (1.2 - rr / 4), Math.sin(ang) * rr + r() * sp];
  });
  return [sphere, wave, knot, cube, helix, galaxy];
}

function makeSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.3, "rgba(255,255,255,.6)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function Scene3D({ sectionRef }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL — the CSS background still looks good
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const COUNT = mobile ? 1600 : 4200;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    const shapes = buildShapes(COUNT);
    const base = new Float32Array(shapes[0]);
    const positions = new Float32Array(shapes[0]);
    const colors = new Float32Array(COUNT * 3);
    const mixes = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      mixes[i] = Math.random();
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const sprite = makeSprite();
    const mat = new THREE.PointsMaterial({
      size: mobile ? 0.085 : 0.065,
      map: sprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const group = new THREE.Group();
    group.add(new THREE.Points(geo, mat));
    scene.add(group);

    const DUST = mobile ? 220 : 600;
    const dustPos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 30;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      dustPos[i * 3 + 2] = -Math.random() * 14 + 2;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ size: 0.05, map: sprite, color: 0x9fb2d0, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    const cA = new THREE.Color(THEMES.home.a);
    const cB = new THREE.Color(THEMES.home.b);
    const tA = new THREE.Color();
    const tB = new THREE.Color();
    const tmp = new THREE.Color();

    let vw = 1;
    let vh = 1;
    let sideX = 3;
    const resize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      renderer.setSize(vw, vh, false);
      camera.aspect = vw / vh;
      camera.updateProjectionMatrix();
      const halfW = Math.tan((camera.fov * Math.PI) / 360) * 10 * camera.aspect;
      const frac = Math.min(1280, vw) / vw;
      sideX = vw >= 1600 ? ((1 + frac) / 2) * halfW : 0.42 * halfW;
    };
    resize();

    const mouse = { x: 0, y: 0 };
    const onPointer = (e) => {
      mouse.x = (e.clientX / vw) * 2 - 1;
      mouse.y = -((e.clientY / vh) * 2 - 1);
    };
    let lastY = window.scrollY;
    let spin = 0;
    const onScroll = () => {
      const y = window.scrollY;
      spin = Math.max(-0.06, Math.min(0.06, spin + (y - lastY) * 0.0004));
      lastY = y;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const t = (now - t0) / 1000;
      const idx = Math.max(0, Math.min(shapes.length - 1, sectionRef.current || 0));
      const target = shapes[idx];

      const k = reduce ? 1 : 0.05;
      for (let i = 0, n = COUNT * 3; i < n; i++) base[i] += (target[i] - base[i]) * k;
      const amp = reduce ? 0 : 0.045;
      for (let i = 0; i < COUNT; i++) {
        const j = i * 3;
        const ph = phases[i];
        positions[j] = base[j] + Math.sin(t * 0.9 + ph) * amp;
        positions[j + 1] = base[j + 1] + Math.cos(t * 0.7 + ph) * amp;
        positions[j + 2] = base[j + 2];
      }
      geo.attributes.position.needsUpdate = true;

      const th = THEMES[SECTION_IDS[idx]];
      tA.set(th.a);
      tB.set(th.b);
      cA.lerp(tA, 0.035);
      cB.lerp(tB, 0.035);
      for (let i = 0; i < COUNT; i++) {
        tmp.copy(cA).lerp(cB, mixes[i]);
        colors[i * 3] = tmp.r;
        colors[i * 3 + 1] = tmp.g;
        colors[i * 3 + 2] = tmp.b;
      }
      geo.attributes.color.needsUpdate = true;

      const lay = LAYOUT[idx];
      const tx = mobile ? 0 : lay.dir * sideX;
      group.position.x += (tx - group.position.x) * 0.04;
      group.scale.setScalar(mobile ? 0.72 : vw >= 1600 ? 0.85 : 1);
      if (!reduce) group.rotation.y += 0.0022 + spin;
      spin *= 0.93;
      group.rotation.x += (lay.tilt + mouse.y * 0.3 - group.rotation.x) * 0.04;
      group.rotation.z += (-mouse.x * 0.12 - group.rotation.z) * 0.04;
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      dust.rotation.y = t * 0.012;
      dust.rotation.x = lastY * 0.00015;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      geo.dispose();
      mat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      sprite.dispose();
      renderer.dispose();
    };
  }, [sectionRef]);
  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 h-full w-full" style={{ zIndex: 0 }} />;
}

function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf;
    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (ref.current) ref.current.style.opacity = "1";
    };
    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      if (ref.current) ref.current.style.transform = `translate3d(${x - 210}px, ${y - 210}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);
  return <div ref={ref} aria-hidden className="cursor-glow pointer-events-none fixed left-0 top-0 hidden md:block" style={{ zIndex: 0, opacity: 0 }} />;
}

/* ───────────────────────── Shared pieces ───────────────────────── */

function ProfilePhoto() {
  const [failed, setFailed] = useState(false);
  if (PROFILE_PHOTO_URL && !failed) {
    return (
      <img
        src={PROFILE_PHOTO_URL}
        alt={`Portrait of ${PROFILE.name}`}
        onError={() => setFailed(true)}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: PHOTO_POSITION, transform: `scale(${PHOTO_ZOOM})`, transformOrigin: PHOTO_FOCUS }}
      />
    );
  }
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--accent) 30%, transparent), #0A0D1A 70%)" }}
    >
      <span className="font-display font-extrabold text-accent" style={{ fontSize: "clamp(1.6rem, 3vw, 2.8rem)" }}>
        RP
      </span>
    </div>
  );
}

function Avatar() {
  return (
    <div {...tilt(10)} className="tilt relative shrink-0 rounded-full">
      <div aria-hidden className="glow-accent pointer-events-none absolute -inset-5 rounded-full" />
      <div className="avatar-ring">
        <div className="avatar-inner avatar-size">
          <ProfilePhoto />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ index, eyebrow, title, sub }) {
  return (
    <div data-scroll className="relative mb-8 md:mb-12">
      <span
        aria-hidden
        className="section-num font-display parallax pointer-events-none absolute -top-6 right-0 select-none font-extrabold sm:-top-12"
        style={{ "--speed": "-110px" }}
      >
        {index}
      </span>
      <Reveal className="relative max-w-2xl">
        <p className="font-mono-ui inline-flex items-center gap-3 text-xs uppercase tracking-widest text-accent">
          <span className="h-px w-8" style={{ background: "var(--accent)" }} />
          {index} — {eyebrow}
        </p>
        <h2 className="font-display h-section mt-3 font-bold">{title}</h2>
        {sub && <p className="lead mt-3 text-muted">{sub}</p>}
      </Reveal>
    </div>
  );
}

function ScrollBand({ words, reverse }) {
  const line = [...words, ...words, ...words];
  return (
    <div data-scroll aria-hidden className="band-wrap my-20 sm:my-28">
      <div className="band" style={{ "--dir": reverse ? -1 : 1 }}>
        {line.map((w, i) => (
          <span key={i} className={i % 2 ? "band-outline" : ""}>
            {w}
            <span className="band-star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const IconBox = ({ icon: I, size = 20, className = "h-11 w-11 rounded-xl" }) => (
  <span className={`tint flex shrink-0 items-center justify-center ${className}`}>
    <I size={size} />
  </span>
);

/* ───────────────────────── Hero ───────────────────────── */

function TelemetryCard({ openWork }) {
  const [tanks, setTanks] = useState([
    { id: "T-01", v: 78 },
    { id: "T-02", v: 54 },
    { id: "T-03", v: 31 },
    { id: "T-04", v: 66 },
  ]);
  const [last, setLast] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      if (document.hidden) return;
      const i = Math.floor(Math.random() * 4);
      const delta = Math.round((Math.random() - 0.5) * 22);
      setTanks((prev) => prev.map((tk, j) => (j === i ? { ...tk, v: Math.max(8, Math.min(97, tk.v + delta)) } : tk)));
      setLast(i);
    }, 1700);
    return () => clearInterval(t);
  }, []);
  const lt = tanks[last];
  return (
    <Reveal delay={140} className="md:col-span-3 lg:col-span-4">
      <div {...tilt(6)} className="tilt glass h-full overflow-hidden rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <p className="inline-flex items-center gap-2 text-sm font-medium">
            <Activity size={16} className="text-accent" /> Tank telemetry
          </p>
          <span className="chip font-mono-ui rounded-full px-2.5 py-1 text-xs text-muted">simulated</span>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-2.5">
          {tanks.map((tk) => {
            const low = tk.v < 20;
            return (
              <div key={tk.id} className="flex flex-col items-center gap-2">
                <div className="relative h-24 w-full overflow-hidden rounded-xl border hairline" style={{ background: "rgba(255,255,255,.02)" }}>
                  <div className="water absolute inset-x-0 bottom-0" style={{ height: `${tk.v}%`, ...(low ? { background: "linear-gradient(180deg,#FFB86B,#FF6B6B)" } : {}) }} />
                  <span className="font-mono-ui absolute inset-x-0 top-1.5 text-center text-xs">{tk.v}%</span>
                </div>
                <span className="font-mono-ui text-xs text-muted">{tk.id}</span>
              </div>
            );
          })}
        </div>
        <p className="font-mono-ui mt-4 truncate rounded-lg border hairline px-3 py-2 text-xs text-muted">
          <span className="text-accent">mqtt›</span> tanks/{lt.id}/level → {lt.v}%{lt.v < 20 ? "  ⚠ low-level alert" : ""}
        </p>
        <button onClick={() => openWork("water")} className="tap mt-2 inline-flex h-11 items-center gap-1.5 text-sm text-muted hover:text-white">
          Illustrative feed — see the real pipeline <ArrowUpRight size={15} />
        </button>
      </div>
    </Reveal>
  );
}

const HIGHLIGHTS = [
  { k: "~40%", v: "fewer Gemini API calls", work: "prompt" },
  { k: "<200ms", v: "suggestion responses", work: "prompt" },
  { k: "40+", v: "REST endpoints built", work: "water" },
];

function Hero({ openWork, openResume, openPalette, copyEmail, scrollTo, isMac }) {
  const [idx, setIdx] = useState(0);
  const manualAt = useRef(0);
  useEffect(() => {
    const t = setInterval(() => {
      if (Date.now() - manualAt.current > 9000 && !document.hidden) setIdx((i) => (i + 1) % ROTATOR.length);
    }, 3400);
    return () => clearInterval(t);
  }, []);
  const pick = (i) => {
    manualAt.current = Date.now();
    setIdx(i);
  };
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const cur = ROTATOR[idx];
  const lastLen = PROFILE.last.length - 1;

  return (
    <section id="home" className="scroll-mt-28">
      <div id="hero-stage" className="hero-exit grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-6 lg:grid-cols-12">
        {/* Intro */}
        <Reveal onPointerMove={onMove} className="glass relative flex flex-col overflow-hidden rounded-3xl p-6 sm:p-8 md:col-span-6 lg:col-span-8 lg:row-span-2 lg:p-10">
          <div aria-hidden className="ambient pointer-events-none absolute inset-0" />
          <div className="relative flex flex-wrap items-center gap-2">
            <span className="chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted">
              <span className="pulse-dot h-2 w-2 rounded-full" /> Building at {PROFILE.company}
            </span>
            <span className="chip inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted">
              <MapPin size={13} /> {PROFILE.location}
            </span>
            <span className="chip font-mono-ui inline-flex items-center rounded-full px-3 py-1.5 text-xs text-accent">1+ yr · backend</span>
          </div>

          <div className="relative mt-7 flex flex-col-reverse items-start gap-5 sm:mt-9 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <h1 aria-label={PROFILE.name} className="font-display h-display m-0 min-w-0 font-extrabold">
              <span aria-hidden className="block whitespace-nowrap">
                {PROFILE.first.split("").map((c, i) => (
                  <span key={i} className="char" style={{ animationDelay: `${200 + i * 45}ms` }}>
                    {c}
                  </span>
                ))}
              </span>
              <span aria-hidden className="glow-text block whitespace-nowrap pb-1">
                {PROFILE.last.split("").map((c, i) => (
                  <span
                    key={i}
                    className="char"
                    style={{ animationDelay: `${520 + i * 45}ms`, color: `color-mix(in srgb, var(--accent) ${Math.round(100 - (i / lastLen) * 100)}%, var(--accent-2))` }}
                  >
                    {c}
                  </span>
                ))}
              </span>
            </h1>
            <Avatar />
          </div>

          <p className="font-display h-card rotator-box relative mt-5 font-semibold" aria-live="polite">
            <span className="text-muted">Backend developer building </span>
            <span key={idx} className="rot-enter text-gradient inline-block">
              {cur.line}
            </span>
          </p>

          <div role="tablist" aria-label="What I build" className="relative mt-4 flex flex-wrap gap-2">
            {ROTATOR.map((r, i) => {
              const I = r.icon;
              const on = i === idx;
              return (
                <button
                  key={r.k}
                  role="tab"
                  aria-selected={on}
                  onClick={() => pick(i)}
                  className={`tap inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${on ? "bg-accent border-transparent font-semibold" : "chip text-muted hover:text-white"}`}
                >
                  <I size={15} /> {r.k}
                </button>
              );
            })}
          </div>

          <div key={`proof-${idx}`} className="rot-enter tint-soft relative mt-4 flex items-center gap-3 rounded-2xl border p-3 pl-4">
            <Zap size={16} className="shrink-0 text-accent" />
            <p className="m-0 flex-1 text-sm leading-relaxed text-muted">{cur.proof}</p>
            <button onClick={() => openWork(cur.work)} className="tap inline-flex h-11 shrink-0 items-center gap-1 rounded-xl px-3 text-sm text-accent hover:bg-white/5">
              Details <ArrowUpRight size={15} />
            </button>
          </div>

          <p className="lead relative mt-6 max-w-2xl text-muted">{PROFILE.summary}</p>

          <div className="relative mt-8 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-8">
            <button {...magnet} onClick={() => scrollTo("work")} className="magnet btn-shine tap bg-accent inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold">
              Explore my work <ArrowRight size={16} />
            </button>
            <button {...magnet} onClick={openResume} className="magnet tap chip inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm hover:bg-white/10">
              <FileText size={16} /> Resume
            </button>
            <button onClick={copyEmail} aria-label="Copy email address" className="tap chip inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm hover:bg-white/10">
              <Copy size={16} /> <span className="hidden sm:inline">Copy email</span>
            </button>
            <button onClick={openPalette} className="tap inline-flex h-12 items-center gap-2 rounded-full px-3 text-sm text-muted hover:text-white">
              <Search size={16} /> Quick actions
              <kbd className="chip font-mono-ui hidden rounded-md px-1.5 py-0.5 text-xs md:inline">{isMac ? "⌘" : "Ctrl"} K</kbd>
            </button>
          </div>
        </Reveal>

        <TelemetryCard openWork={openWork} />

        {/* Highlights */}
        <Reveal delay={200} className="md:col-span-3 lg:col-span-4">
          <div {...tilt(6)} className="tilt glass h-full rounded-3xl p-5 sm:p-6">
            <p className="font-mono-ui m-0 text-xs uppercase tracking-widest text-muted">Highlights</p>
            <div className="mt-2 flex flex-col">
              {HIGHLIGHTS.map((h, i) => (
                <button key={h.k} onClick={() => openWork(h.work)} className={`tap flex h-16 items-center gap-3 text-left ${i ? "border-t hairline" : ""}`}>
                  <span className="font-display text-gradient w-24 shrink-0 text-2xl font-bold">{h.k}</span>
                  <span className="flex-1 text-sm text-muted">{h.v}</span>
                  <ArrowUpRight size={15} className="shrink-0 text-muted" />
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Now */}
        <Reveal delay={180} className="glass relative overflow-hidden rounded-3xl md:col-span-6 lg:col-span-12">
          <div className="p-5 sm:p-6 lg:p-8">
            <p className="font-mono-ui text-xs uppercase tracking-widest text-muted">Now</p>
            <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-display h-card m-0 font-bold">
                {PROFILE.currentRole} <span className="text-muted">at</span> {PROFILE.company}
              </h3>
              <p className="font-mono-ui m-0 text-xs text-muted">Sep 2025 – Present</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["water", "prompt"].map((id) => {
                const w = WORK_BY_ID[id];
                return (
                  <button key={id} {...tilt(5)} onClick={() => openWork(id)} className="tilt tap flex items-center gap-4 rounded-2xl border hairline p-4 text-left" style={{ background: "rgba(255,255,255,.025)" }}>
                    <IconBox icon={w.icon} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{w.short}</span>
                      <span className="block truncate text-xs text-muted">{w.stack.slice(0, 3).join(" · ")}</span>
                    </span>
                    <ArrowUpRight size={18} className="shrink-0 text-muted" />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="marquee-wrap overflow-hidden border-t hairline py-3" aria-hidden="true">
            <div className="marquee">
              {[...ALL_SKILLS, ...ALL_SKILLS].map((s, i) => (
                <span key={i} className="chip mx-1 whitespace-nowrap rounded-full px-3 py-1 text-xs text-muted">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Impact ───────────────────────── */

function Impact({ openWork }) {
  const [ref, inView] = useInView(0.2);
  const [big, ...rest] = METRICS;
  const spans = ["lg:col-span-4", "lg:col-span-3", "lg:col-span-3", "lg:col-span-4"];
  return (
    <section id="impact" className="scroll-mt-28 pt-4 sm:pt-8">
      <SectionHeader
        index="01"
        eyebrow="Impact"
        title={
          <>
            Numbers from <span className="text-gradient">production work.</span>
          </>
        }
        sub="Every figure comes straight from my resume. Tap one to see the work behind it."
      />
      <div ref={ref} data-scroll className="scroll-3d grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
        <Reveal className="col-span-2 lg:col-span-5 lg:row-span-2">
          <button {...tilt(6)} onClick={() => openWork(big.work)} className="tilt glass tap flex h-full w-full flex-col overflow-hidden rounded-3xl p-6 text-left sm:p-8">
            <div aria-hidden className="glow-accent pointer-events-none absolute -right-24 -top-24 h-72 w-72 opacity-70" />
            <span className="chip relative inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs text-muted">
              <Sparkles size={14} className="text-accent" /> LLM cost
            </span>
            <p className="font-display h-metric text-gradient relative mt-6 font-extrabold">
              <CountUp start={inView} to={big.to} prefix={big.prefix} suffix={big.suffix} />
            </p>
            <p className="relative mt-3 text-lg font-medium">{big.label}</p>
            <p className="relative mt-2 text-sm leading-relaxed text-muted">{big.detail}</p>
            <div className="relative mt-8 space-y-4 lg:mt-auto lg:pt-8">
              {[
                { l: "Without semantic cache", w: 100, c: "rgba(255,255,255,.22)" },
                { l: "With Redis semantic cache", w: 60, c: "linear-gradient(90deg,var(--accent-2),var(--accent))" },
              ].map((b) => (
                <div key={b.l}>
                  <div className="mb-1.5 flex justify-between text-xs text-muted">
                    <span>{b.l}</span>
                    <span className="font-mono-ui">{b.w}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,.06)" }}>
                    <div className="bar-fill h-full rounded-full" style={{ width: inView ? `${b.w}%` : "0%", background: b.c }} />
                  </div>
                </div>
              ))}
              <p className="font-mono-ui m-0 text-xs text-muted">Relative Gemini call volume (~40% reduction)</p>
            </div>
          </button>
        </Reveal>

        {rest.map((m, i) => (
          <Reveal key={m.id} delay={(i + 1) * 80} className={spans[i]}>
            <button {...tilt(9)} onClick={() => openWork(m.work)} className="tilt glass tap flex h-full w-full flex-col rounded-3xl p-4 text-left sm:p-6">
              <IconBox icon={m.icon} size={17} className="h-9 w-9 rounded-xl" />
              <p className="font-display h-metric-sm mt-5 font-bold">
                <CountUp start={inView} to={m.to} prefix={m.prefix} suffix={m.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium">{m.label}</p>
              <p className="mt-1 hidden text-sm leading-relaxed text-muted sm:block">{m.detail}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs text-muted">
                View source <ArrowUpRight size={13} />
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Work ───────────────────────── */

function WorkCard({ w, onOpen, activeSkill, big }) {
  const match = activeSkill ? w.tags.includes(activeSkill) : null;
  return (
    <button
      {...tilt(big ? 4 : 7)}
      onClick={() => onOpen(w.id)}
      className={`tilt glass tap group flex h-full w-full flex-col overflow-hidden rounded-3xl p-6 text-left sm:p-7 ${match === false ? "opacity-40" : ""} ${match ? "ring-accent" : ""}`}
    >
      {big && <div aria-hidden className="glow-accent pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 opacity-50" />}
      <div className="relative flex flex-wrap items-center justify-between gap-2">
        <span className="chip rounded-full px-3 py-1 text-xs text-muted">{w.type}</span>
        <span className="font-mono-ui text-xs text-muted">{w.period}</span>
      </div>
      {match && (
        <span className="bg-accent relative mt-3 inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-semibold">
          <Check size={12} /> Uses {activeSkill}
        </span>
      )}
      <IconBox icon={w.icon} size={22} className="relative mt-5 h-12 w-12 rounded-2xl" />
      <h3 className="font-display h-card relative mt-5 font-bold">{w.title}</h3>
      <p className="relative mt-1 text-sm text-muted">{w.org}</p>
      <p className="relative mt-3 leading-relaxed text-muted">{w.summary}</p>

      {big && w.roles && (
        <div className="relative mt-5">
          <p className="font-mono-ui text-xs uppercase tracking-widest text-muted">Serves</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {w.roles.map((r) => (
              <span key={r} className="chip rounded-full px-2.5 py-1 text-xs">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="relative mt-6 flex flex-wrap gap-x-6 gap-y-3">
        {w.impact.map((m) => (
          <div key={m.v}>
            <p className="font-display text-gradient m-0 text-2xl font-bold">{m.k}</p>
            <p className="m-0 text-xs text-muted">{m.v}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-auto flex flex-wrap gap-1.5 pt-6">
        {w.stack.map((s) => (
          <span key={s} className="chip font-mono-ui rounded-md px-2 py-1 text-xs text-muted">
            {s}
          </span>
        ))}
      </div>
      <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        Open breakdown <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

function WorkSection({ openWork, activeSkill, clearSkill }) {
  const FILTERS = ["All", "Experience", "Project", "IoT", "AI / LLM", "Serverless"];
  const [filter, setFilter] = useState("All");
  const list = WORK.filter((w) => filter === "All" || w.categories.includes(filter));
  const spanFor = (id) => {
    if (filter !== "All") return "lg:col-span-6";
    return { water: "md:col-span-2 lg:col-span-7 lg:row-span-2", prompt: "lg:col-span-5", bookstore: "lg:col-span-5" }[id];
  };
  return (
    <section id="work" className="scroll-mt-28 pt-20 sm:pt-28">
      <SectionHeader
        index="02"
        eyebrow="Work"
        title={
          <>
            Selected work, <span className="text-gradient">unpacked.</span>
          </>
        }
        sub="Tap any card for the problem, what I built, and the measurable impact."
      />
      <Reveal className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {FILTERS.map((f) => {
          const n = f === "All" ? WORK.length : WORK.filter((w) => w.categories.includes(f)).length;
          const on = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={on}
              className={`tap inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${on ? "bg-accent border-transparent font-semibold" : "chip text-muted hover:text-white"}`}
            >
              {f} <span className="font-mono-ui text-xs opacity-70">{n}</span>
            </button>
          );
        })}
      </Reveal>
      {activeSkill && (
        <div className="pop-in tint-soft mb-4 flex items-center justify-between gap-3 rounded-2xl border px-4 py-2">
          <p className="m-0 text-sm">
            <Filter size={14} className="mr-2 inline text-accent" />
            Highlighting work that uses <span className="font-semibold text-accent">{activeSkill}</span>
          </p>
          <button onClick={clearSkill} aria-label="Clear highlight" className="tap flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}
      <div data-scroll className="scroll-3d grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-12">
        {list.map((w, i) => (
          <Reveal key={`${filter}-${w.id}`} delay={i * 90} className={spanFor(w.id)}>
            <WorkCard w={w} onOpen={openWork} activeSkill={activeSkill} big={filter === "All" && w.id === "water"} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Skills ───────────────────────── */

function SkillGlobe({ activeSkill, onPick }) {
  const wrapRef = useRef(null);
  const itemRefs = useRef([]);
  const st = useRef({ rx: -0.35, ry: 0, vx: 0, vy: 0.004, dragging: false, lastX: 0, lastY: 0, R: 120, target: null, visible: true });
  const points = useMemo(() => {
    const n = ALL_SKILLS.length;
    const g = Math.PI * (3 - Math.sqrt(5));
    return ALL_SKILLS.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      return [Math.cos(g * i) * r, y, Math.sin(g * i) * r];
    });
  }, []);

  // Rotate the chosen skill to the front
  useEffect(() => {
    const s = st.current;
    const i = activeSkill ? ALL_SKILLS.indexOf(activeSkill) : -1;
    if (i < 0) {
      s.target = null;
      return;
    }
    const [x, y, z] = points[i];
    const TAU = Math.PI * 2;
    let ry = Math.atan2(-x, z);
    let rx = Math.atan2(y, Math.sqrt(x * x + z * z));
    ry += Math.round((s.ry - ry) / TAU) * TAU;
    rx += Math.round((s.rx - rx) / TAU) * TAU;
    s.target = { rx, ry };
  }, [activeSkill, points]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const s = st.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const measure = () => {
      const r = wrap.getBoundingClientRect();
      s.R = Math.min(r.width, r.height) * 0.38;
    };
    measure();
    window.addEventListener("resize", measure);
    let io;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([e]) => {
        s.visible = e.isIntersecting;
      });
      io.observe(wrap);
    }
    const up = () => {
      s.dragging = false;
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!s.visible || document.hidden) return;
      if (s.target && !s.dragging) {
        s.rx += (s.target.rx - s.rx) * 0.08;
        s.ry += (s.target.ry - s.ry) * 0.08;
      } else if (!s.dragging) {
        s.ry += reduce ? 0 : s.vy;
        s.rx += s.vx;
        s.vx *= 0.95;
        s.vy += ((reduce ? 0 : 0.004) - s.vy) * 0.02;
      }
      const cx = Math.cos(s.rx), sx = Math.sin(s.rx), cy = Math.cos(s.ry), sy = Math.sin(s.ry);
      for (let i = 0; i < points.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const [x, y, z] = points[i];
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const sc = 0.6 + (z2 + 1) * 0.3;
        el.style.transform = `translate(-50%,-50%) translate3d(${(x1 * s.R).toFixed(1)}px, ${(-y2 * s.R).toFixed(1)}px, 0) scale(${sc.toFixed(3)})`;
        el.style.opacity = (0.22 + (z2 + 1) * 0.39).toFixed(3);
        el.style.zIndex = String(Math.round((z2 + 1) * 100));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      if (io) io.disconnect();
    };
  }, [points]);

  const onDown = (e) => {
    const s = st.current;
    s.dragging = true;
    s.target = null;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
  };
  const onMove = (e) => {
    const s = st.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.ry += dx * 0.008;
    s.rx += dy * 0.008;
    s.vy = dx * 0.0008;
    s.vx = dy * 0.0008;
  };

  return (
    <div ref={wrapRef} onPointerDown={onDown} onPointerMove={onMove} className="globe relative select-none" style={{ touchAction: "pan-y" }}>
      <div aria-hidden className="globe-core" />
      {ALL_SKILLS.map((s, i) => {
        const on = activeSkill === s;
        return (
          <button
            key={s}
            ref={(el) => (itemRefs.current[i] = el)}
            onClick={() => onPick(s)}
            aria-pressed={on}
            className="globe-item tap absolute left-1/2 top-1/2 flex h-11 items-center px-1"
          >
            <span className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${on ? "bg-accent border-transparent" : "chip"}`} style={on ? undefined : { background: "rgba(8,10,20,.7)" }}>
              {s}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MatchList({ skill, openWork, onShowInWork, onClear }) {
  const matches = WORK.filter((w) => w.tags.includes(skill));
  return (
    <div className="pop-in tint-soft mt-4 rounded-2xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="m-0 text-sm">
          <span className="font-semibold text-accent">{skill}</span>
          <span className="text-muted"> · {matches.length ? `used in ${matches.length} ${matches.length === 1 ? "build" : "builds"}` : "toolkit"}</span>
        </p>
        <button onClick={onClear} aria-label="Clear skill" className="tap -mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:text-white">
          <X size={16} />
        </button>
      </div>
      {matches.length ? (
        <div className="mt-1 flex flex-col gap-1">
          {matches.map((w) => {
            const I = w.icon;
            return (
              <button key={w.id} onClick={() => openWork(w.id)} className="tap flex h-14 items-center gap-3 rounded-xl px-2 text-left hover:bg-white/5">
                <I size={18} className="shrink-0 text-accent" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{w.title}</span>
                  <span className="block truncate text-xs text-muted">
                    {w.type} · {w.period}
                  </span>
                </span>
                <ArrowUpRight size={16} className="shrink-0 text-muted" />
              </button>
            );
          })}
          <button onClick={onShowInWork} className="tap inline-flex h-11 items-center gap-1.5 self-start px-2 text-sm text-accent">
            Highlight in Work <ArrowRight size={15} />
          </button>
        </div>
      ) : (
        <p className="m-0 mt-1 text-sm leading-relaxed text-muted">Listed in my toolkit; not tied to a specific project on my resume.</p>
      )}
    </div>
  );
}

function SkillsSection({ activeSkill, setActiveSkill, openWork, scrollTo }) {
  const toggle = (s) => setActiveSkill((cur) => (cur === s ? null : s));
  const clear = () => setActiveSkill(null);
  const showInWork = () => scrollTo("work");
  const spans = { lang: "lg:col-span-3", backend: "lg:col-span-5", data: "lg:col-span-4", ai: "lg:col-span-4", cloud: "lg:col-span-5", tools: "lg:col-span-3" };
  const GlobeHead = () => (
    <div className="flex items-center justify-between gap-2">
      <p className="font-mono-ui m-0 text-xs uppercase tracking-widest text-muted">Skill globe</p>
      <span className="text-xs text-muted">Drag to spin · tap to trace</span>
    </div>
  );
  return (
    <section id="skills" className="scroll-mt-28 pt-20 sm:pt-28">
      <SectionHeader
        index="03"
        eyebrow="Toolkit"
        title={
          <>
            Skills, wired to <span className="text-gradient">real work.</span>
          </>
        }
        sub="Spin the globe or tap any skill to trace it to the work where I used it."
      />
      <div data-scroll className="scroll-3d grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-12">
        {/* Globe card — phones & tablets */}
        <Reveal className="glass rounded-3xl p-5 sm:p-6 md:col-span-2 lg:hidden">
          <GlobeHead />
          <SkillGlobe activeSkill={activeSkill} onPick={toggle} />
          {activeSkill && <MatchList skill={activeSkill} openWork={openWork} onShowInWork={showInWork} onClear={clear} />}
        </Reveal>

        {SKILL_GROUPS.map((g, i) => (
          <Reveal key={g.id} delay={i * 60} className={spans[g.id]}>
            <div {...tilt(3)} className="tilt glass h-full rounded-3xl p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <IconBox icon={g.icon} size={18} className="h-10 w-10 rounded-xl" />
                <h3 className="font-display m-0 text-lg font-semibold">{g.title}</h3>
                <span className="font-mono-ui ml-auto text-xs text-muted">{String(g.skills.length).padStart(2, "0")}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.skills.map((s) => {
                  const on = activeSkill === s;
                  const n = USAGE[s];
                  return (
                    <button
                      key={s}
                      onClick={() => toggle(s)}
                      aria-pressed={on}
                      className={`tap inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${on ? "bg-accent border-transparent font-semibold" : "chip hover:bg-white/10"}`}
                    >
                      {s}
                      {n > 0 && (
                        <span className={`font-mono-ui flex h-5 w-5 items-center justify-center rounded-full text-xs ${on ? "" : "tint"}`} style={on ? { background: "rgba(5,6,13,.18)" } : undefined}>
                          {n}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {g.skills.includes(activeSkill) && (
                <div className="lg:hidden">
                  <MatchList skill={activeSkill} openWork={openWork} onShowInWork={showInWork} onClear={clear} />
                </div>
              )}
            </div>
          </Reveal>
        ))}

        {/* Sticky globe panel — desktop */}
        <div className="hidden lg:col-span-4 lg:col-start-9 lg:row-span-3 lg:row-start-1 lg:block">
          <div className="glass sticky top-28 rounded-3xl p-6">
            <GlobeHead />
            <SkillGlobe activeSkill={activeSkill} onPick={toggle} />
            {activeSkill ? (
              <MatchList skill={activeSkill} openWork={openWork} onShowInWork={showInWork} onClear={clear} />
            ) : (
              <p className="m-0 mt-2 text-sm leading-relaxed text-muted">Pick any skill — it spins to the front, and matching cards in Work light up.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Journey ───────────────────────── */

function Journey({ openWork }) {
  const [ref, inView] = useInView(0.2);
  const items = [
    { when: "2021 – 2025", icon: GraduationCap, title: "Bachelor of Technology in Computer Science", place: "Institute of Aeronautical Engineering, Hyderabad" },
    { when: "Sep 2025 – Present", icon: Briefcase, title: "Junior Software Developer", place: "Arminta Solutions · Hyderabad", links: ["water", "prompt"], current: true },
    { when: "Project", icon: Cloud, title: "Serverless E-Commerce Bookstore on AWS", place: "Lambda · API Gateway · DynamoDB · S3 · Cognito", links: ["bookstore"] },
  ];
  const glance = [
    ["Experience", "1+ year"],
    ["Core stacks", "Node.js · Python"],
    ["Based in", "Hyderabad"],
    ["Degree", "B.Tech, CS"],
  ];
  return (
    <section id="journey" className="scroll-mt-28 pt-4 sm:pt-8">
      <SectionHeader
        index="04"
        eyebrow="Journey"
        title={
          <>
            From classroom <span className="text-gradient">to production.</span>
          </>
        }
      />
      <div data-scroll className="scroll-3d grid grid-cols-1 gap-4 lg:grid-cols-12">
        <ol ref={ref} className="relative m-0 list-none p-0 lg:col-span-8">
          <span aria-hidden className="absolute bottom-6 left-5 top-6 w-px" style={{ background: "var(--line)" }} />
          <span aria-hidden className="line-fill absolute bottom-6 left-5 top-6 w-px" style={{ transform: `scaleY(${inView ? 1 : 0})` }} />
          {items.map((it, i) => {
            const I = it.icon;
            return (
              <Reveal as="li" key={it.title} delay={i * 140} className="relative pb-4 pl-14 last:pb-0">
                <span
                  className="glass-strong absolute left-0 top-5 flex h-10 w-10 items-center justify-center rounded-full"
                  style={it.current ? { borderColor: "var(--accent)", color: "var(--accent)", boxShadow: "0 0 24px color-mix(in srgb, var(--accent) 45%, transparent)" } : undefined}
                >
                  <I size={17} />
                </span>
                <div {...tilt(4)} className="tilt glass rounded-3xl p-5 sm:p-6">
                  <p className="font-mono-ui m-0 text-xs text-accent">{it.when}</p>
                  <h3 className="font-display m-0 mt-2 text-xl font-bold sm:text-2xl">{it.title}</h3>
                  <p className="m-0 mt-1 text-sm text-muted">{it.place}</p>
                  {it.links && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {it.links.map((id) => (
                        <button key={id} onClick={() => openWork(id)} className="tap chip inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm hover:bg-white/10">
                          {WORK_BY_ID[id].short} <ArrowUpRight size={14} className="text-accent" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </ol>
        <Reveal delay={120} className="lg:col-span-4">
          <div className="glass sticky top-28 rounded-3xl p-6">
            <p className="font-mono-ui m-0 text-xs uppercase tracking-widest text-muted">At a glance</p>
            <dl className="m-0 mt-4">
              {glance.map(([k, v], i) => (
                <div key={k} className={`flex items-center justify-between gap-4 py-3 ${i ? "border-t hairline" : ""}`}>
                  <dt className="text-sm text-muted">{k}</dt>
                  <dd className="font-display m-0 text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Contact ───────────────────────── */

function Contact({ copyEmail, openResume, scrollTo }) {
  const year = new Date().getFullYear();
  const side = [
    { href: PROFILE.linkedin, external: true, icon: LinkedinIcon, label: "LinkedIn", value: PROFILE.linkedinLabel },
    { href: PROFILE.phoneHref, icon: Phone, label: "Phone", value: PROFILE.phone },
  ];
  return (
    <section id="contact" className="scroll-mt-28 pt-20 sm:pt-28">
      <div data-scroll className="scroll-3d grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
        <Reveal className="glass relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:col-span-8 lg:row-span-3">
          <div aria-hidden className="glow-accent pointer-events-none absolute -left-24 -top-24 h-96 w-96 opacity-60" />
          <p className="font-mono-ui relative m-0 inline-flex items-center gap-3 text-xs uppercase tracking-widest text-accent">
            <span className="h-px w-8" style={{ background: "var(--accent)" }} />
            05 — Contact
          </p>
          <h2 className="font-display h-section relative mt-4 max-w-2xl font-bold">
            Let's talk APIs, IoT, or <span className="text-gradient">applied AI.</span>
          </h2>
          <p className="lead relative mt-4 max-w-lg text-muted">The fastest way to reach me is email — one tap copies it.</p>
          <p className="font-display relative mt-8 break-all font-semibold" style={{ fontSize: "clamp(1.15rem, 2.2vw + .6rem, 2.1rem)" }}>
            {PROFILE.email}
          </p>
          <div className="relative mt-6 flex flex-wrap gap-3">
            <button {...magnet} onClick={copyEmail} className="magnet btn-shine tap bg-accent inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold">
              <Copy size={16} /> Copy email
            </button>
            <a
              {...magnet}
              href={`mailto:${PROFILE.email}`}
              className="magnet tap chip inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm no-underline hover:bg-white/10"
              style={{ color: "var(--text)" }}
            >
              <Mail size={16} /> Write an email
            </a>
          </div>
        </Reveal>
        {side.map((s, i) => (
          <Reveal key={s.label} delay={(i + 1) * 90} className="lg:col-span-4">
            <a
              {...tilt(8)}
              href={s.href}
              {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="tilt glass tap flex h-full items-center gap-4 rounded-3xl p-5 no-underline"
              style={{ color: "var(--text)" }}
            >
              <IconBox icon={s.icon} size={19} />
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-muted">{s.label}</span>
                <span className="block truncate font-medium">{s.value}</span>
              </span>
              <ArrowUpRight size={18} className="shrink-0 text-muted" />
            </a>
          </Reveal>
        ))}
        <Reveal delay={270} className="lg:col-span-4">
          <button {...tilt(8)} onClick={openResume} className="tilt glass tap flex h-full w-full items-center gap-4 rounded-3xl p-5 text-left">
            <IconBox icon={FileText} size={19} />
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-muted">Resume</span>
              <span className="block font-medium">View & print</span>
            </span>
            <Printer size={18} className="shrink-0 text-muted" />
          </button>
        </Reveal>
      </div>
      <footer className="mt-12 flex flex-col items-start justify-between gap-3 border-t hairline pt-6 text-sm text-muted sm:flex-row sm:items-center">
        <p className="m-0">
          © {year} {PROFILE.name} · Built with React, Tailwind & Three.js
        </p>
        <button onClick={() => scrollTo("home")} className="tap inline-flex h-11 items-center gap-1.5 hover:text-white">
          Back to top <ArrowUpRight size={15} />
        </button>
      </footer>
    </section>
  );
}

/* ───────────────────────── Overlays ───────────────────────── */

function Block({ label, children }) {
  return (
    <div className="mb-8 last:mb-2">
      <p className="font-mono-ui mb-3 text-xs uppercase tracking-widest text-accent">{label}</p>
      {children}
    </div>
  );
}

function WorkDrawer({ id, shown, onClose, onNav, onSkill }) {
  const w = id ? WORK_BY_ID[id] : null;
  const [dragY, setDragY] = useState(0);
  const startY = useRef(null);
  const scrollRef = useRef(null);
  useEffect(() => {
    setDragY(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [id]);
  if (!w) return null;

  const idx = WORK.findIndex((x) => x.id === w.id);
  const prev = WORK[(idx - 1 + WORK.length) % WORK.length];
  const next = WORK[(idx + 1) % WORK.length];
  const onTouchStart = (e) => {
    if (window.innerWidth < 768) startY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    if (startY.current == null) return;
    setDragY(Math.max(0, e.touches[0].clientY - startY.current));
  };
  const onTouchEnd = () => {
    if (dragY > 90) onClose();
    setDragY(0);
    startY.current = null;
  };

  return (
    <div className="fixed inset-0" style={{ zIndex: 55 }} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div className={`absolute inset-0 transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"}`} style={{ background: "rgba(2,3,8,.66)" }} onClick={onClose} />
      <aside
        className={`glass-strong sheet-h absolute inset-x-0 bottom-0 flex transform flex-col overflow-hidden rounded-t-3xl transition-transform duration-300 ease-out md:inset-x-auto md:right-0 md:top-0 md:h-full md:w-full md:max-w-xl md:rounded-none md:rounded-l-3xl ${
          shown ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full md:translate-y-0"
        }`}
        style={dragY ? { transform: `translateY(${dragY}px)`, transition: "none" } : undefined}
      >
        <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} className="shrink-0 border-b hairline px-5 pb-4 pt-3 sm:px-7 md:pt-6">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20 md:hidden" />
          <div className="flex items-start gap-3">
            <IconBox icon={w.icon} size={22} className="mt-1 hidden h-12 w-12 rounded-2xl sm:flex" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="chip rounded-full px-2.5 py-1 text-muted">{w.type}</span>
                <span className="font-mono-ui text-muted">{w.period}</span>
              </div>
              <h3 id="drawer-title" className="font-display m-0 mt-2 text-2xl font-bold leading-tight sm:text-3xl">
                {w.title}
              </h3>
              <p className="m-0 mt-1 text-sm text-muted">{w.org}</p>
            </div>
            <button onClick={onClose} aria-label="Close details" className="tap chip flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/10">
              <X size={18} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
          <Block label="The challenge">
            <p className="lead m-0">{w.problem}</p>
          </Block>
          <Block label={w.flowLabel}>
            <div className="flex flex-wrap items-center gap-1.5">
              {w.flow.map((f, i) => (
                <React.Fragment key={f}>
                  <span className="chip font-mono-ui rounded-lg px-2.5 py-1.5 text-xs">{f}</span>
                  {i < w.flow.length - 1 && <ChevronRight size={14} className="text-accent" />}
                </React.Fragment>
              ))}
            </div>
          </Block>
          <Block label="What I did">
            <ol className="m-0 list-none space-y-4 p-0">
              {w.bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono-ui mt-0.5 shrink-0 text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <p className="m-0 text-sm leading-relaxed text-muted">{b}</p>
                </li>
              ))}
            </ol>
          </Block>
          <Block label="Impact">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {w.impact.map((m) => (
                <div key={m.v} className="tint-soft rounded-2xl border p-4">
                  <p className="font-display text-gradient m-0 text-2xl font-bold">{m.k}</p>
                  <p className="m-0 mt-1 text-xs text-muted">{m.v}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block label="Stack — tap to explore">
            <div className="flex flex-wrap gap-2">
              {w.tags.map((t) => (
                <button key={t} onClick={() => onSkill(t)} className="tap chip inline-flex h-11 items-center rounded-full px-4 text-sm hover:bg-white/10">
                  {t}
                </button>
              ))}
            </div>
          </Block>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-t hairline px-3 pt-2 sm:px-5" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
          <button onClick={() => onNav(prev.id)} className="tap inline-flex h-11 min-w-0 items-center gap-1 rounded-xl px-3 text-sm text-muted hover:text-white">
            <ChevronLeft size={16} className="shrink-0" /> <span className="truncate">{prev.short}</span>
          </button>
          <button onClick={() => onNav(next.id)} className="tap inline-flex h-11 min-w-0 items-center gap-1 rounded-xl px-3 text-sm text-muted hover:text-white">
            <span className="truncate">{next.short}</span> <ChevronRight size={16} className="shrink-0" />
          </button>
        </div>
      </aside>
    </div>
  );
}

function CommandPalette({ open, onClose, commands, isMac }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 40);
      return () => clearTimeout(t);
    }
  }, [open]);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter((c) => `${c.label} ${c.keywords || ""} ${c.group}`.toLowerCase().includes(s));
  }, [q, commands]);
  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    const el = listRef.current && listRef.current.querySelector(`[data-idx="${sel}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [sel]);
  if (!open) return null;

  const run = (c) => {
    onClose();
    setTimeout(() => c.action(), 60);
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[sel]) run(results[sel]);
    }
  };
  let lastGroup = null;

  return (
    <div className="fade-in fixed inset-0" style={{ zIndex: 60 }} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0" style={{ background: "rgba(2,3,8,.62)" }} onClick={onClose} />
      <div className="pop-in relative mx-auto mt-16 max-w-xl px-3 sm:mt-24">
        <div className="glass-strong overflow-hidden rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 border-b hairline pl-4 pr-1">
            <Search size={18} className="shrink-0 text-muted" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Jump to a section, project, or skill…"
              aria-label="Search commands"
              className="h-14 w-full bg-transparent text-base placeholder-gray-500"
              style={{ outline: "none", color: "var(--text)" }}
            />
            <button onClick={onClose} aria-label="Close" className="tap flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted hover:text-white">
              <X size={18} />
            </button>
          </div>
          <ul ref={listRef} className="m-0 max-h-80 list-none overflow-y-auto overscroll-contain p-2" role="listbox">
            {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">No matches for “{q}”.</li>}
            {results.map((c, i) => {
              const header = c.group !== lastGroup;
              lastGroup = c.group;
              const I = c.icon;
              const on = i === sel;
              return (
                <React.Fragment key={c.id}>
                  {header && (
                    <li role="presentation" className="font-mono-ui px-3 pb-1 pt-3 text-xs uppercase tracking-widest text-muted">
                      {c.group}
                    </li>
                  )}
                  <li role="option" aria-selected={on}>
                    <button
                      data-idx={i}
                      onMouseEnter={() => setSel(i)}
                      onClick={() => run(c)}
                      className={`tap flex h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm ${on ? "bg-white/10" : ""}`}
                    >
                      <I size={17} className={`shrink-0 ${on ? "text-accent" : "text-muted"}`} />
                      <span className="flex-1 truncate">{c.label}</span>
                      {c.hint && <span className="shrink-0 text-xs text-muted">{c.hint}</span>}
                      {on && <CornerDownLeft size={14} className="hidden shrink-0 text-muted sm:block" />}
                    </button>
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
          <div className="hidden items-center justify-between border-t hairline px-4 py-2.5 text-xs text-muted sm:flex">
            <span>↑↓ navigate · ↵ select · esc close</span>
            <span className="font-mono-ui">{isMac ? "⌘" : "Ctrl"} K</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResumeModal({ onClose, copyEmail }) {
  const closeIfSelf = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  const H = ({ children }) => <h2 className="mb-2 mt-6 border-b border-neutral-300 pb-1 text-xs font-bold uppercase tracking-widest text-neutral-700">{children}</h2>;
  return (
    <div className="resume-shell fade-in fixed inset-0 overflow-y-auto" style={{ zIndex: 60, background: "rgba(2,3,8,.82)" }} role="dialog" aria-modal="true" aria-label="Resume" onClick={closeIfSelf}>
      <div className="mx-auto max-w-3xl px-3 py-4 sm:px-6 sm:py-10" onClick={closeIfSelf}>
        <div className="resume-chrome glass-strong sticky top-2 flex items-center gap-2 rounded-2xl p-1.5 pl-4" style={{ zIndex: 1 }}>
          <p className="font-display m-0 flex-1 font-semibold">Resume</p>
          <button onClick={() => window.print()} className="tap bg-accent inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold">
            <Printer size={16} /> <span className="hidden sm:inline">Print / Save PDF</span>
          </button>
          <button onClick={copyEmail} aria-label="Copy email" className="tap chip flex h-11 w-11 items-center justify-center rounded-xl hover:bg-white/10">
            <Copy size={16} />
          </button>
          <button onClick={onClose} aria-label="Close resume" className="tap chip flex h-11 w-11 items-center justify-center rounded-xl hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <article id="resume-print" className="pop-in mt-3 rounded-2xl bg-white p-6 text-neutral-900 shadow-2xl sm:p-10" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
          <h1 className="font-display m-0 text-3xl font-extrabold tracking-tight sm:text-4xl">{PROFILE.name.toUpperCase()}</h1>
          <p className="m-0 mt-2 text-sm text-neutral-600">
            <a href={PROFILE.phoneHref} className="text-neutral-700">{PROFILE.phone}</a> •{" "}
            <a href={`mailto:${PROFILE.email}`} className="text-neutral-700">{PROFILE.email}</a> •{" "}
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="text-neutral-700">{PROFILE.linkedinLabel}</a>
          </p>
          <H>Professional Summary</H>
          <p className="m-0 text-sm leading-relaxed">{PROFILE.summary}</p>
          <H>Skills</H>
          <ul className="m-0 list-none space-y-1 p-0 text-sm">
            {RESUME_SKILLS.map(([k, v]) => (
              <li key={k}>
                <span className="font-semibold">{k}:</span> {v}
              </li>
            ))}
          </ul>
          <H>Experience</H>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <p className="m-0 font-bold">Junior Software Developer</p>
            <p className="m-0 text-sm text-neutral-600">Sep 2025 – Present</p>
          </div>
          <p className="m-0 text-sm text-neutral-600">Arminta Solutions Private Limited | Hyderabad</p>
          {["water", "prompt"].map((id) => {
            const w = WORK_BY_ID[id];
            return (
              <div key={id} className="mt-3">
                <p className="m-0 text-sm font-semibold">
                  {w.title} <span className="font-normal text-neutral-600">({id === "water" ? "Node.js, Fastify, MongoDB, Mongoose, MQTT" : "Python, FastAPI, Redis, PostgreSQL, Gemini"})</span>
                </p>
                <ul className="m-0 mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                  {w.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            );
          })}
          <H>Projects</H>
          <p className="m-0 text-sm font-semibold">
            Serverless E-Commerce Bookstore on AWS <span className="font-normal text-neutral-600">| Lambda, API Gateway, DynamoDB, S3, Cognito</span>
          </p>
          <ul className="m-0 mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
            {WORK_BY_ID.bookstore.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <H>Education</H>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <p className="m-0 text-sm font-semibold">Bachelor of Technology in Computer Science</p>
            <p className="m-0 text-sm text-neutral-600">2021 – 2025</p>
          </div>
          <p className="m-0 text-sm text-neutral-600">Institute of Aeronautical Engineering, Hyderabad</p>
        </article>
      </div>
    </div>
  );
}

/* ───────────────────────── App ───────────────────────── */

export default function Portfolio() {
  const [active, setActive] = useState("home");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [drawerId, setDrawerId] = useState(null);
  const [drawerShown, setDrawerShown] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const closeTimer = useRef(null);
  const sectionIdx = useRef(0);
  const progressRef = useRef(null);

  const isMac = useMemo(() => typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent), []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const copyEmail = useCallback(async () => {
    const ok = await copyText(PROFILE.email);
    showToast(ok ? "Email copied to clipboard" : `Couldn't copy — ${PROFILE.email}`);
  }, [showToast]);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openWork = useCallback((id) => {
    clearTimeout(closeTimer.current);
    setDrawerId(id);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerShown(true)));
  }, []);

  const closeWork = useCallback(() => {
    setDrawerShown(false);
    closeTimer.current = setTimeout(() => setDrawerId(null), 320);
  }, []);

  const pickSkillFromDrawer = useCallback(
    (s) => {
      setActiveSkill(s);
      closeWork();
      setTimeout(() => scrollTo("skills"), 360);
    },
    [closeWork, scrollTo]
  );

  // Section colour theme + 3D shape follow the active section
  useEffect(() => {
    const th = THEMES[active] || THEMES.home;
    const root = document.documentElement;
    root.style.setProperty("--accent", th.a);
    root.style.setProperty("--accent-2", th.b);
    sectionIdx.current = Math.max(0, SECTION_IDS.indexOf(active));
  }, [active]);

  // Scroll-driven 3D variables
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const prog = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${prog.toFixed(4)})`;
      if (reduce) return;
      document.querySelectorAll("[data-scroll]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const pin = Math.min(1, Math.max(0, (r.top - vh * 0.3) / (vh * 0.7)));
        const py = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.setProperty("--pin", pin.toFixed(3));
        el.style.setProperty("--py", Math.max(-1.5, Math.min(1.5, py)).toFixed(3));
      });
      const hero = document.getElementById("hero-stage");
      if (hero) {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty("--h", Math.min(1, Math.max(0, 1 - r.bottom / vh)).toFixed(3));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Keyboard: Cmd/Ctrl+K and Escape
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      } else if (e.key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        else if (drawerId) closeWork();
        else if (resumeOpen) setResumeOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, drawerId, resumeOpen, closeWork]);

  // Scroll lock while overlays are open
  useEffect(() => {
    const locked = paletteOpen || resumeOpen || !!drawerId;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [paletteOpen, resumeOpen, drawerId]);

  // Active section tracking
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const commands = useMemo(
    () => [
      ...NAV.map((n) => ({ id: `nav-${n.id}`, group: "Navigate", label: `Go to ${n.label}`, icon: n.icon, action: () => scrollTo(n.id) })),
      ...WORK.map((w) => ({ id: `work-${w.id}`, group: "Work", label: w.title, hint: w.type, icon: w.icon, keywords: w.tags.join(" "), action: () => openWork(w.id) })),
      { id: "copy", group: "Actions", label: "Copy email address", icon: Copy, keywords: "mail contact", action: copyEmail },
      { id: "mail", group: "Actions", label: "Write an email", icon: Mail, keywords: "contact", action: () => { window.location.href = `mailto:${PROFILE.email}`; } },
      { id: "resume", group: "Actions", label: "View resume", icon: FileText, keywords: "cv print pdf", action: () => setResumeOpen(true) },
      { id: "li", group: "Actions", label: "Open LinkedIn", icon: LinkedinIcon, keywords: "social profile", action: () => window.open(PROFILE.linkedin, "_blank", "noopener,noreferrer") },
      { id: "call", group: "Actions", label: `Call ${PROFILE.phone}`, icon: Phone, keywords: "phone", action: () => { window.location.href = PROFILE.phoneHref; } },
      ...ALL_SKILLS.map((s) => ({
        id: `skill-${s}`,
        group: "Skills",
        label: `Trace skill: ${s}`,
        icon: Layers,
        hint: USAGE[s] ? `${USAGE[s]} build${USAGE[s] > 1 ? "s" : ""}` : undefined,
        action: () => {
          setActiveSkill(s);
          scrollTo("skills");
        },
      })),
    ],
    [scrollTo, openWork, copyEmail]
  );

  const MOBILE_NAV = [
    { id: "home", label: "Home", icon: Home },
    { id: "work", label: "Work", icon: Briefcase },
    { id: "search", label: "Search", icon: Search },
    { id: "skills", label: "Skills", icon: Layers },
    { id: "contact", label: "Contact", icon: Mail },
  ];
  const activeIdx = Math.max(0, SECTION_IDS.indexOf(active));

  return (
    <div className="app-root min-h-screen">
      <style>{CSS}</style>

      <div className="screen-only">
        {/* Background layers */}
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <div className="bg-grid absolute inset-x-0 top-0 h-screen" />
          <div className="absolute" style={{ width: "70rem", height: "70rem", left: "50%", top: "-38rem", transform: "translateX(-50%)", background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 12%, transparent), transparent)" }} />
          <div className="absolute" style={{ width: "55rem", height: "55rem", right: "-28rem", bottom: "-28rem", background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent-2) 10%, transparent), transparent)" }} />
        </div>
        <Scene3D sectionRef={sectionIdx} />
        <CursorGlow />

        {/* Scroll progress */}
        <div aria-hidden className="fixed inset-x-0 top-0 h-0.5" style={{ zIndex: 45 }}>
          <div ref={progressRef} className="progress h-full w-full" style={{ transform: "scaleX(0)" }} />
        </div>

        {/* Desktop floating dock */}
        <nav aria-label="Primary" className="glass-strong fixed left-1/2 top-4 hidden -translate-x-1/2 transform items-center gap-1 rounded-full p-1.5 shadow-2xl md:flex" style={{ zIndex: 40 }}>
          <button onClick={() => scrollTo("home")} aria-label="Back to top" className="tap bg-accent font-display flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold">
            RP
          </button>
          {NAV.slice(1).map((n) => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.id)}
              aria-current={active === n.id ? "true" : undefined}
              className={`tap h-11 rounded-full px-3 text-sm transition-colors lg:px-4 ${active === n.id ? "tint font-medium" : "text-muted hover:text-white"}`}
            >
              {n.label}
            </button>
          ))}
          <span className="mx-1 h-6 w-px bg-white/10" />
          <button onClick={() => setPaletteOpen(true)} aria-label="Open command palette" className="tap inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm text-muted hover:text-white">
            <Search size={16} />
            <kbd className="chip font-mono-ui rounded-md px-1.5 py-0.5 text-xs">{isMac ? "⌘" : "Ctrl"} K</kbd>
          </button>
          <button {...magnet} onClick={() => setResumeOpen(true)} className="magnet btn-shine tap inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-black">
            <FileText size={16} /> Resume
          </button>
        </nav>

        {/* Section rail + HUD (large screens) */}
        <nav aria-label="Sections" className="rail fixed right-5 top-1/2 -translate-y-1/2 transform items-center" style={{ zIndex: 40 }}>
          {NAV.map((n) => (
            <button key={n.id} onClick={() => scrollTo(n.id)} aria-label={`Go to ${n.label}`} className="tap group relative flex h-11 w-11 items-center justify-center">
              <span className="rail-dot" data-on={active === n.id} />
              <span className="glass-strong pointer-events-none absolute right-12 whitespace-nowrap rounded-full px-2.5 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="hud font-mono-ui fixed bottom-6 left-6 text-xs text-muted" style={{ zIndex: 40 }}>
          {String(activeIdx + 1).padStart(2, "0")} / {String(NAV.length).padStart(2, "0")} · <span className="text-accent">{NAV[activeIdx].label}</span>
        </div>

        {/* Mobile top bar */}
        <header className="glass-strong fixed inset-x-0 top-0 flex items-center justify-between px-4 md:hidden" style={{ zIndex: 40, borderWidth: "0 0 1px 0", paddingTop: "env(safe-area-inset-top)" }}>
          <button onClick={() => scrollTo("home")} className="tap flex h-14 items-center gap-2.5">
            <span className="bg-accent font-display flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold">RP</span>
            <span className="font-display font-semibold">Rithvik P.</span>
          </button>
          <button onClick={() => setResumeOpen(true)} className="tap chip inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm">
            <FileText size={16} /> Resume
          </button>
        </header>

        {/* Mobile bottom bar */}
        <nav aria-label="Mobile" className="fixed inset-x-3 bottom-3 md:hidden" style={{ zIndex: 40, marginBottom: "env(safe-area-inset-bottom)" }}>
          <div className="glass-strong grid grid-cols-5 rounded-2xl p-1 shadow-2xl">
            {MOBILE_NAV.map((n) => {
              const I = n.icon;
              if (n.id === "search") {
                return (
                  <button key={n.id} onClick={() => setPaletteOpen(true)} aria-label="Open quick actions" className="tap flex h-14 items-center justify-center">
                    <span className="bg-accent flex h-11 w-11 items-center justify-center rounded-xl">
                      <Search size={19} />
                    </span>
                  </button>
                );
              }
              const on = active === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => scrollTo(n.id)}
                  aria-current={on ? "true" : undefined}
                  className={`tap flex h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs transition-colors ${on ? "tint" : "text-muted"}`}
                >
                  <I size={19} />
                  {n.label}
                </button>
              );
            })}
          </div>
        </nav>

        <main className="relative mx-auto max-w-7xl px-4 pb-32 pt-20 sm:px-6 md:pb-16 md:pt-28 lg:px-8" style={{ zIndex: 1 }}>
          <Hero openWork={openWork} openResume={() => setResumeOpen(true)} openPalette={() => setPaletteOpen(true)} copyEmail={copyEmail} scrollTo={scrollTo} isMac={isMac} />
          <ScrollBand words={["Node.js", "Fastify", "FastAPI", "MQTT", "MongoDB", "pgvector"]} />
          <Impact openWork={openWork} />
          <WorkSection openWork={openWork} activeSkill={activeSkill} clearSkill={() => setActiveSkill(null)} />
          <SkillsSection activeSkill={activeSkill} setActiveSkill={setActiveSkill} openWork={openWork} scrollTo={scrollTo} />
          <ScrollBand words={["Redis", "Gemini", "spaCy", "AWS Lambda", "DynamoDB", "Cognito"]} reverse />
          <Journey openWork={openWork} />
          <Contact copyEmail={copyEmail} openResume={() => setResumeOpen(true)} scrollTo={scrollTo} />
        </main>

        <WorkDrawer id={drawerId} shown={drawerShown} onClose={closeWork} onNav={(id) => setDrawerId(id)} onSkill={pickSkillFromDrawer} />
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} isMac={isMac} />

        <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 flex justify-center px-4 md:bottom-8" style={{ zIndex: 70 }}>
          {toast && (
            <div className="pop-in glass-strong inline-flex items-center gap-2.5 rounded-full px-4 py-3 text-sm shadow-2xl">
              <span className="bg-accent flex h-5 w-5 items-center justify-center rounded-full">
                <Check size={13} />
              </span>
              {toast}
            </div>
          )}
        </div>
      </div>

      {resumeOpen && <ResumeModal onClose={() => setResumeOpen(false)} copyEmail={copyEmail} />}
    </div>
  );
}