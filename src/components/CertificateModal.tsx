import React from 'react';
import { Student, CohortTrack } from '../types/academy';
import { Award, CheckCircle2, Printer, X, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  student: Student;
  track?: CohortTrack;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  student,
  track,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const trackTitle = track ? track.title : 'Full-Stack Web Systems & Cloud Architecture';
  const verificationCode = `ACAD-2026-${student.id.toUpperCase()}-${Math.floor(
    student.averageGradePct * 100
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative max-w-3xl w-full bg-[#0b101d] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-10 text-white">
        {/* Top Close & Print Controls */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>VERIFIED ACADEMIC CREDENTIAL ISSUANCE</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Frame Content */}
        <div className="mt-6 border-2 border-slate-700/60 rounded-xl p-8 sm:p-12 bg-gradient-to-b from-[#0f172a] to-[#090d16] text-center relative overflow-hidden">
          {/* Subtle decorative geometric background lines */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          <div className="relative space-y-6">
            {/* Header Wordmark */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono tracking-widest uppercase text-sky-400 font-semibold">
                WEB ACADEMY OF ADVANCED SOFTWARE ENGINEERING
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
                Certificate of Fellowship Conduction
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              This official parchment certifies that the candidate has successfully completed the rigorous curriculum, live architectural labs, and project conduction requirements.
            </p>

            {/* Recipient */}
            <div className="py-4">
              <div className="text-xs text-slate-400 uppercase tracking-widest font-mono">
                Awarded To
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1 underline decoration-sky-500/50 underline-offset-8">
                {student.name}
              </div>
            </div>

            {/* Track Name */}
            <div className="space-y-1">
              <div className="text-xs text-slate-400">For Mastery in the Engineering Discipline of</div>
              <div className="text-lg font-semibold text-sky-300">
                {trackTitle}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Cohort {student.cohortCode} · Grade Average: {student.averageGradePct}% · Attendance: {student.attendancePct}%
              </div>
            </div>

            {/* Honors Distinction Stamp */}
            {(student.capstoneStatus === 'honors' || student.averageGradePct >= 90) && (
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Passed with Academy Honors Distinction</span>
              </div>
            )}

            {/* Signatures & Verification */}
            <div className="pt-8 border-t border-slate-800 grid grid-cols-2 gap-8 items-end text-xs text-slate-400">
              <div className="text-left space-y-1">
                <div className="font-serif italic text-base text-slate-200">
                  Elena Rostova
                </div>
                <div className="text-[11px] text-slate-400">Lead Academic Conductor</div>
                <div className="text-[10px] text-slate-500 font-mono">Principal Platform Engineer</div>
              </div>

              <div className="text-right space-y-1">
                <div className="font-mono text-[11px] text-sky-400 font-medium">
                  {verificationCode}
                </div>
                <div className="text-[11px] text-slate-400">Credential Verification ID</div>
                <div className="text-[10px] text-slate-500 font-mono">Status: Immutable & Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
