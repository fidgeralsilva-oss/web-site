import React from 'react';
import { NavigationTab } from '../types/academy';
import { Radio } from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  isLiveActive: boolean;
  onToggleLive: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isLiveActive,
  onToggleLive,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onTabChange('live-studio')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-sky-400 transition-colors whitespace-nowrap shrink-0">
            Web Academy Conduction
          </span>
        </button>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onTabChange('live-studio')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'live-studio'
                ? 'border-sky-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Conduction
          </button>
          <button
            onClick={() => onTabChange('cohort-tracks')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'cohort-tracks'
                ? 'border-sky-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Cohort Tracks
          </button>
          <button
            onClick={() => onTabChange('lab-sandbox')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'lab-sandbox'
                ? 'border-sky-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Lab Sandbox
          </button>
          <button
            onClick={() => onTabChange('rubric-grading')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'rubric-grading'
                ? 'border-sky-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Rubric Evaluation
          </button>
          <button
            onClick={() => onTabChange('student-registry')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'student-registry'
                ? 'border-sky-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Student Registry
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleLive}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              isLiveActive
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveActive ? 'text-white' : 'text-sky-200'}`} />
            <span>{isLiveActive ? 'Conduction Active' : 'Broadcast Live Session'}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav fallback bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-xs overflow-x-auto gap-4">
        <button
          onClick={() => onTabChange('live-studio')}
          className={`whitespace-nowrap py-1 ${activeTab === 'live-studio' ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}
        >
          Live Studio
        </button>
        <button
          onClick={() => onTabChange('cohort-tracks')}
          className={`whitespace-nowrap py-1 ${activeTab === 'cohort-tracks' ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}
        >
          Tracks
        </button>
        <button
          onClick={() => onTabChange('lab-sandbox')}
          className={`whitespace-nowrap py-1 ${activeTab === 'lab-sandbox' ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}
        >
          Sandbox
        </button>
        <button
          onClick={() => onTabChange('rubric-grading')}
          className={`whitespace-nowrap py-1 ${activeTab === 'rubric-grading' ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}
        >
          Rubrics
        </button>
        <button
          onClick={() => onTabChange('student-registry')}
          className={`whitespace-nowrap py-1 ${activeTab === 'student-registry' ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}
        >
          Fellows
        </button>
      </div>
    </header>
  );
};
