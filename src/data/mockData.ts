import {
  CohortTrack,
  LiveSessionState,
  ProjectSubmission,
  RubricCriterion,
  Student,
  CodeExercisePreset,
} from '../types/academy';

import academyLectureHallImg from '../assets/images/academy_lecture_hall_1792699923500.jpg';
import trackFullstackImg from '../assets/images/track_fullstack_web_1792699923781.jpg';
import trackFrontendImg from '../assets/images/track_frontend_craft_1792699924534.jpg';
import avatarInstructorImg from '../assets/images/avatar_lead_instructor_1792699924664.jpg';

export const ASSETS = {
  lectureHall: academyLectureHallImg,
  trackFullstack: trackFullstackImg,
  trackFrontend: trackFrontendImg,
  instructor: avatarInstructorImg,
};

export const INITIAL_EXERCISE_PRESETS: CodeExercisePreset[] = [
  {
    id: 'ex-streaming-state',
    title: 'Reactive State Stream with Web Component',
    summary: 'Demonstrating clean unidirectional data flow with batch updates and accessible DOM rendering.',
    codeHtml: `<div class="academy-card">
  <div class="card-header">
    <h3>Cohort Runtime Telemetry</h3>
    <span class="badge" id="syncStatus">LIVE STREAM</span>
  </div>
  <div class="metric-grid">
    <div class="metric">
      <div class="val" id="packetCount">0</div>
      <div class="label">Buffered Events</div>
    </div>
    <div class="metric">
      <div class="val" id="renderLatency">1.2ms</div>
      <div class="label">Render Delta</div>
    </div>
  </div>
  <div class="actions">
    <button id="dispatchBtn">Dispatch Webhook Pulse</button>
    <button id="clearBtn" class="secondary">Flush Buffer</button>
  </div>
  <ul id="eventLog" class="event-stream"></ul>
</div>`,
    codeCss: `* { box-sizing: border-box; }
body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #090d16;
  color: #f1f5f9;
  padding: 24px;
  display: flex;
  justify-content: center;
}
.academy-card {
  width: 100%;
  max-width: 480px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #1e293b;
  padding-bottom: 12px;
  margin-bottom: 16px;
}
h3 { margin: 0; font-size: 16px; font-weight: 600; }
.badge {
  font-size: 11px;
  font-family: monospace;
  color: #38bdf8;
  letter-spacing: 0.05em;
}
.metric-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}
.metric {
  background: #131c31;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #1e293b;
}
.val { font-size: 20px; font-weight: 700; font-family: monospace; color: #38bdf8; }
.label { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.actions { display: flex; gap: 8px; margin-bottom: 16px; }
button {
  background: #2563eb;
  color: #ffffff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
button:hover { background: #1d4ed8; }
button.secondary {
  background: #1e293b;
  color: #cbd5e1;
}
button.secondary:hover { background: #334155; }
.event-stream {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 140px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
  border-top: 1px solid #1e293b;
  padding-top: 8px;
}
.event-stream li {
  padding: 4px 0;
  color: #94a3b8;
  display: flex;
  justify-content: space-between;
}`,
    codeJs: `let count = 0;
const dispatchBtn = document.getElementById('dispatchBtn');
const clearBtn = document.getElementById('clearBtn');
const packetCount = document.getElementById('packetCount');
const log = document.getElementById('eventLog');

dispatchBtn.addEventListener('click', () => {
  count++;
  packetCount.textContent = count;
  const li = document.createElement('li');
  const now = new Date().toTimeString().split(' ')[0];
  li.innerHTML = '<span>[INCOMING_SYNC] Batch #' + count + '</span><span>' + now + '</span>';
  log.prepend(li);
});

clearBtn.addEventListener('click', () => {
  count = 0;
  packetCount.textContent = count;
  log.innerHTML = '';
});`,
  },
  {
    id: 'ex-async-abort',
    title: 'Resilient Fetch Controller & Abort Signal',
    summary: 'Preventing race conditions and orphaned requests during high-frequency user interactions.',
    codeHtml: `<div class="sandbox-container">
  <h2>Async Client Query Simulator</h2>
  <p class="desc">Trigger requests with simulated network jitter and test instant cancellation.</p>
  <div class="row">
    <button id="reqBtn">Dispatch Latent Query (1.8s)</button>
    <button id="abortBtn" class="danger">Abort Pending Signal</button>
  </div>
  <div id="statusBox" class="status-box">Awaiting trigger...</div>
</div>`,
    codeCss: `body {
  font-family: system-ui, sans-serif;
  background: #090d16;
  color: #f1f5f9;
  padding: 24px;
}
.sandbox-container {
  max-width: 520px;
  margin: 0 auto;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 20px;
}
h2 { margin-top: 0; font-size: 18px; }
.desc { font-size: 13px; color: #94a3b8; line-height: 1.5; }
.row { display: flex; gap: 8px; margin: 16px 0; }
button {
  background: #0284c7;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}
button.danger { background: #dc2626; }
.status-box {
  background: #090d16;
  border: 1px solid #1e293b;
  padding: 12px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 13px;
  color: #38bdf8;
  min-height: 48px;
  display: flex;
  align-items: center;
}`,
    codeJs: `let abortCtrl = null;
const reqBtn = document.getElementById('reqBtn');
const abortBtn = document.getElementById('abortBtn');
const statusBox = document.getElementById('statusBox');

reqBtn.addEventListener('click', () => {
  if (abortCtrl) abortCtrl.abort();
  abortCtrl = new AbortController();
  const signal = abortCtrl.signal;

  statusBox.textContent = 'Request in flight... waiting for 1.8s response';
  statusBox.style.color = '#eab308';

  const timer = setTimeout(() => {
    if (!signal.aborted) {
      statusBox.textContent = 'Payload received: { statusCode: 200, items: 42 }';
      statusBox.style.color = '#22c55e';
    }
  }, 1800);

  signal.addEventListener('abort', () => {
    clearTimeout(timer);
    statusBox.textContent = 'Signal aborted! Clean teardown executed.';
    statusBox.style.color = '#f87171';
  });
});

abortBtn.addEventListener('click', () => {
  if (abortCtrl) abortCtrl.abort();
});`,
  },
  {
    id: 'ex-accessible-tabs',
    title: 'WAI-ARIA Keyboard-Accessible Tabs',
    summary: 'Strict keyboard navigation (Home, End, Arrow Keys) adhering to W3C APG patterns.',
    codeHtml: `<div class="tabs-wrapper">
  <div role="tablist" aria-label="Course Tracks" class="tablist">
    <button role="tab" aria-selected="true" id="tab-1" aria-controls="panel-1" tabindex="0" class="tab-item active">Server Architecture</button>
    <button role="tab" aria-selected="false" id="tab-2" aria-controls="panel-2" tabindex="-1" class="tab-item">State & Cache</button>
    <button role="tab" aria-selected="false" id="tab-3" aria-controls="panel-3" tabindex="-1" class="tab-item">Production Edge</button>
  </div>
  <div id="panel-1" role="tabpanel" aria-labelledby="tab-1" class="panel-box">
    <h4>Server Architecture (Module 01)</h4>
    <p>Exploring stream pipelines, Node.js worker pools, and memory management in long-running services.</p>
  </div>
  <div id="panel-2" role="tabpanel" aria-labelledby="tab-2" class="panel-box hidden">
    <h4>State & Cache Strategies (Module 02)</h4>
    <p>Stale-While-Revalidate caching, optimistic UI updates, and conflict resolution across distributed replicas.</p>
  </div>
  <div id="panel-3" role="tabpanel" aria-labelledby="tab-3" class="panel-box hidden">
    <h4>Production Edge Deployment (Module 03)</h4>
    <p>Global edge routing, cold start minimization, and synthetic health monitoring.</p>
  </div>
</div>`,
    codeCss: `body {
  font-family: system-ui, sans-serif;
  background: #090d16;
  color: #f1f5f9;
  padding: 24px;
}
.tabs-wrapper {
  max-width: 540px;
  margin: 0 auto;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 20px;
}
.tablist {
  display: flex;
  gap: 4px;
  background: #090d16;
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 16px;
}
.tab-item {
  flex: 1;
  background: transparent;
  color: #94a3b8;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}
.tab-item:hover { color: #f1f5f9; }
.tab-item.active {
  background: #1e293b;
  color: #38bdf8;
  box-shadow: 0 1px 2px rgba(0,0,0,0.4);
}
.tab-item:focus-visible {
  outline: 2px solid #38bdf8;
  outline-offset: -2px;
}
.panel-box {
  background: #131c31;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 16px;
}
h4 { margin: 0 0 8px 0; font-size: 15px; color: #f1f5f9; }
p { margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5; }
.hidden { display: none; }`,
    codeJs: `const tabs = document.querySelectorAll('[role="tab"]');
const panels = document.querySelectorAll('[role="tabpanel"]');

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(index));
  tab.addEventListener('keydown', (e) => {
    let newIndex = index;
    if (e.key === 'ArrowRight') newIndex = (index + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') newIndex = 0;
    else if (e.key === 'End') newIndex = tabs.length - 1;
    else return;

    e.preventDefault();
    selectTab(newIndex);
    tabs[newIndex].focus();
  });
});

function selectTab(index) {
  tabs.forEach((t, i) => {
    const isSelected = i === index;
    t.setAttribute('aria-selected', isSelected);
    t.setAttribute('tabindex', isSelected ? '0' : '-1');
    t.classList.toggle('active', isSelected);
    panels[i].classList.toggle('hidden', !isSelected);
  });
}`,
  },
];

export const INITIAL_LIVE_SESSION: LiveSessionState = {
  id: 'session-2026-w06',
  trackId: 'track-fullstack',
  title: 'Lecture 08: Distributed State & Micro-Frontends Architecture',
  moduleName: 'Week 06 · Microservices & Modern Front-End Integration',
  instructorName: 'Elena Rostova',
  instructorTitle: 'Principal Platform Engineer & Academy Fellow Lead',
  instructorAvatar: ASSETS.instructor,
  roomStatus: 'live',
  elapsedSeconds: 2480, // ~41 mins into class
  attendeesCount: 46,
  handRaisesCount: 3,
  broadcastMode: 'interactive-code',
  agenda: [
    { id: 'ag-1', time: '13:00', title: 'Recap: Event Loop, Macro vs Microtasks', completed: true },
    { id: 'ag-2', time: '13:15', title: 'Deep Dive: Reactive Streaming with Web Workers', completed: true },
    { id: 'ag-3', time: '13:40', title: 'Live Code Conduction: Resilient State Machine', completed: false, notes: 'Emphasize error boundaries and fallback UI' },
    { id: 'ag-4', time: '14:15', title: 'Real-time Comprehension Check & Concept Poll', completed: false },
    { id: 'ag-5', time: '14:35', title: 'Breakout Pairs: Implement Focus-Trapped Modals', completed: false },
    { id: 'ag-6', time: '14:50', title: 'Q&A, Project Rubric Walkthrough & Closing', completed: false },
  ],
  currentPoll: {
    id: 'poll-01',
    question: 'When should you prefer an AbortController over simple component unmount flags in client fetch calls?',
    options: [
      { id: 'opt-1', text: 'To terminate TCP socket & conserve client/server bandwidth immediately', votes: 29 },
      { id: 'opt-2', text: 'Only when using Server-Sent Events (SSE) connections', votes: 4 },
      { id: 'opt-3', text: 'It is strictly an aesthetic syntax preference with no runtime gain', votes: 1 },
      { id: 'opt-4', text: 'Whenever a route transition cancels an active write payload', votes: 12 },
    ],
    active: true,
    totalResponses: 46,
    userVotedOptionId: 'opt-1',
  },
  questions: [
    {
      id: 'q-1',
      studentName: 'Julian Vance',
      timestamp: '13:34',
      question: 'How do we gracefully handle streaming response chunks if the middle-layer proxy buffers until EOF?',
      votes: 8,
      status: 'answering',
    },
    {
      id: 'q-2',
      studentName: 'Amara Chen',
      timestamp: '13:41',
      question: 'In the WAI-ARIA tab pattern, should pressing ArrowDown also navigate tabs or cycle panels?',
      votes: 5,
      status: 'queued',
    },
    {
      id: 'q-3',
      studentName: 'Mateo Rossi',
      timestamp: '13:28',
      question: 'Is SharedWorker widely supported enough to replace broadcast channel across browser tabs?',
      votes: 3,
      status: 'resolved',
    },
    {
      id: 'q-4',
      studentName: 'Sofia Lindqvist',
      timestamp: '13:48',
      question: 'Could you demonstrate the memory profile snapshot when event listeners are not unregistered?',
      votes: 4,
      status: 'queued',
    },
  ],
  notes: `Conductor Chalkboard:
• Rule of thumb: Cancel inflight queries before re-fetching query params.
• Never execute DOM manipulations outside requestAnimationFrame in high-frequency scroll handlers.
• Rubric reminder: 25% of Week 6 grade is accessibility tree verification.`,
};

export const INITIAL_COHORT_TRACKS: CohortTrack[] = [
  {
    id: 'track-fullstack',
    title: 'Full-Stack Web Systems & Cloud Architecture',
    tagline: 'Deep dive into scalable Node.js services, reactive clients, and distributed data systems.',
    cohortCode: 'COHORT-2026-ALPHA',
    durationWeeks: 12,
    currentWeek: 6,
    fellowsEnrolled: 48,
    averageAttendancePct: 96.4,
    completionRatePct: 92.1,
    coverImage: ASSETS.trackFullstack,
    modules: [
      {
        id: 'mod-1',
        weekNumber: 1,
        title: 'Modern HTTP, Networking & Browser Runtime Core',
        summary: 'HTTP/2 & HTTP/3 multiplexing, browser critical rendering path, repaint/reflow optimization.',
        topics: ['TCP & TLS Handshakes', 'DOM & CSSOM construction', 'Memory Profiling & Leaks'],
        durationHours: 12,
        status: 'completed',
        projectDeliverable: 'Synthetic Browser Performance Audit Tool',
      },
      {
        id: 'mod-2',
        weekNumber: 2,
        title: 'TypeScript Type Systems & Advanced Patterns',
        summary: 'Conditional types, mapped types, template literal types, and inference narrowing.',
        topics: ['Discriminated Unions', 'Utility Type Engineering', 'Strict Null Checks'],
        durationHours: 14,
        status: 'completed',
        projectDeliverable: 'Type-Safe Schema Validator Library',
      },
      {
        id: 'mod-3',
        weekNumber: 3,
        title: 'Component Architecture & State Orchestration',
        summary: 'Unidirectional data flows, compound component patterns, reducer architectures.',
        topics: ['Context Isolation', 'Batching Re-renders', 'State Machine Patterns'],
        durationHours: 16,
        status: 'completed',
        projectDeliverable: 'Collaborative Kanban Engine',
      },
      {
        id: 'mod-4',
        weekNumber: 4,
        title: 'Asynchronous Concurrency & Streaming IO',
        summary: 'Streams API, WebSockets, Server-Sent Events, resilient retry backoffs.',
        topics: ['ReadableStream & TransformStream', 'Socket Reconnection Logic', 'Backpressure Control'],
        durationHours: 15,
        status: 'completed',
        projectDeliverable: 'Live Stock & Telemetry Ticker Service',
      },
      {
        id: 'mod-5',
        weekNumber: 5,
        title: 'Database Design, Query Optimization & Caching',
        summary: 'Relational data modeling, index strategy, Redis eviction policies, transaction isolation.',
        topics: ['B-Tree Indexing', 'ACID Transactions', 'Connection Pooling'],
        durationHours: 18,
        status: 'completed',
        projectDeliverable: 'High-Throughput Inventory Ledger',
      },
      {
        id: 'mod-6',
        weekNumber: 6,
        title: 'Microservices & Modern Front-End Integration',
        summary: 'Current active module. API Gateways, contract testing, and isolated module builds.',
        topics: ['Schema Federation', 'OpenAPI Generation', 'Micro-frontends Routing'],
        durationHours: 16,
        status: 'in-progress',
        projectDeliverable: 'Federated Analytics Command Portal',
      },
      {
        id: 'mod-7',
        weekNumber: 7,
        title: 'Server-Side Rendering & Streaming Hydration',
        summary: 'React Server Components, selective hydration, Suspense architecture.',
        topics: ['Streaming SSR', 'Partial Pre-rendering', 'Cache-Control Headers'],
        durationHours: 16,
        status: 'upcoming',
        projectDeliverable: 'Content Publishing Platform with Edge Cache',
      },
      {
        id: 'mod-8',
        weekNumber: 8,
        title: 'Web Security, Cryptography & Identity Protocols',
        summary: 'OAuth 2.1, OIDC tokens, CSRF/XSS defense, WebAuthn & passkeys.',
        topics: ['PKCE Authorization Flow', 'Content-Security-Policy', 'Rate Limiting & Firewalls'],
        durationHours: 14,
        status: 'upcoming',
        projectDeliverable: 'Zero-Trust Single Sign-On Gateway',
      },
    ],
  },
  {
    id: 'track-frontend',
    title: 'Frontend Systems, UI Engineering & Performance',
    tagline: 'Crafting accessible, pixel-perfect, sub-second interactive user experiences.',
    cohortCode: 'COHORT-2026-BETA',
    durationWeeks: 10,
    currentWeek: 4,
    fellowsEnrolled: 36,
    averageAttendancePct: 94.8,
    completionRatePct: 88.5,
    coverImage: ASSETS.trackFrontend,
    modules: [
      {
        id: 'fe-1',
        weekNumber: 1,
        title: 'Layout Geometry, CSS Grid & Modern Fluid Typography',
        summary: 'Subgrid, container queries, clamp math, and typographic vertical rhythm.',
        topics: ['CSS Grid Level 2', 'Fluid Type Scalers', 'Logical Properties'],
        durationHours: 12,
        status: 'completed',
        projectDeliverable: 'Editorial Magazine Specimen Layout',
      },
      {
        id: 'fe-2',
        weekNumber: 2,
        title: 'W3C Accessibility (WCAG 2.2 AA) & Design Tokens',
        summary: 'Screen reader tree inspection, ARIA authoring practices, high contrast color math.',
        topics: ['Keyboard Navigation Traps', 'Live Regions', 'Accessible SVGs'],
        durationHours: 14,
        status: 'completed',
        projectDeliverable: 'Fully Accessible Headless UI Component Kit',
      },
      {
        id: 'fe-3',
        weekNumber: 3,
        title: 'Compositor Animations & Micro-Interactions',
        summary: 'FLIP animation technique, CSS will-change, springs, smooth gesture physics.',
        topics: ['Compositor vs Main Thread', 'Spring Physics', 'Reduced Motion Queries'],
        durationHours: 14,
        status: 'completed',
        projectDeliverable: 'Gesture-Driven Mobile Drawer Library',
      },
      {
        id: 'fe-4',
        weekNumber: 4,
        title: 'Web Vitals & Sub-Millisecond Profiling',
        summary: 'Current module. Deep measurement of LCP, INP, CLS, long animation frames (LoAF).',
        topics: ['INP Optimization', 'Yielding to Main Thread', 'Font Preloading Tactics'],
        durationHours: 16,
        status: 'in-progress',
        projectDeliverable: 'Core Web Vitals Regression Suite',
      },
    ],
  },
];

export const INITIAL_RUBRIC_CRITERIA: RubricCriterion[] = [
  {
    id: 'crit-architecture',
    name: 'System Architecture & Modularity',
    weightPct: 30,
    levels: [
      { score: 4, label: 'Exemplary', description: 'Clean separation of concerns, zero circular dependencies, high testability, comprehensive decoupling.' },
      { score: 3, label: 'Proficient', description: 'Clear component boundaries with minimal leakage; state managed coherently.' },
      { score: 2, label: 'Developing', description: 'Monolithic files, some prop drilling, mixed responsibilities in presentation components.' },
      { score: 1, label: 'Inadequate', description: 'Tangled business logic in view layers, brittle state mutations, unmaintainable.' },
    ],
  },
  {
    id: 'crit-a11y',
    name: 'Accessibility & W3C Semantic Standards',
    weightPct: 25,
    levels: [
      { score: 4, label: 'Exemplary', description: 'Full WCAG 2.2 AA compliance, robust ARIA attributes, complete keyboard focus traps and escapes.' },
      { score: 3, label: 'Proficient', description: 'Semantic HTML5 throughout, accessible color contrasts, all buttons reachable via Tab.' },
      { score: 2, label: 'Developing', description: 'Missing label associations, some outline removal without replacement, partial keyboard support.' },
      { score: 1, label: 'Inadequate', description: 'Div-based buttons with no role, missing alt tags, untrapped focus modals.' },
    ],
  },
  {
    id: 'crit-performance',
    name: 'Performance & Network Efficiency',
    weightPct: 25,
    levels: [
      { score: 4, label: 'Exemplary', description: 'LCP < 1.2s, INP < 50ms, zero layout shifts, dynamic code splitting and asset budgeting.' },
      { score: 3, label: 'Proficient', description: 'Good bundle hygiene, memoization applied where profiling showed bottleneck, no obvious blocking.' },
      { score: 2, label: 'Developing', description: 'Unoptimized images, large vendor chunks, unnecessary re-render loops.' },
      { score: 1, label: 'Inadequate', description: 'Heavy memory leaks, blocking UI thread during user clicks, bundle > 2MB uncompressed.' },
    ],
  },
  {
    id: 'crit-hygiene',
    name: 'Code Hygiene, Typing & Error Resilience',
    weightPct: 20,
    levels: [
      { score: 4, label: 'Exemplary', description: 'Strict TypeScript without "any", defensive error boundaries, graceful offline/error states.' },
      { score: 3, label: 'Proficient', description: 'Well typed, basic try-catch handlers in async flows, descriptive variable nomenclature.' },
      { score: 2, label: 'Developing', description: 'Frequent type assertions (as unknown as T), silent catch blocks, incomplete edge case coverage.' },
      { score: 1, label: 'Inadequate', description: 'Runtime type errors, unhandled promise rejections crashing application.' },
    ],
  },
];

export const INITIAL_SUBMISSIONS: ProjectSubmission[] = [
  {
    id: 'sub-01',
    studentId: 'stu-101',
    studentName: 'Julian Vance',
    studentEmail: 'julian.vance@academy.dev',
    projectTitle: 'Distributed Event-Stream Dashboard & Health Visualizer',
    trackId: 'track-fullstack',
    submissionDate: '2026-10-21',
    githubUrl: 'https://github.com/academy-cohort/vance-telemetry-engine',
    demoUrl: 'https://vance-telemetry.academy.preview',
    status: 'graded',
    scores: {
      'crit-architecture': 4,
      'crit-a11y': 4,
      'crit-performance': 4,
      'crit-hygiene': 3,
    },
    totalScorePct: 96,
    feedbackNotes: 'Outstanding architecture with clear boundary between worker threads and main UI thread. Excellent keyboard traversal.',
    honorsDistinction: true,
  },
  {
    id: 'sub-02',
    studentId: 'stu-102',
    studentName: 'Amara Chen',
    studentEmail: 'amara.chen@academy.dev',
    projectTitle: 'Type-Safe Headless Form & Schema Engine',
    trackId: 'track-fullstack',
    submissionDate: '2026-10-22',
    githubUrl: 'https://github.com/academy-cohort/chen-schema-runtime',
    demoUrl: 'https://chen-schema.academy.preview',
    status: 'pending',
    scores: {
      'crit-architecture': 3,
      'crit-a11y': 3,
      'crit-performance': 3,
      'crit-hygiene': 4,
    },
    totalScorePct: 82,
    feedbackNotes: 'Validation compiler is extremely fast. Need to inspect keyboard focus on dynamic array item insertions.',
    honorsDistinction: false,
  },
  {
    id: 'sub-03',
    studentId: 'stu-103',
    studentName: 'Mateo Rossi',
    studentEmail: 'mateo.rossi@academy.dev',
    projectTitle: 'Zero-Dependency Accessible Component Library',
    trackId: 'track-frontend',
    submissionDate: '2026-10-20',
    githubUrl: 'https://github.com/academy-cohort/rossi-aria-primitives',
    demoUrl: 'https://rossi-primitives.academy.preview',
    status: 'graded',
    scores: {
      'crit-architecture': 3,
      'crit-a11y': 4,
      'crit-performance': 4,
      'crit-hygiene': 3,
    },
    totalScorePct: 88,
    feedbackNotes: 'Exceptional ARIA role adherence. Slider and tabs meet the highest W3C criteria.',
    honorsDistinction: false,
  },
  {
    id: 'sub-04',
    studentId: 'stu-104',
    studentName: 'Sofia Lindqvist',
    studentEmail: 'sofia.l@academy.dev',
    projectTitle: 'Sub-Millisecond Canvas Data Grid & Virtual Scroll',
    trackId: 'track-frontend',
    submissionDate: '2026-10-22',
    githubUrl: 'https://github.com/academy-cohort/sofia-virtual-matrix',
    demoUrl: 'https://sofia-matrix.academy.preview',
    status: 'pending',
    scores: {
      'crit-architecture': 4,
      'crit-a11y': 2,
      'crit-performance': 4,
      'crit-hygiene': 4,
    },
    totalScorePct: 85,
    feedbackNotes: 'Raw performance with 500k rows is blazing fast. Canvas needs an offscreen DOM fallback table for screen readers.',
    honorsDistinction: false,
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-101',
    name: 'Julian Vance',
    email: 'julian.vance@academy.dev',
    trackId: 'track-fullstack',
    cohortCode: 'COHORT-2026-ALPHA',
    enrolledDate: '2026-09-01',
    attendancePct: 98.5,
    completedLabsCount: 14,
    totalLabsCount: 14,
    averageGradePct: 96.2,
    status: 'active',
    capstoneStatus: 'honors',
  },
  {
    id: 'stu-102',
    name: 'Amara Chen',
    email: 'amara.chen@academy.dev',
    trackId: 'track-fullstack',
    cohortCode: 'COHORT-2026-ALPHA',
    enrolledDate: '2026-09-01',
    attendancePct: 95.0,
    completedLabsCount: 13,
    totalLabsCount: 14,
    averageGradePct: 91.4,
    status: 'active',
    capstoneStatus: 'in-progress',
  },
  {
    id: 'stu-103',
    name: 'Mateo Rossi',
    email: 'mateo.rossi@academy.dev',
    trackId: 'track-frontend',
    cohortCode: 'COHORT-2026-BETA',
    enrolledDate: '2026-09-15',
    attendancePct: 92.8,
    completedLabsCount: 12,
    totalLabsCount: 12,
    averageGradePct: 89.0,
    status: 'active',
    capstoneStatus: 'in-progress',
  },
  {
    id: 'stu-104',
    name: 'Sofia Lindqvist',
    email: 'sofia.l@academy.dev',
    trackId: 'track-frontend',
    cohortCode: 'COHORT-2026-BETA',
    enrolledDate: '2026-09-15',
    attendancePct: 97.2,
    completedLabsCount: 12,
    totalLabsCount: 12,
    averageGradePct: 94.7,
    status: 'active',
    capstoneStatus: 'passed',
  },
  {
    id: 'stu-105',
    name: 'Kofi Mensah',
    email: 'kofi.mensah@academy.dev',
    trackId: 'track-fullstack',
    cohortCode: 'COHORT-2026-ALPHA',
    enrolledDate: '2026-09-01',
    attendancePct: 94.0,
    completedLabsCount: 13,
    totalLabsCount: 14,
    averageGradePct: 88.6,
    status: 'active',
    capstoneStatus: 'in-progress',
  },
  {
    id: 'stu-106',
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@academy.dev',
    trackId: 'track-fullstack',
    cohortCode: 'COHORT-2026-ALPHA',
    enrolledDate: '2026-09-01',
    attendancePct: 100.0,
    completedLabsCount: 14,
    totalLabsCount: 14,
    averageGradePct: 97.8,
    status: 'active',
    capstoneStatus: 'honors',
  },
  {
    id: 'stu-107',
    name: 'Clara Dubois',
    email: 'clara.dubois@academy.dev',
    trackId: 'track-frontend',
    cohortCode: 'COHORT-2026-BETA',
    enrolledDate: '2026-09-15',
    attendancePct: 91.5,
    completedLabsCount: 11,
    totalLabsCount: 12,
    averageGradePct: 86.2,
    status: 'active',
    capstoneStatus: 'in-progress',
  },
  {
    id: 'stu-108',
    name: 'David O\'Connor',
    email: 'david.oc@academy.dev',
    trackId: 'track-fullstack',
    cohortCode: 'COHORT-2026-ALPHA',
    enrolledDate: '2026-09-01',
    attendancePct: 96.0,
    completedLabsCount: 14,
    totalLabsCount: 14,
    averageGradePct: 93.1,
    status: 'active',
    capstoneStatus: 'passed',
  },
];
