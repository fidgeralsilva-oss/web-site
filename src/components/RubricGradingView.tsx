import React, { useState } from 'react';
import { ProjectSubmission, RubricCriterion } from '../types/academy';
import {
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  FolderGit2,
  Send,
  Sliders,
  Check,
} from 'lucide-react';

interface RubricGradingViewProps {
  criteria: RubricCriterion[];
  submissions: ProjectSubmission[];
  onUpdateSubmission: (updatedSub: ProjectSubmission) => void;
}

export const RubricGradingView: React.FC<RubricGradingViewProps> = ({
  criteria,
  submissions,
  onUpdateSubmission,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'graded'>('all');
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.id || '');
  const [activeScores, setActiveScores] = useState<Record<string, number>>(
    submissions[0]?.scores || {}
  );
  const [feedback, setFeedback] = useState<string>(submissions[0]?.feedbackNotes || '');
  const [honors, setHonors] = useState<boolean>(submissions[0]?.honorsDistinction || false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const selectedSub = submissions.find((s) => s.id === selectedSubId) || submissions[0];

  const handleSelectSubmission = (sub: ProjectSubmission) => {
    setSelectedSubId(sub.id);
    setActiveScores(sub.scores);
    setFeedback(sub.feedbackNotes);
    setHonors(sub.honorsDistinction);
    setSavedNotice(false);
  };

  const handleSetCriterionScore = (critId: string, score: number) => {
    setActiveScores((prev) => ({
      ...prev,
      [critId]: score,
    }));
    setSavedNotice(false);
  };

  // Compute weighted score total
  const computeTotalWeightedScore = (): number => {
    let totalScore = 0;
    criteria.forEach((crit) => {
      const score = activeScores[crit.id] || 1;
      const pct = (score / 4) * crit.weightPct;
      totalScore += pct;
    });
    return Math.round(totalScore);
  };

  const computedTotal = computeTotalWeightedScore();

  const handleSaveEvaluation = () => {
    if (!selectedSub) return;
    const updated: ProjectSubmission = {
      ...selectedSub,
      scores: activeScores,
      totalScorePct: computedTotal,
      feedbackNotes: feedback,
      honorsDistinction: computedTotal >= 90 || honors,
      status: 'graded',
    };
    onUpdateSubmission(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const filteredSubs = submissions.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-mono text-sky-400">
            W3C RUBRIC ASSESSMENT & BENCHMARKS
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Student Project Rubric Evaluation
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Conduct standardized multi-criteria evaluations across architecture, accessibility, performance, and type safety.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center p-1 bg-[#0f172a] border border-slate-800 rounded-lg">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Submissions ({submissions.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Review ({submissions.filter((s) => s.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('graded')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterStatus === 'graded'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Graded ({submissions.filter((s) => s.status === 'graded').length})
          </button>
        </div>
      </div>

      {/* Main Grid: Submissions List (4 Cols) + Evaluation Workbench (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Submissions List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Candidate Submissions
          </div>

          <div className="space-y-2.5">
            {filteredSubs.map((sub) => {
              const isSelected = sub.id === selectedSub?.id;
              const isGraded = sub.status === 'graded';

              return (
                <div
                  key={sub.id}
                  onClick={() => handleSelectSubmission(sub)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#0f172a] border-sky-500 shadow-md ring-1 ring-sky-500/20'
                      : 'bg-[#0f172a]/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{sub.studentName}</span>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {sub.submissionDate}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium line-clamp-1">
                    {sub.projectTitle}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {isGraded ? (
                        <span className="text-emerald-400 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Graded</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Pending Review</span>
                        </span>
                      )}
                      {sub.honorsDistinction && (
                        <>
                          <span className="text-slate-600" aria-hidden="true">·</span>
                          <span className="text-amber-300 font-medium">Honors</span>
                        </>
                      )}
                    </div>

                    <span className="font-mono tabular-nums font-bold text-sky-400">
                      {sub.totalScorePct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Rubric Matrix & Feedback Form */}
        {selectedSub ? (
          <div className="lg:col-span-8 bg-[#0f172a] border border-slate-800 rounded-xl p-6 space-y-6">
            {/* Submission Top Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                  <span>FELLOW ID: {selectedSub.studentId}</span>
                  <span aria-hidden="true">·</span>
                  <span>SUBMITTED {selectedSub.submissionDate}</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {selectedSub.projectTitle}
                </h3>
                <div className="text-xs text-slate-400">
                  Fellow: <strong className="text-slate-200">{selectedSub.studentName}</strong> ({selectedSub.studentEmail})
                </div>
              </div>

              {/* Score Metric Card */}
              <div className="flex items-center gap-4 bg-[#090d16] border border-slate-800 px-4 py-3 rounded-lg shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Aggregate Score</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-sky-400">
                    {computedTotal}%
                  </div>
                </div>
                {computedTotal >= 90 && (
                  <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
                    <Award className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>

            {/* Submission Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <a
                href={selectedSub.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white bg-[#090d16] px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Source Repository</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <a
                href={selectedSub.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white bg-[#090d16] px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Staging URL</span>
              </a>
            </div>

            {/* Rubric Criteria Evaluation Matrix */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Evaluation Criteria Matrix
                </h4>
                <span className="text-[11px] text-slate-500">
                  Select performance level per rubric dimension
                </span>
              </div>

              <div className="space-y-4">
                {criteria.map((crit) => {
                  const currentScore = activeScores[crit.id] || 1;

                  return (
                    <div
                      key={crit.id}
                      className="p-4 bg-[#090d16] border border-slate-800 rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-semibold text-white">
                          {crit.name}
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-slate-400">Weight: {crit.weightPct}%</span>
                          <span className="text-slate-600" aria-hidden="true">·</span>
                          <span className="text-sky-400 font-bold tabular-nums">
                            {currentScore} / 4
                          </span>
                        </div>
                      </div>

                      {/* 4 Score Level Selectors */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        {crit.levels.map((lvl) => {
                          const isLevelSelected = currentScore === lvl.score;

                          return (
                            <button
                              key={lvl.score}
                              type="button"
                              onClick={() => handleSetCriterionScore(crit.id, lvl.score)}
                              className={`p-2.5 rounded-md text-left border transition-all cursor-pointer flex flex-col justify-between ${
                                isLevelSelected
                                  ? 'bg-sky-950/50 border-sky-500 ring-1 ring-sky-500/30'
                                  : 'bg-[#0f172a] border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span
                                  className={`font-semibold ${
                                    isLevelSelected ? 'text-sky-300' : 'text-slate-300'
                                  }`}
                                >
                                  {lvl.label}
                                </span>
                                <span className="font-mono tabular-nums text-[11px] text-slate-500">
                                  {lvl.score} pt
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-3 leading-tight">
                                {lvl.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feedback & Honors Section */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Conductor Evaluator Feedback
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={honors}
                    onChange={(e) => setHonors(e.target.checked)}
                    className="rounded border-slate-700 text-sky-600 focus:ring-0"
                  />
                  <span>Distinction / Honors Recommendation</span>
                </label>
              </div>

              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                placeholder="Compose qualitative feedback, highlight architecture strengths, and outline areas for remediation..."
                className="w-full p-3 bg-[#090d16] border border-slate-800 rounded-lg text-xs text-slate-200 leading-relaxed resize-none focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400">
                {savedNotice && (
                  <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Evaluation saved to academic records.</span>
                  </span>
                )}
              </div>

              <button
                onClick={handleSaveEvaluation}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit & Finalize Grade</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-[#0f172a] border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            Select a student submission to conduct rubric evaluation.
          </div>
        )}
      </div>
    </div>
  );
};
