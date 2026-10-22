/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LiveConductionStudio } from './components/LiveConductionStudio';
import { CohortTracksView } from './components/CohortTracksView';
import { LabSandbox } from './components/LabSandbox';
import { RubricGradingView } from './components/RubricGradingView';
import { StudentRegistryView } from './components/StudentRegistryView';
import {
  NavigationTab,
  LiveSessionState,
  CohortTrack,
  ProjectSubmission,
  RubricCriterion,
  Student,
  SyllabusModule,
} from './types/academy';
import {
  INITIAL_LIVE_SESSION,
  INITIAL_COHORT_TRACKS,
  INITIAL_RUBRIC_CRITERIA,
  INITIAL_SUBMISSIONS,
  INITIAL_STUDENTS,
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('live-studio');
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);

  // Persistent live session state
  const [session, setSession] = useState<LiveSessionState>(() => {
    const saved = localStorage.getItem('web_academy_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_LIVE_SESSION;
  });

  // Persistent tracks state
  const [tracks, setTracks] = useState<CohortTrack[]>(INITIAL_COHORT_TRACKS);

  // Persistent rubric criteria
  const [criteria] = useState<RubricCriterion[]>(INITIAL_RUBRIC_CRITERIA);

  // Persistent project submissions
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>(() => {
    const saved = localStorage.getItem('web_academy_submissions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_SUBMISSIONS;
  });

  // Persistent students roster
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('web_academy_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_STUDENTS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('web_academy_session', JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem('web_academy_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('web_academy_students', JSON.stringify(students));
  }, [students]);

  const handleUpdateSession = (updated: Partial<LiveSessionState>) => {
    setSession((prev) => ({ ...prev, ...updated }));
  };

  const handleToggleLive = () => {
    setIsLiveActive(!isLiveActive);
    setSession((prev) => ({
      ...prev,
      roomStatus: !isLiveActive ? 'live' : 'concluded',
    }));
  };

  const handleConductModule = (module: SyllabusModule, track: CohortTrack) => {
    setSession((prev) => ({
      ...prev,
      title: `Lecture 0${module.weekNumber}: ${module.title}`,
      moduleName: `Week 0${module.weekNumber} · ${module.title}`,
      trackId: track.id,
      roomStatus: 'live',
      agenda: module.topics.map((top, idx) => ({
        id: `ag-mod-${idx}`,
        time: `${13 + Math.floor((idx * 25) / 60)}:${String((idx * 25) % 60).padStart(2, '0')}`,
        title: top,
        completed: idx === 0,
      })),
    }));
    setIsLiveActive(true);
    setActiveTab('live-studio');
  };

  const handleUpdateSubmission = (updatedSub: ProjectSubmission) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
    );
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-white">
      {/* Top Bar Contract (Wordmark - 5 single-line links - 1 Primary Action) */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLiveActive={isLiveActive}
        onToggleLive={handleToggleLive}
      />

      {/* Main Viewport Container (Desktop baseline 1440px wide max-w-7xl) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'live-studio' && (
          <LiveConductionStudio
            session={session}
            onUpdateSession={handleUpdateSession}
            onNavigateToSandbox={() => setActiveTab('lab-sandbox')}
          />
        )}

        {activeTab === 'cohort-tracks' && (
          <CohortTracksView
            tracks={tracks}
            onConductModule={handleConductModule}
          />
        )}

        {activeTab === 'lab-sandbox' && <LabSandbox />}

        {activeTab === 'rubric-grading' && (
          <RubricGradingView
            criteria={criteria}
            submissions={submissions}
            onUpdateSubmission={handleUpdateSubmission}
          />
        )}

        {activeTab === 'student-registry' && (
          <StudentRegistryView
            students={students}
            tracks={tracks}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
          />
        )}
      </main>

      {/* Quiet, compliant footer */}
      <footer className="border-t border-slate-800/80 bg-[#070a12] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-400">Web Academy Conduction</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Standardized Architectural Cohort Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('live-studio')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Studio
            </button>
            <button
              onClick={() => setActiveTab('cohort-tracks')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Syllabus
            </button>
            <button
              onClick={() => setActiveTab('lab-sandbox')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Sandbox
            </button>
            <button
              onClick={() => setActiveTab('rubric-grading')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Rubrics
            </button>
            <button
              onClick={() => setActiveTab('student-registry')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Roster
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
