'use client';

import React, { useState } from 'react';
import { Sparkles, Cpu, CheckCircle2, FileText, ExternalLink, HelpCircle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  onOpenChecklist: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedModel,
  setSelectedModel,
  onOpenChecklist,
}) => {
  return (
    <header className="w-full glass-panel sticky top-0 z-40 border-b border-white/10 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-400 p-[1px] glow-primary">
            <div className="w-full h-full bg-[#0d1322] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                MindSpark <span className="text-gradient-gemma font-extrabold">Gemma</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI Study & Technical Learning Assistant • Powered exclusively by Google Gemma
            </p>
          </div>
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-3">
          
          {/* Gemma Model Selection Selector */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="hidden md:inline font-medium text-slate-400">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-slate-100 font-mono text-xs focus:outline-none cursor-pointer font-medium"
            >
              <option value="gemma-2-27b-it" className="bg-slate-900 text-slate-100">
                gemma-2-27b-it (Recommended)
              </option>
              <option value="gemma-2-9b-it" className="bg-slate-900 text-slate-100">
                gemma-2-9b-it (Fast)
              </option>
              <option value="gemma-2-2b-it" className="bg-slate-900 text-slate-100">
                gemma-2-2b-it (Lightweight)
              </option>
            </select>
          </div>

          {/* Kaggle Checklist Button */}
          <button
            onClick={onOpenChecklist}
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/40 hover:to-blue-600/40 text-purple-200 border border-purple-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Hackathon Checklist</span>
          </button>

          {/* Key Safe Security Badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Key Safe (Server-Side Only)</span>
          </div>

        </div>
      </div>
    </header>
  );
};
