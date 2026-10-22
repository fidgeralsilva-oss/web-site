import React, { useState, useEffect, useRef } from 'react';
import {
  LiveSessionState,
  CodeExercisePreset,
  StudentQuestion,
} from '../types/academy';
import { INITIAL_EXERCISE_PRESETS } from '../data/mockData';
import {
  Play,
  Pause,
  RotateCcw,
  Users,
  Hand,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Send,
  MessageSquare,
  BarChart3,
  FileCode,
  ListTodo,
  Layers,
  ArrowUp,
} from 'lucide-react';

interface LiveConductionStudioProps {
  session: LiveSessionState;
  onUpdateSession: (updated: Partial<LiveSessionState>) => void;
  onNavigateToSandbox: () => void;
}

export const LiveConductionStudio: React.FC<LiveConductionStudioProps> = ({
  session,
  onUpdateSession,
  onNavigateToSandbox,
}) => {
  // Timer state
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const [elapsed, setElapsed] = useState<number>(session.elapsedSeconds);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  const formatTimer = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Code editor state
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ex-streaming-state');
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'css' | 'js'>('html');
  const [codeHtml, setCodeHtml] = useState<string>(INITIAL_EXERCISE_PRESETS[0].codeHtml);
  const [codeCss, setCodeCss] = useState<string>(INITIAL_EXERCISE_PRESETS[0].codeCss);
  const [codeJs, setCodeJs] = useState<string>(INITIAL_EXERCISE_PRESETS[0].codeJs);
  const [previewKey, setPreviewKey] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[Runtime Ready] Sandboxed DOM initialized with isolated execution context.',
  ]);

  // Handle Preset Switching
  const handleSelectPreset = (preset: CodeExercisePreset) => {
    setSelectedPresetId(preset.id);
    setCodeHtml(preset.codeHtml);
    setCodeCss(preset.codeCss);
    setCodeJs(preset.codeJs);
    setPreviewKey((k) => k + 1);
    setConsoleLogs([
      `[Loaded] Switched to preset: ${preset.title}`,
      '[Ready] Click elements in preview or trigger events.',
    ]);
  };

  const handleResetCurrent = () => {
    const found = INITIAL_EXERCISE_PRESETS.find((p) => p.id === selectedPresetId);
    if (found) {
      setCodeHtml(found.codeHtml);
      setCodeCss(found.codeCss);
      setCodeJs(found.codeJs);
      setPreviewKey((k) => k + 1);
      setConsoleLogs(['[Reset] Editor restored to default preset baseline.']);
    }
  };

  const handleCopyCode = () => {
    const fullSnippet = `<!-- HTML -->\n${codeHtml}\n\n/* CSS */\n${codeCss}\n\n// JavaScript\n${codeJs}`;
    navigator.clipboard.writeText(fullSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Build the sandboxed iframe srcDoc
  const assembledSrcDoc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${codeCss}
  </style>
</head>
<body>
  ${codeHtml}
  <script>
    window.onerror = function(msg, url, line) {
      window.parent.postMessage({ type: 'CONSOLE_LOG', payload: '[Error L' + line + '] ' + msg }, '*');
    };
    const origLog = console.log;
    console.log = function(...args) {
      origLog.apply(console, args);
      window.parent.postMessage({ type: 'CONSOLE_LOG', payload: args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') }, '*');
    };
    try {
      ${codeJs}
    } catch(err) {
      window.parent.postMessage({ type: 'CONSOLE_LOG', payload: '[Runtime Exception] ' + err.message }, '*');
    }
  </script>
</body>
</html>
`;

  useEffect(() => {
    const handleMsg = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CONSOLE_LOG') {
        setConsoleLogs((prev) => [...prev.slice(-15), String(event.data.payload)]);
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  // Conductor Deck Tab
  const [deckTab, setDeckTab] = useState<'agenda' | 'poll' | 'questions' | 'notes'>('agenda');

  // Agenda Actions
  const toggleAgendaItem = (itemId: string) => {
    const newAgenda = session.agenda.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdateSession({ agenda: newAgenda });
  };

  // Poll Actions
  const handleVotePoll = (optionId: string) => {
    const current = session.currentPoll;
    if (current.userVotedOptionId === optionId) return;

    const updatedOptions = current.options.map((opt) => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      if (opt.id === current.userVotedOptionId) {
        return { ...opt, votes: Math.max(0, opt.votes - 1) };
      }
      return opt;
    });

    const newTotal = current.userVotedOptionId
      ? current.totalResponses
      : current.totalResponses + 1;

    onUpdateSession({
      currentPoll: {
        ...current,
        options: updatedOptions,
        totalResponses: newTotal,
        userVotedOptionId: optionId,
      },
    });
  };

  const handleResetPoll = () => {
    const current = session.currentPoll;
    onUpdateSession({
      currentPoll: {
        ...current,
        userVotedOptionId: undefined,
        totalResponses: 0,
        options: current.options.map((opt) => ({ ...opt, votes: 0 })),
      },
    });
  };

  // Questions Actions
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    const newQ: StudentQuestion = {
      id: `q-${Date.now()}`,
      studentName: 'Julian Vance',
      timestamp: new Date().toTimeString().slice(0, 5),
      question: newQuestionText.trim(),
      votes: 1,
      status: 'queued',
    };
    onUpdateSession({
      questions: [newQ, ...session.questions],
    });
    setNewQuestionText('');
  };

  const handleUpvoteQuestion = (qId: string) => {
    const newQList = session.questions.map((q) =>
      q.id === qId ? { ...q, votes: q.votes + 1 } : q
    );
    onUpdateSession({ questions: newQList });
  };

  const handleSetQuestionStatus = (qId: string, status: 'queued' | 'answering' | 'resolved') => {
    const newQList = session.questions.map((q) =>
      q.id === qId ? { ...q, status } : q
    );
    onUpdateSession({ questions: newQList });
  };

  // Notes Action
  const [liveNotes, setLiveNotes] = useState<string>(session.notes);
  const handleNotesChange = (val: string) => {
    setLiveNotes(val);
    onUpdateSession({ notes: val });
  };

  return (
    <div className="space-y-6">
      {/* Conductor Command Strip */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Session Metadata (No pills, clean unboxed typographic metadata) */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-sky-400 font-mono">
              <span>{session.moduleName}</span>
              <span aria-hidden="true">·</span>
              <span>COHORT 2026-ALPHA</span>
              <span aria-hidden="true">·</span>
              <span>ROOM: STUDIO-MAIN</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight text-balance">
              {session.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-0.5">
              <span className="font-medium text-slate-300">{session.instructorName}</span>
              <span aria-hidden="true">·</span>
              <span>{session.instructorTitle}</span>
            </div>
          </div>

          {/* Conductor Telemetry & Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Session Timer */}
            <div className="flex items-center gap-2 bg-[#090d16] border border-slate-800 px-3.5 py-2 rounded-lg">
              <span className="text-xs text-slate-400">Class Elapsed:</span>
              <span className="font-mono tabular-nums text-sm font-semibold text-sky-400">
                {formatTimer(elapsed)}
              </span>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                title={timerRunning ? 'Pause timer' : 'Resume timer'}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setElapsed(0)}
                title="Reset timer"
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Attendance & Hand Raises */}
            <div className="flex items-center gap-3 bg-[#090d16] border border-slate-800 px-3.5 py-2 rounded-lg text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono tabular-nums font-semibold text-white">
                  {session.attendeesCount}
                </span>
                <span className="text-slate-400">fellows</span>
              </div>
              <span className="text-slate-700" aria-hidden="true">|</span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Hand className="w-3.5 h-3.5" />
                <span className="font-mono tabular-nums font-semibold">
                  {session.handRaisesCount}
                </span>
                <span className="text-slate-400">hands</span>
              </div>
            </div>

            {/* Broadcast Mode Segmented Control */}
            <div className="flex items-center p-1 bg-[#090d16] border border-slate-800 rounded-lg">
              <button
                onClick={() => onUpdateSession({ broadcastMode: 'interactive-code' })}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  session.broadcastMode === 'interactive-code'
                    ? 'bg-slate-800 text-sky-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Code Stage
              </button>
              <button
                onClick={() => onUpdateSession({ broadcastMode: 'presentation' })}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  session.broadcastMode === 'presentation'
                    ? 'bg-slate-800 text-sky-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Lecture Deck
              </button>
              <button
                onClick={() => onUpdateSession({ broadcastMode: 'breakout-lab' })}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  session.broadcastMode === 'breakout-lab'
                    ? 'bg-slate-800 text-sky-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Breakout Lab
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Zone Conduction Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Interactive Stage (7 Cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          {session.broadcastMode === 'presentation' ? (
            /* Presentation Deck View */
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden p-6 space-y-6">
              <div className="relative rounded-lg overflow-hidden border border-slate-800 aspect-video">
                <img
                  src={session.instructorAvatar}
                  alt="Instructor Studio Lecture"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs font-mono text-sky-400 mb-1">
                    LECTURE SLIDE 14 OF 28
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Microservices Contract Boundaries & Event-Driven Hydration
                  </h3>
                  <p className="text-sm text-slate-300 line-clamp-2">
                    Decoupling frontend state synchronizers from monolithic backend caches using server-sent streams and idempotent event handlers.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-[#090d16] border border-slate-800 rounded-lg">
                  <div className="font-semibold text-slate-200 mb-1">1. Message Topology</div>
                  <div className="text-slate-400">Zero roundtrip payload overhead via Web Worker message channels.</div>
                </div>
                <div className="p-3 bg-[#090d16] border border-slate-800 rounded-lg">
                  <div className="font-semibold text-slate-200 mb-1">2. Fault Containment</div>
                  <div className="text-slate-400">Error boundary isolations per federated micro-app shell.</div>
                </div>
                <div className="p-3 bg-[#090d16] border border-slate-800 rounded-lg">
                  <div className="font-semibold text-slate-200 mb-1">3. Hydration Order</div>
                  <div className="text-slate-400">Streaming critical interactive widgets prior to secondary telemetry.</div>
                </div>
              </div>
            </div>
          ) : session.broadcastMode === 'breakout-lab' ? (
            /* Breakout Lab View */
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 space-y-6 text-center">
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-12 h-12 bg-sky-950/80 border border-sky-800 text-sky-400 rounded-xl mx-auto flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Breakout Lab Conduction Active
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fellows are currently partitioned into 12 peer-programming pods tackling the WAI-ARIA Accessible Tab Navigation and AbortController implementation.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onNavigateToSandbox}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Open Standalone Lab Sandbox
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                {['Pod Alpha · 4 Fellows', 'Pod Beta · 4 Fellows', 'Pod Gamma · 4 Fellows', 'Pod Delta · 4 Fellows'].map(
                  (pod, i) => (
                    <div key={i} className="p-3 bg-[#090d16] border border-slate-800 rounded-lg text-xs">
                      <div className="font-medium text-slate-200 mb-1">{pod}</div>
                      <div className="text-[11px] text-emerald-400 font-mono">Stage 2 / In Progress</div>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            /* Interactive Code Stage */
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
              {/* Presets and Stage Bar */}
              <div className="p-3 bg-[#090d16] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap mr-1">
                    Preset Exercises:
                  </span>
                  {INITIAL_EXERCISE_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPreset(p)}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        selectedPresetId === p.id
                          ? 'bg-slate-800 text-sky-400 border border-slate-700'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleResetCurrent}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={() => setPreviewKey((k) => k + 1)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    <span>Run Preview</span>
                  </button>
                </div>
              </div>

              {/* Code Tabs Header */}
              <div className="flex items-center justify-between border-b border-slate-800 px-4 bg-[#0f172a]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveCodeTab('html')}
                    className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
                      activeCodeTab === 'html'
                        ? 'border-sky-500 text-sky-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    template.html
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('css')}
                    className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
                      activeCodeTab === 'css'
                        ? 'border-sky-500 text-sky-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    styles.css
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('js')}
                    className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition-colors cursor-pointer ${
                      activeCodeTab === 'js'
                        ? 'border-sky-500 text-sky-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    controller.js
                  </button>
                </div>

                <span className="text-[11px] text-slate-500 font-mono">
                  Live Conductor Broadcast Stream
                </span>
              </div>

              {/* Code Editor Body */}
              <div className="relative bg-[#090d16] min-h-[220px]">
                {activeCodeTab === 'html' && (
                  <textarea
                    value={codeHtml}
                    onChange={(e) => setCodeHtml(e.target.value)}
                    className="w-full h-[220px] p-4 bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none"
                    spellCheck={false}
                  />
                )}
                {activeCodeTab === 'css' && (
                  <textarea
                    value={codeCss}
                    onChange={(e) => setCodeCss(e.target.value)}
                    className="w-full h-[220px] p-4 bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none"
                    spellCheck={false}
                  />
                )}
                {activeCodeTab === 'js' && (
                  <textarea
                    value={codeJs}
                    onChange={(e) => setCodeJs(e.target.value)}
                    className="w-full h-[220px] p-4 bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none"
                    spellCheck={false}
                  />
                )}
              </div>

              {/* Split Live Sandbox Preview */}
              <div className="border-t border-slate-800 bg-[#0f172a]">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#0c1220] text-xs font-medium text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">Interactive Runtime Output</span>
                    <span className="text-slate-500 font-mono">· Sandboxed Sandbox Iframe</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Auto-isolated</span>
                </div>

                <div className="p-4 bg-[#090d16]">
                  <iframe
                    key={previewKey}
                    title="Live Code Preview"
                    srcDoc={assembledSrcDoc}
                    className="w-full h-[260px] bg-[#090d16] rounded-lg border border-slate-800"
                    sandbox="allow-scripts allow-modals"
                  />
                </div>

                {/* Console Output Bar */}
                <div className="px-4 py-2.5 bg-[#080b12] border-t border-slate-800 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-semibold text-slate-300">SANDBOX TELEMETRY LOGS</span>
                    <button
                      onClick={() => setConsoleLogs([])}
                      className="text-[11px] text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      Clear Log
                    </button>
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto text-[11px] text-slate-300">
                    {consoleLogs.map((log, i) => (
                      <div key={i} className="leading-tight">
                        <span className="text-sky-500 mr-2">›</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Zone: Conductor Control Deck (5 Cols on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
            {/* Deck Tabs */}
            <div className="flex items-center border-b border-slate-800 bg-[#0c1220] px-2">
              <button
                onClick={() => setDeckTab('agenda')}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  deckTab === 'agenda'
                    ? 'border-sky-500 text-sky-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>Class Agenda</span>
              </button>
              <button
                onClick={() => setDeckTab('poll')}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  deckTab === 'poll'
                    ? 'border-sky-500 text-sky-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Concept Pulse</span>
              </button>
              <button
                onClick={() => setDeckTab('questions')}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  deckTab === 'questions'
                    ? 'border-sky-500 text-sky-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Q&A Queue ({session.questions.filter((q) => q.status !== 'resolved').length})</span>
              </button>
              <button
                onClick={() => setDeckTab('notes')}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                  deckTab === 'notes'
                    ? 'border-sky-500 text-sky-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Chalkboard</span>
              </button>
            </div>

            {/* Deck Body */}
            <div className="p-4 sm:p-5">
              {deckTab === 'agenda' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Active Syllabus Milestones</span>
                    <span className="font-mono tabular-nums text-sky-400 font-medium">
                      {session.agenda.filter((a) => a.completed).length} / {session.agenda.length} completed
                    </span>
                  </div>

                  <div className="space-y-2">
                    {session.agenda.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleAgendaItem(item.id)}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                          item.completed
                            ? 'bg-[#090d16]/60 border-slate-800/80 text-slate-500'
                            : 'bg-[#090d16] border-slate-800 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 text-sky-400 cursor-pointer focus:outline-none"
                        >
                          {item.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span
                              className={`font-medium ${
                                item.completed ? 'line-through text-slate-500' : 'text-slate-200'
                              }`}
                            >
                              {item.title}
                            </span>
                            <span className="font-mono text-slate-400 tabular-nums shrink-0">
                              {item.time}
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-[11px] text-slate-400 mt-1">{item.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    Tip: Click any agenda item to toggle completion status as you progress through the live class.
                  </p>
                </div>
              )}

              {deckTab === 'poll' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-sky-400 uppercase tracking-wider font-mono">
                        Comprehension Check
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Interactive instant polling for active fellows
                      </p>
                    </div>
                    <button
                      onClick={handleResetPoll}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Reset Votes
                    </button>
                  </div>

                  <div className="p-3 bg-[#090d16] border border-slate-800 rounded-lg">
                    <p className="text-sm font-medium text-slate-200 leading-snug">
                      {session.currentPoll.question}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {session.currentPoll.options.map((opt) => {
                      const total = session.currentPoll.totalResponses || 1;
                      const pct = Math.round((opt.votes / total) * 100);
                      const isVoted = session.currentPoll.userVotedOptionId === opt.id;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleVotePoll(opt.id)}
                          className={`relative p-3 rounded-lg border overflow-hidden transition-all cursor-pointer ${
                            isVoted
                              ? 'bg-sky-950/40 border-sky-600/70'
                              : 'bg-[#090d16] border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {/* Progress bar background fill */}
                          <div
                            className="absolute inset-0 bg-sky-500/15 transition-all duration-300 pointer-events-none"
                            style={{ width: `${pct}%` }}
                          />

                          <div className="relative flex items-center justify-between gap-3 text-xs">
                            <span className={`font-medium ${isVoted ? 'text-sky-300' : 'text-slate-300'}`}>
                              {opt.text}
                            </span>
                            <div className="flex items-center gap-2 shrink-0 font-mono tabular-nums">
                              <span className="text-slate-400 text-[11px]">{opt.votes} votes</span>
                              <span className={`font-semibold ${isVoted ? 'text-sky-400' : 'text-slate-200'}`}>
                                {pct}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>
                      Total Responses: <strong className="font-mono tabular-nums text-white">{session.currentPoll.totalResponses}</strong>
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">Real-time cohort synchronization</span>
                  </div>
                </div>
              )}

              {deckTab === 'questions' && (
                <div className="space-y-4">
                  {/* Add question form */}
                  <form onSubmit={handleAddQuestion} className="flex gap-2">
                    <input
                      type="text"
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="Ask the conductor or submit inquiry..."
                      className="flex-1 bg-[#090d16] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post</span>
                    </button>
                  </form>

                  {/* Question items */}
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {session.questions.map((q) => (
                      <div
                        key={q.id}
                        className={`p-3 rounded-lg border text-xs space-y-2 ${
                          q.status === 'answering'
                            ? 'bg-sky-950/30 border-sky-600/60'
                            : q.status === 'resolved'
                            ? 'bg-[#090d16]/50 border-slate-800/60 opacity-60'
                            : 'bg-[#090d16] border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-medium text-slate-300">{q.studentName}</span>
                          <span className="font-mono tabular-nums">{q.timestamp}</span>
                        </div>

                        <p className="text-slate-200 leading-relaxed">{q.question}</p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                          <button
                            onClick={() => handleUpvoteQuestion(q.id)}
                            className="inline-flex items-center gap-1 text-slate-400 hover:text-sky-400 font-mono cursor-pointer transition-colors"
                          >
                            <ArrowUp className="w-3 h-3" />
                            <span className="tabular-nums font-semibold">{q.votes}</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {q.status !== 'resolved' && (
                              <button
                                onClick={() =>
                                  handleSetQuestionStatus(
                                    q.id,
                                    q.status === 'answering' ? 'queued' : 'answering'
                                  )
                                }
                                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                                  q.status === 'answering'
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:text-white'
                                }`}
                              >
                                {q.status === 'answering' ? 'Answering Now' : 'Discuss'}
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleSetQuestionStatus(
                                  q.id,
                                  q.status === 'resolved' ? 'queued' : 'resolved'
                                )
                              }
                              className="px-2 py-0.5 bg-slate-800 text-slate-400 hover:text-white rounded text-[10px] transition-colors cursor-pointer"
                            >
                              {q.status === 'resolved' ? 'Reopen' : 'Resolve'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {deckTab === 'notes' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Shared Conductor Chalkboard</span>
                    <span className="text-[11px] font-mono text-slate-500">Auto-saved to cohort log</span>
                  </div>
                  <textarea
                    value={liveNotes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    rows={12}
                    className="w-full p-3 bg-[#090d16] border border-slate-800 rounded-lg text-xs font-mono text-slate-200 leading-relaxed resize-none focus:outline-none focus:border-sky-500"
                    placeholder="Type key takeaway architectural points, memory formulas, or assignments..."
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(liveNotes);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-md font-medium cursor-pointer transition-colors"
                    >
                      Copy Notes to Clipboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
