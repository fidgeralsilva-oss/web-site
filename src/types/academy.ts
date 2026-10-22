export type NavigationTab =
  | 'live-studio'
  | 'cohort-tracks'
  | 'lab-sandbox'
  | 'rubric-grading'
  | 'student-registry';

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  completed: boolean;
  notes?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface ComprehensionPoll {
  id: string;
  question: string;
  options: PollOption[];
  active: boolean;
  totalResponses: number;
  userVotedOptionId?: string;
}

export interface StudentQuestion {
  id: string;
  studentName: string;
  studentAvatar?: string;
  timestamp: string;
  question: string;
  votes: number;
  status: 'queued' | 'answering' | 'resolved';
}

export interface CodeExercisePreset {
  id: string;
  title: string;
  summary: string;
  codeHtml: string;
  codeCss: string;
  codeJs: string;
}

export interface LiveSessionState {
  id: string;
  trackId: string;
  title: string;
  moduleName: string;
  instructorName: string;
  instructorTitle: string;
  instructorAvatar: string;
  roomStatus: 'live' | 'paused' | 'concluded';
  elapsedSeconds: number;
  attendeesCount: number;
  handRaisesCount: number;
  broadcastMode: 'interactive-code' | 'presentation' | 'breakout-lab';
  agenda: AgendaItem[];
  currentPoll: ComprehensionPoll;
  questions: StudentQuestion[];
  notes: string;
}

export interface SyllabusModule {
  id: string;
  weekNumber: number;
  title: string;
  summary: string;
  topics: string[];
  durationHours: number;
  status: 'completed' | 'in-progress' | 'upcoming';
  starterRepoUrl?: string;
  lectureRecordingUrl?: string;
  projectDeliverable: string;
}

export interface CohortTrack {
  id: string;
  title: string;
  tagline: string;
  cohortCode: string;
  durationWeeks: number;
  currentWeek: number;
  fellowsEnrolled: number;
  averageAttendancePct: number;
  completionRatePct: number;
  coverImage: string;
  modules: SyllabusModule[];
}

export interface RubricLevel {
  score: number;
  label: string;
  description: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  weightPct: number;
  levels: RubricLevel[];
}

export interface ProjectSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  projectTitle: string;
  trackId: string;
  submissionDate: string;
  githubUrl: string;
  demoUrl: string;
  status: 'pending' | 'graded';
  scores: Record<string, number>; // criterionId -> score (1..4)
  totalScorePct: number;
  feedbackNotes: string;
  honorsDistinction: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  trackId: string;
  cohortCode: string;
  enrolledDate: string;
  attendancePct: number;
  completedLabsCount: number;
  totalLabsCount: number;
  averageGradePct: number;
  status: 'active' | 'graduated' | 'on-leave';
  capstoneStatus: 'pending' | 'in-progress' | 'passed' | 'honors';
}
