'use client';

import React from 'react';
import { 
  Bot,
  Stethoscope,
  Sprout,
  Lightbulb, 
  Layers, 
  Code2, 
  HelpCircle, 
  History, 
  Trash2, 
  ChevronRight,
  Sparkles,
  Award,
  Cpu,
  ShieldCheck
} from 'lucide-react';

export type StudioMode = 
  | 'agent'
  | 'healthcare'
  | 'agricivic'
  | 'explainer' 
  | 'flashcards' 
  | 'codearchitect' 
  | 'quizmaster' 
  | 'chat';

export interface HistoryItem {
  id: string;
  prompt: string;
  mode: StudioMode;
  result: string;
  timestamp: string;
}

interface SidebarProps {
  activeMode: StudioMode;
  setActiveMode: (mode: StudioMode) => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMode,
  setActiveMode,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  const modes: { id: StudioMode; label: string; icon: React.ElementType; desc: string; color: string; track?: string }[] = [
    {
      id: 'agent',
      label: 'Autonomous Agent Hub',
      icon: Bot,
      desc: 'Tool calling & Mermaid flowcharts',
      color: 'text-cyan-400',
      track: 'Autonomous Agent Engine',
    },
    {
      id: 'healthcare',
      label: 'MedGemma Clinical Triage',
      icon: Stethoscope,
      desc: 'Superbug & stewardship triage',
      color: 'text-rose-400',
      track: 'GenAI Healthcare Engine',
    },
    {
      id: 'agricivic',
      label: 'AgriCivic Diagnostic',
      icon: Sprout,
      desc: 'Crop foliage & soil health advisor',
      color: 'text-emerald-400',
      track: 'GenAI Impact Engine',
    },
    {
      id: 'explainer',
      label: 'Concept Explainer',
      icon: Lightbulb,
      desc: 'Mental models & analogies',
      color: 'text-amber-400',
    },
    {
      id: 'flashcards',
      label: '3D Flashcard Deck',
      icon: Layers,
      desc: 'Active recall Q&A decks',
      color: 'text-purple-400',
    },
    {
      id: 'codearchitect',
      label: 'Code Architect',
      icon: Code2,
      desc: 'Refactor, Big-O & vulnerability review',
      color: 'text-blue-400',
    },
    {
      id: 'quizmaster',
      label: 'Quiz Master',
      icon: HelpCircle,
      desc: 'Self-assessment quizzes',
      color: 'text-indigo-400',
    },
  ];

  return (
    <aside className="w-full lg:w-72 xl:w-80 glass-panel rounded-2xl p-4 flex flex-col gap-5 shrink-0 border border-white/10">
      
      {/* Professional Engine Banner */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/60 via-blue-950/60 to-cyan-950/60 border border-purple-500/30">
        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 mb-1">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Enterprise AI Architecture</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-snug">
          Dual Engine Core: Integrates <strong className="text-cyan-300">Autonomous Tool Agents</strong> & <strong className="text-emerald-300">Clinical Impact Diagnostics</strong>.
        </p>
      </div>

      {/* Studio Modes */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Gemma Intelligence Engines</span>
        </h2>
        
        <div className="flex flex-col gap-1.5">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = activeMode === m.id;

            return (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 border ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/25 via-purple-600/25 to-transparent border-purple-500/60 shadow-md text-white'
                    : 'bg-slate-900/40 border-white/5 text-slate-300 hover:bg-slate-800/50 hover:border-white/10'
                }`}
              >
                <div className={`p-1.5 rounded-lg bg-slate-950/60 ${m.color} shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs tracking-tight">{m.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                    {m.desc}
                  </p>
                  {m.track && (
                    <span className="inline-block text-[9px] font-mono font-semibold px-1.5 py-0.2 mt-1 rounded bg-slate-950/80 text-cyan-300 border border-cyan-500/20">
                      {m.track}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Session History */}
      <div className="flex-1 flex flex-col min-h-[140px] max-h-[220px]">
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agentic History</span>
          </h2>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-[11px] text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
              title="Clear session history"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
          {history.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-500 italic bg-slate-950/30 rounded-xl border border-white/5 px-2">
              No recent sessions. Select an engine above!
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectHistory(item)}
                className="w-full text-left p-2 rounded-lg bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                    {item.mode}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium truncate mt-0.5 group-hover:text-cyan-300">
                  {item.prompt}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Professional Footer */}
      <div className="pt-3 border-t border-white/10 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-300 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Gemma Core v4.0
          </span>
          <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Operational
          </span>
        </div>
        <p className="text-[10px] text-slate-500 leading-normal">
          Powered exclusively by Google DeepMind Gemma 2 architecture with isolated server-side execution.
        </p>
      </div>

    </aside>
  );
};
