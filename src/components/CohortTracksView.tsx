import React, { useState } from 'react';
import { CohortTrack, SyllabusModule } from '../types/academy';
import {
  Calendar,
  Clock,
  CheckCircle2,
  PlayCircle,
  FileText,
  FolderGit2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface CohortTracksViewProps {
  tracks: CohortTrack[];
  onConductModule: (module: SyllabusModule, track: CohortTrack) => void;
}

export const CohortTracksView: React.FC<CohortTracksViewProps> = ({
  tracks,
  onConductModule,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(tracks[0].id);
  const [selectedModule, setSelectedModule] = useState<SyllabusModule | null>(null);

  const currentTrack = tracks.find((t) => t.id === selectedTrackId) || tracks[0];

  return (
    <div className="space-y-8">
      {/* Track Selection Bar & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-mono text-sky-400">
            CURRICULUM ARCHITECTURE & SYLLABUS
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Web Academy Cohort Tracks
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Structured full-lifecycle engineering paths with production deliverables and rigorous rubric benchmarks.
          </p>
        </div>

        {/* Track Switcher Segmented Tabs */}
        <div className="flex items-center p-1 bg-[#0f172a] border border-slate-800 rounded-lg shrink-0">
          {tracks.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrackId(t.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                selectedTrackId === t.id
                  ? 'bg-sky-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.cohortCode}
            </button>
          ))}
        </div>
      </div>

      {/* Track Hero Banner with Generated Imagery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden p-6 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono">
            <span>{currentTrack.cohortCode}</span>
            <span aria-hidden="true">·</span>
            <span>{currentTrack.durationWeeks} WEEKS INTENSIVE</span>
            <span aria-hidden="true">·</span>
            <span>ACTIVE WEEK 0{currentTrack.currentWeek}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {currentTrack.title}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
            {currentTrack.tagline}
          </p>

          {/* Quantitative Metric Strip (Tabular Numerals, Anti-Slop Unboxed) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3 bg-[#090d16] border border-slate-800 rounded-lg">
              <div className="text-xs text-slate-400">Enrolled Fellows</div>
              <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
                {currentTrack.fellowsEnrolled}
              </div>
            </div>
            <div className="p-3 bg-[#090d16] border border-slate-800 rounded-lg">
              <div className="text-xs text-slate-400">Avg Attendance</div>
              <div className="text-lg font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
                {currentTrack.averageAttendancePct}%
              </div>
            </div>
            <div className="p-3 bg-[#090d16] border border-slate-800 rounded-lg">
              <div className="text-xs text-slate-400">Completion Pace</div>
              <div className="text-lg font-bold font-mono tabular-nums text-sky-400 mt-0.5">
                {currentTrack.completionRatePct}%
              </div>
            </div>
            <div className="p-3 bg-[#090d16] border border-slate-800 rounded-lg">
              <div className="text-xs text-slate-400">Current Milestone</div>
              <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
                W0{currentTrack.currentWeek} / 12
              </div>
            </div>
          </div>
        </div>

        {/* Visual asset */}
        <div className="lg:col-span-5 h-64 sm:h-72 rounded-lg overflow-hidden border border-slate-800 bg-[#090d16]">
          <img
            src={currentTrack.coverImage}
            alt={currentTrack.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Week-by-Week Syllabus Progression */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Syllabus Roadmap & Module Progression
            </h3>
            <p className="text-xs text-slate-400">
              Click any module to inspect deliverables, starter repositories, and launch conduction.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {currentTrack.modules.length} Modules Total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentTrack.modules.map((module) => {
            const isCompleted = module.status === 'completed';
            const isInProgress = module.status === 'in-progress';

            return (
              <div
                key={module.id}
                onClick={() => setSelectedModule(module)}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isInProgress
                    ? 'bg-[#0f172a] border-sky-500/80 shadow-md ring-1 ring-sky-500/20'
                    : isCompleted
                    ? 'bg-[#0f172a]/70 border-slate-800 hover:border-slate-700'
                    : 'bg-[#0f172a]/40 border-slate-800/80 hover:border-slate-700 opacity-80'
                }`}
              >
                <div>
                  {/* Status header (unboxed text) */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-sky-400 font-medium">
                      WEEK 0{module.weekNumber}
                    </span>
                    <div className="flex items-center gap-1.5 font-medium">
                      {isCompleted ? (
                        <span className="text-emerald-400 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
                      ) : isInProgress ? (
                        <span className="text-sky-400 inline-flex items-center gap-1">
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Active Conduction</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Upcoming</span>
                      )}
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span className="text-slate-400 font-mono tabular-nums">
                        {module.durationHours}h
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-semibold text-white group-hover:text-sky-400 transition-colors">
                    {module.title}
                  </h4>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {module.summary}
                  </p>

                  {/* Topics List */}
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400 font-mono">
                    {module.topics.map((t, idx) => (
                      <span key={idx} className="bg-[#090d16] px-2 py-0.5 rounded border border-slate-800/80">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 truncate max-w-[240px]">
                    <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{module.projectDeliverable}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium shrink-0">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Detail Modal / Drawer */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
                  <span>{currentTrack.cohortCode}</span>
                  <span aria-hidden="true">·</span>
                  <span>WEEK 0{selectedModule.weekNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedModule.durationHours} CONTACT HOURS</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {selectedModule.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Overview */}
            <div className="p-4 bg-[#090d16] border border-slate-800 rounded-lg text-xs leading-relaxed text-slate-300">
              {selectedModule.summary}
            </div>

            {/* Core Competencies Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Key Learning Outcomes & Competencies
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                {selectedModule.topics.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-[#090d16] border border-slate-800/80 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Deliverable Spec */}
            <div className="p-4 bg-sky-950/20 border border-sky-800/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-sky-300 font-mono">
                  WEEKLY GRADED DELIVERABLE
                </span>
                <span className="text-[11px] text-slate-400">Rubric Weighted</span>
              </div>
              <p className="text-sm font-medium text-white">
                {selectedModule.projectDeliverable}
              </p>
              <p className="text-xs text-slate-400">
                Fellows must commit working repository tests, clean architecture notes, and host a live preview build before end of sprint.
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 hover:text-slate-200 cursor-pointer">
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Starter Repo</span>
                </span>
                <span className="inline-flex items-center gap-1 hover:text-slate-200 cursor-pointer">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lecture Slides (PDF)</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onConductModule(selectedModule, currentTrack);
                    setSelectedModule(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <span>Launch Live Conduction</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
