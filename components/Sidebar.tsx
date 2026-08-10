'use client';

import React from 'react';
import { 
  Lightbulb, 
  Layers, 
  Code2, 
  HelpCircle, 
  MessageSquare, 
  History, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export type StudioMode = 'explainer' | 'flashcards' | 'codearchitect' | 'quizmaster' | 'chat';

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
  const modes: { id: StudioMode; label: string; icon: React.ElementType; desc: string; color: string }[] = [
    {
      id: 'explainer',
      label: 'Concept Explainer',
      icon: Lightbulb,
      desc: 'Intuitive analogies & step-by-step breakdowns',
      color: 'text-amber-400',
    },
    {
      id: 'flashcards',
      label: 'Flashcard Generator',
      icon: Layers,
      desc: 'Active recall Q&A study decks',
      color: 'text-cyan-400',
    },
    {
      id: 'codearchitect',
      label: 'Code Architect',
      icon: Code2,
      desc: 'Refactor, debug & architecture review',
      color: 'text-purple-400',
    },
    {
      id: 'quizmaster',
      label: 'Quiz Master',
      icon: HelpCircle,
      desc: 'Self-assessment multiple choice tests',
      color: 'text-emerald-400',
    },
    {
      id: 'chat',
      label: 'General Assistant',
      icon: MessageSquare,
      desc: 'Direct conversation with Gemma 2',
      color: 'text-blue-400',
    },
  ];

  return (
    <aside className="w-full lg:w-80 glass-panel rounded-2xl p-4 flex flex-col gap-6 shrink-0 border border-white/10">
      
      {/* Studio Modes */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-3 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>Learning Modes</span>
        </h2>
        
        <div className="flex flex-col gap-1.5">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = activeMode === m.id;

            return (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-transparent border-purple-500/50 shadow-md text-white'
                    : 'bg-slate-900/40 border-white/5 text-slate-300 hover:bg-slate-800/50 hover:border-white/10'
                }`}
              >
                <div className={`p-2 rounded-lg bg-slate-950/60 ${m.color} shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs tracking-tight">{m.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                    {m.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Session History */}
      <div className="flex-1 flex flex-col min-h-[180px] max-h-[300px]">
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recent Sessions</span>
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
            <div className="text-center py-6 text-xs text-slate-500 italic bg-slate-950/30 rounded-xl border border-white/5 px-2">
              No saved sessions yet. Generate something to start building history!
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectHistory(item)}
                className="w-full text-left p-2.5 rounded-lg bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                    {item.mode}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium truncate mt-1 group-hover:text-cyan-300">
                  {item.prompt}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Hackathon Quick Links Footer */}
      <div className="pt-3 border-t border-white/10 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-300">Build with Gemma</span>
          <span className="text-purple-400 font-mono font-bold">TFUG Prayagraj</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://www.kaggle.com/competitions/build-with-gemma-tfug-prayagraj-ai-prayagraj-in-person"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-1.5 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center gap-1 transition-colors text-[11px]"
          >
            <span>Kaggle Page</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href="https://forms.gle/xz9Zu7VWn8aEvM6k8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-1.5 rounded-md bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 hover:text-purple-200 border border-purple-500/20 flex items-center justify-center gap-1 transition-colors text-[11px]"
          >
            <span>Google Form</span>
            <ExternalLink className="w-3 h-3 text-purple-400" />
          </a>
        </div>
      </div>

    </aside>
  );
};
