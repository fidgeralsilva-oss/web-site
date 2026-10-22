import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Terminal,
  Code2,
  Check,
  HelpCircle,
} from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  testFn: (html: string, css: string, js: string) => boolean;
  explanation: string;
}

interface Challenge {
  id: string;
  title: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  description: string;
  starterHtml: string;
  starterCss: string;
  starterJs: string;
  tests: TestCase[];
}

const LAB_CHALLENGES: Challenge[] = [
  {
    id: 'ch-flex-grail',
    title: 'Lab 01: Semantic Holy Grail Layout Engine',
    difficulty: 'Foundation',
    description:
      'Construct a resilient responsive Holy Grail layout using semantic HTML5 tags (<header>, <main>, <aside>, <footer>) and modern CSS Grid or Flexbox.',
    starterHtml: `<div class="app-layout">
  <header>
    <h1>Academy Conduction Portal</h1>
  </header>
  <div class="content-row">
    <nav class="sidebar">
      <ul>
        <li>Dashboard</li>
        <li>Syllabus</li>
      </ul>
    </nav>
    <main>
      <h2>Active Cohort Stream</h2>
      <p>Content rendered with zero overflow.</p>
    </main>
    <aside class="telemetry">
      <h3>Telemetry</h3>
      <p>Latency: 12ms</p>
    </aside>
  </div>
  <footer>
    <p>&copy; 2026 Web Academy Conduction</p>
  </footer>
</div>`,
    starterCss: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, sans-serif;
  background: #090d16;
  color: #f1f5f9;
  min-height: 100vh;
  padding: 16px;
}
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 380px;
  border: 1px solid #1e293b;
  border-radius: 8px;
  overflow: hidden;
  background: #0f172a;
}
header {
  background: #1e293b;
  padding: 12px 16px;
  font-size: 14px;
}
.content-row {
  display: flex;
  flex: 1;
}
.sidebar {
  width: 140px;
  background: #131c31;
  padding: 12px;
  border-right: 1px solid #1e293b;
  font-size: 12px;
}
main {
  flex: 1;
  padding: 16px;
  background: #090d16;
}
.telemetry {
  width: 140px;
  background: #131c31;
  padding: 12px;
  border-left: 1px solid #1e293b;
  font-size: 12px;
}
footer {
  background: #1e293b;
  padding: 10px 16px;
  font-size: 11px;
  text-align: center;
  color: #94a3b8;
}`,
    starterJs: `console.log('Holy Grail layout loaded successfully');`,
    tests: [
      {
        id: 't-semantic',
        name: 'Uses Semantic Elements (<header>, <main>, <aside>, <footer>)',
        testFn: (html) =>
          html.includes('<header') &&
          html.includes('<main') &&
          html.includes('<aside') &&
          html.includes('<footer'),
        explanation: 'Must declare native semantic tags rather than generic divs.',
      },
      {
        id: 't-display',
        name: 'Applies Flex or Grid layout properties',
        testFn: (_, css) => css.includes('display: flex') || css.includes('display: grid'),
        explanation: 'Modern layout rules require flex or grid container declarations.',
      },
      {
        id: 't-sizing',
        name: 'Configures border-box sizing reset',
        testFn: (_, css) => css.includes('box-sizing: border-box'),
        explanation: 'Universal box-sizing prevents unintended padding overflows.',
      },
    ],
  },
  {
    id: 'ch-async-abort',
    title: 'Lab 02: Resilient AbortController Pipeline',
    difficulty: 'Intermediate',
    description:
      'Implement defensive network concurrency using AbortController. Attach the signal to an inflight request and ensure graceful abort cleanup.',
    starterHtml: `<div class="card">
  <h3>Network Concurrency Sandbox</h3>
  <div class="row">
    <button id="sendBtn">Dispatch Latent Query</button>
    <button id="abortBtn" class="abort">Abort Signal</button>
  </div>
  <div id="output" class="box">Status: Idle</div>
</div>`,
    starterCss: `body {
  background: #090d16;
  color: #f1f5f9;
  font-family: system-ui, sans-serif;
  padding: 24px;
}
.card {
  max-width: 480px;
  background: #0f172a;
  border: 1px solid #1e293b;
  padding: 20px;
  border-radius: 10px;
}
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
button.abort { background: #dc2626; }
.box {
  background: #090d16;
  border: 1px solid #1e293b;
  padding: 12px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 13px;
}`,
    starterJs: `let controller = null;
const sendBtn = document.getElementById('sendBtn');
const abortBtn = document.getElementById('abortBtn');
const output = document.getElementById('output');

sendBtn.addEventListener('click', () => {
  if (controller) controller.abort();
  controller = new AbortController();
  const signal = controller.signal;

  output.textContent = 'Status: In-flight...';
  output.style.color = '#38bdf8';

  const timer = setTimeout(() => {
    output.textContent = 'Status: HTTP 200 OK Response Received';
    output.style.color = '#4ade80';
  }, 1500);

  signal.addEventListener('abort', () => {
    clearTimeout(timer);
    output.textContent = 'Status: Request Aborted by Controller';
    output.style.color = '#f87171';
  });
});

abortBtn.addEventListener('click', () => {
  if (controller) controller.abort();
});`,
    tests: [
      {
        id: 't-instantiate',
        name: 'Instantiates new AbortController() instance',
        testFn: (_, __, js) => js.includes('new AbortController()'),
        explanation: 'Must construct native browser AbortController on query trigger.',
      },
      {
        id: 't-signal',
        name: 'Subscribes to signal or binds signal property',
        testFn: (_, __, js) => js.includes('.signal'),
        explanation: 'AbortSignal must be read or passed to the query handler.',
      },
      {
        id: 't-abort-call',
        name: 'Invokes controller.abort() handler',
        testFn: (_, __, js) => js.includes('.abort()'),
        explanation: 'Explicit abort method must be triggered on cancel actions.',
      },
    ],
  },
  {
    id: 'ch-aria-toggle',
    title: 'Lab 03: Accessible WAI-ARIA Toggle Button',
    difficulty: 'Advanced',
    description:
      'Build an accessible two-state toggle switch with aria-pressed, keyboard space/enter triggers, and visible focus indicators.',
    starterHtml: `<div class="widget">
  <h3>Microphone Mute Toggle</h3>
  <button id="micToggle" role="button" aria-pressed="false" class="toggle-btn">
    <span class="indicator"></span>
    <span id="label">Microphone Muted: No</span>
  </button>
</div>`,
    starterCss: `body {
  background: #090d16;
  color: #f1f5f9;
  font-family: system-ui, sans-serif;
  padding: 24px;
}
.widget {
  max-width: 440px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 20px;
}
.toggle-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #1e293b;
  border: 1px solid #334155;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  margin-top: 12px;
}
.toggle-btn:focus-visible {
  outline: 2px solid #38bdf8;
  outline-offset: 2px;
}
.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #64748b;
}
.toggle-btn[aria-pressed="true"] .indicator {
  background: #ef4444;
}
.toggle-btn[aria-pressed="true"] {
  border-color: #ef4444;
}`,
    starterJs: `const btn = document.getElementById('micToggle');
const label = document.getElementById('label');

btn.addEventListener('click', () => {
  const isPressed = btn.getAttribute('aria-pressed') === 'true';
  const next = !isPressed;
  btn.setAttribute('aria-pressed', String(next));
  label.textContent = next ? 'Microphone Muted: Yes' : 'Microphone Muted: No';
  console.log('Toggled aria-pressed to:', next);
});`,
    tests: [
      {
        id: 't-aria-pressed',
        name: 'Configures and toggles aria-pressed attribute',
        testFn: (html, _, js) =>
          html.includes('aria-pressed') && js.includes('aria-pressed'),
        explanation: 'Screen readers require aria-pressed to announce toggle state changes.',
      },
      {
        id: 't-focus-ring',
        name: 'Defines visible :focus-visible outline',
        testFn: (_, css) => css.includes(':focus-visible'),
        explanation: 'Keyboard users require unmistakable focus rings.',
      },
      {
        id: 't-role',
        name: 'Uses native <button> or role="button"',
        testFn: (html) => html.includes('<button') || html.includes('role="button"'),
        explanation: 'Accessible interactivity requires button semantics.',
      },
    ],
  },
];

export const LabSandbox: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(LAB_CHALLENGES[0]);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [htmlCode, setHtmlCode] = useState<string>(LAB_CHALLENGES[0].starterHtml);
  const [cssCode, setCssCode] = useState<string>(LAB_CHALLENGES[0].starterCss);
  const [jsCode, setJsCode] = useState<string>(LAB_CHALLENGES[0].starterJs);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [testRan, setTestRan] = useState<boolean>(false);
  const [previewKey, setPreviewKey] = useState<number>(0);
  const [consoleMsgs, setConsoleMsgs] = useState<string[]>(['[Sandbox] Ready for execution.']);

  const handleSelectChallenge = (ch: Challenge) => {
    setSelectedChallenge(ch);
    setHtmlCode(ch.starterHtml);
    setCssCode(ch.starterCss);
    setJsCode(ch.starterJs);
    setTestRan(false);
    setTestResults({});
    setPreviewKey((k) => k + 1);
    setConsoleMsgs([`[Lab Switched] Loaded "${ch.title}" challenge baseline.`]);
  };

  const handleRunTests = () => {
    const results: Record<string, boolean> = {};
    selectedChallenge.tests.forEach((t) => {
      try {
        results[t.id] = t.testFn(htmlCode, cssCode, jsCode);
      } catch (e) {
        results[t.id] = false;
      }
    });
    setTestResults(results);
    setTestRan(true);
    setPreviewKey((k) => k + 1);
  };

  const handleResetChallenge = () => {
    setHtmlCode(selectedChallenge.starterHtml);
    setCssCode(selectedChallenge.starterCss);
    setJsCode(selectedChallenge.starterJs);
    setTestRan(false);
    setTestResults({});
    setPreviewKey((k) => k + 1);
  };

  const iframeContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
  <script>
    window.onerror = function(msg, url, line) {
      window.parent.postMessage({ type: 'LAB_LOG', payload: '[Error L' + line + '] ' + msg }, '*');
    };
    const origLog = console.log;
    console.log = function(...args) {
      origLog.apply(console, args);
      window.parent.postMessage({ type: 'LAB_LOG', payload: args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') }, '*');
    };
    try {
      ${jsCode}
    } catch(err) {
      window.parent.postMessage({ type: 'LAB_LOG', payload: '[Exception] ' + err.message }, '*');
    }
  </script>
</body>
</html>
`;

  useEffect(() => {
    const handleMsg = (ev: MessageEvent) => {
      if (ev.data && ev.data.type === 'LAB_LOG') {
        setConsoleMsgs((prev) => [...prev.slice(-10), String(ev.data.payload)]);
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  const totalPassed = Object.values(testResults).filter(Boolean).length;
  const allPassed = testRan && totalPassed === selectedChallenge.tests.length;

  return (
    <div className="space-y-6">
      {/* Header & Challenge Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-mono text-sky-400">
            ENGINEERING WORKBENCH & TEST RUNNER
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Academy Lab Sandbox
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Conduct isolated coding exercises with live AST verification and automated assertion testing.
          </p>
        </div>

        {/* Challenge selector buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {LAB_CHALLENGES.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectChallenge(c)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedChallenge.id === c.id
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-[#0f172a] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Description Card */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-sky-400 font-semibold">{selectedChallenge.title}</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-slate-400">Difficulty: {selectedChallenge.difficulty}</span>
          </div>

          <button
            onClick={handleResetChallenge}
            className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Challenge</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          {selectedChallenge.description}
        </p>
      </div>

      {/* Split Editor and Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Code Editor (7 cols) */}
        <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          {/* Tabs bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#090d16] px-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('html')}
                className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'html'
                    ? 'border-sky-500 text-sky-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                index.html
              </button>
              <button
                onClick={() => setActiveTab('css')}
                className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'css'
                    ? 'border-sky-500 text-sky-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                styles.css
              </button>
              <button
                onClick={() => setActiveTab('js')}
                className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'js'
                    ? 'border-sky-500 text-sky-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                script.js
              </button>
            </div>

            <button
              onClick={() => setPreviewKey((k) => k + 1)}
              className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>Update Preview</span>
            </button>
          </div>

          {/* Textarea Editor */}
          <div className="bg-[#090d16] p-4 min-h-[340px]">
            {activeTab === 'html' && (
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="w-full h-[340px] bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none"
                spellCheck={false}
              />
            )}
            {activeTab === 'css' && (
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                className="w-full h-[340px] bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none"
                spellCheck={false}
              />
            )}
            {activeTab === 'js' && (
              <textarea
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                className="w-full h-[340px] bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none"
                spellCheck={false}
              />
            )}
          </div>
        </div>

        {/* Right: Preview & Test Runner (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Automated Test Suite Box */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Automated Test Assertions
                </h3>
                <span className="text-xs text-slate-400">
                  {selectedChallenge.tests.length} verification checks
                </span>
              </div>

              <button
                onClick={handleRunTests}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Test Suite</span>
              </button>
            </div>

            {/* Test Summary Pill / Banner */}
            {testRan && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                  allPassed
                    ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-700 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {allPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="font-medium">
                    {allPassed
                      ? 'All challenge assertions satisfied! Excellent architecture.'
                      : `${totalPassed} / ${selectedChallenge.tests.length} assertions passing.`}
                  </span>
                </div>
                <span className="font-mono tabular-nums font-bold">
                  {Math.round((totalPassed / selectedChallenge.tests.length) * 100)}%
                </span>
              </div>
            )}

            {/* Test Case Items */}
            <div className="space-y-2">
              {selectedChallenge.tests.map((test) => {
                const passed = testResults[test.id];
                return (
                  <div
                    key={test.id}
                    className="p-3 bg-[#090d16] border border-slate-800 rounded-lg text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium text-slate-200">
                        {testRan ? (
                          passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                        )}
                        <span>{test.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">
                        {testRan ? (passed ? 'PASSED' : 'FAILED') : 'PENDING'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 pl-6 leading-normal">
                      {test.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sandboxed Live Output */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#0c1220] text-xs">
              <span className="font-semibold text-slate-300">Sandboxed DOM Preview</span>
              <span className="text-[11px] font-mono text-slate-500">Real-time</span>
            </div>
            <div className="p-3 bg-[#090d16]">
              <iframe
                key={previewKey}
                title="Lab Sandbox Preview"
                srcDoc={iframeContent}
                className="w-full h-[220px] bg-[#090d16] rounded border border-slate-800"
                sandbox="allow-scripts allow-modals"
              />
            </div>

            {/* Console Log Drawer */}
            <div className="px-4 py-2.5 bg-[#080b12] border-t border-slate-800 font-mono text-xs text-slate-300">
              <div className="text-[11px] text-slate-500 uppercase font-semibold mb-1">
                SANDBOX CONSOLE LOG
              </div>
              <div className="space-y-1 max-h-20 overflow-y-auto text-[11px]">
                {consoleMsgs.map((m, i) => (
                  <div key={i} className="text-slate-300">
                    <span className="text-sky-500 mr-1.5">›</span>
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
