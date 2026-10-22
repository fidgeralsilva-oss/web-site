import React, { useState } from 'react';
import { Student, CohortTrack } from '../types/academy';
import { CertificateModal } from './CertificateModal';
import {
  Users,
  Search,
  UserPlus,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';

interface StudentRegistryViewProps {
  students: Student[];
  tracks: CohortTrack[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
}

export const StudentRegistryView: React.FC<StudentRegistryViewProps> = ({
  students,
  tracks,
  onAddStudent,
  onUpdateStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Add fellow form state
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newTrackId, setNewTrackId] = useState<string>(tracks[0]?.id || 'track-fullstack');

  const filteredStudents = students.filter((s) => {
    const matchesTrack = trackFilter === 'all' || s.trackId === trackFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  const avgAttendance =
    students.length > 0
      ? (
          students.reduce((acc, curr) => acc + curr.attendancePct, 0) /
          students.length
        ).toFixed(1)
      : '0.0';

  const avgGrade =
    students.length > 0
      ? (
          students.reduce((acc, curr) => acc + curr.averageGradePct, 0) /
          students.length
        ).toFixed(1)
      : '0.0';

  const honorsCount = students.filter(
    (s) => s.capstoneStatus === 'honors' || s.averageGradePct >= 95
  ).length;

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const chosenTrack = tracks.find((t) => t.id === newTrackId);
    const newStu: Student = {
      id: `stu-${Date.now().toString().slice(-4)}`,
      name: newName.trim(),
      email: newEmail.trim(),
      trackId: newTrackId,
      cohortCode: chosenTrack ? chosenTrack.cohortCode : 'COHORT-2026-ALPHA',
      enrolledDate: new Date().toISOString().split('T')[0],
      attendancePct: 100,
      completedLabsCount: 0,
      totalLabsCount: 14,
      averageGradePct: 90,
      status: 'active',
      capstoneStatus: 'in-progress',
    };

    onAddStudent(newStu);
    setNewName('');
    setNewEmail('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-mono text-sky-400">
            COHORT ROSTER & CERTIFICATE CONDUCTION
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Enrolled Fellows Registry
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track individual fellow lab completions, attendance rates, rubric scoring, and issue verifiable graduation credentials.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shrink-0 shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Enroll New Fellow</span>
        </button>
      </div>

      {/* Cohort Metric Strip (Tabular numbers, no slop pills) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0f172a] border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400">Total Enrolled Fellows</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
            {students.length}
          </div>
        </div>
        <div className="p-4 bg-[#0f172a] border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400">Cohort Avg Attendance</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
            {avgAttendance}%
          </div>
        </div>
        <div className="p-4 bg-[#0f172a] border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400">Cohort Avg Grade</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-sky-400 mt-1">
            {avgGrade}%
          </div>
        </div>
        <div className="p-4 bg-[#0f172a] border border-slate-800 rounded-xl">
          <div className="text-xs text-slate-400">Honors Standing</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-400 mt-1">
            {honorsCount} Fellows
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f172a] border border-slate-800 rounded-xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fellow name or email..."
            className="w-full pl-9 pr-3 py-2 bg-[#090d16] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Filter Track:</span>
          <div className="flex items-center p-1 bg-[#090d16] border border-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setTrackFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                trackFilter === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            {tracks.map((t) => (
              <button
                key={t.id}
                onClick={() => setTrackFilter(t.id)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  trackFilter === t.id
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.cohortCode.replace('COHORT-2026-', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fellows Table (High-Density Tabular Layout) */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0c1220] border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-medium">FELLOW NAME</th>
                <th className="py-3 px-4 font-medium">COHORT TRACK</th>
                <th className="py-3 px-4 font-medium text-right">ATTENDANCE</th>
                <th className="py-3 px-4 font-medium text-right">LABS COMPLETED</th>
                <th className="py-3 px-4 font-medium text-right">GRADE AVG</th>
                <th className="py-3 px-4 font-medium">CAPSTONE STATUS</th>
                <th className="py-3 px-4 font-medium text-right">CREDENTIAL ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((stu) => {
                  const isHonors = stu.capstoneStatus === 'honors';

                  return (
                    <tr
                      key={stu.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{stu.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{stu.email}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {stu.cohortCode}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-medium text-slate-200">
                        {stu.attendancePct}%
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                        {stu.completedLabsCount} / {stu.totalLabsCount}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-sky-400">
                        {stu.averageGradePct}%
                      </td>

                      <td className="py-3.5 px-4">
                        {isHonors ? (
                          <span className="text-amber-400 font-medium inline-flex items-center gap-1 font-mono text-[11px]">
                            <Award className="w-3.5 h-3.5" />
                            <span>Honors Standing</span>
                          </span>
                        ) : stu.capstoneStatus === 'passed' ? (
                          <span className="text-emerald-400 font-medium inline-flex items-center gap-1 font-mono text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Passed</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">
                            In Progress
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedStudentForCert(stu)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 font-medium rounded-md transition-colors cursor-pointer text-xs"
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>View Credential</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No fellows found matching query "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fellow Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Enroll New Fellow</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-3 py-2 bg-[#090d16] border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Fellow Academy Email
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. maya.lin@academy.dev"
                  className="w-full px-3 py-2 bg-[#090d16] border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Cohort Track
                </label>
                <select
                  value={newTrackId}
                  onChange={(e) => setNewTrackId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090d16] border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.cohortCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-semibold cursor-pointer transition-colors"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credential Certificate Modal */}
      {selectedStudentForCert && (
        <CertificateModal
          student={selectedStudentForCert}
          track={tracks.find((t) => t.id === selectedStudentForCert.trackId)}
          onClose={() => setSelectedStudentForCert(null)}
        />
      )}
    </div>
  );
};
