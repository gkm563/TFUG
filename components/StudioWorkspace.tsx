'use client';

import React, { useState } from 'react';
import { StudioMode } from './Sidebar';
import { 
  Wand2, 
  Loader2, 
  Eraser, 
  Sliders, 
  Sparkles, 
  AlertTriangle,
  Lightbulb,
  CornerDownLeft,
  Key
} from 'lucide-react';

interface StudioWorkspaceProps {
  activeMode: StudioMode;
  prompt: string;
  setPrompt: (val: string) => void;
  isLoading: boolean;
  onGenerate: (overridePrompt?: string) => void;
  temperature: number;
  setTemperature: (val: number) => void;
  tone: string;
  setTone: (val: string) => void;
  error: string | null;
  selectedModel: string;
}

export const StudioWorkspace: React.FC<StudioWorkspaceProps> = ({
  activeMode,
  prompt,
  setPrompt,
  isLoading,
  onGenerate,
  temperature,
  setTemperature,
  tone,
  setTone,
  error,
  selectedModel,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  // Preset example prompts for each mode
  const samplePrompts: Record<StudioMode, string[]> = {
    explainer: [
      'Explain Transformer Self-Attention in simple mental models',
      'How does Quantum Entanglement work for high school students?',
      'Explain B-Trees vs Hash Indexes in database architecture',
      'What is Docker Containerization vs Virtual Machines?',
    ],
    flashcards: [
      'Top 5 essential Git commands and merge conflict resolution',
      'Key concepts of REST vs GraphQL APIs',
      'Solid Principles in Object-Oriented Software Design',
      'React Hooks lifecycle: useState, useEffect, useMemo',
    ],
    codearchitect: [
      'Optimize Python function for prime factorization with big-O analysis',
      'Debug concurrency race conditions in Node.js event loop',
      'Convert Callback Pyramid to Async/Await with clean error handling',
      'Design scalable Redis Caching strategy for e-commerce catalog',
    ],
    quizmaster: [
      'System Architecture & Microservices load balancing concepts',
      'Python Memory Management, Garbage Collection & GIL',
      'Machine Learning Overfitting, Regularization & Loss Functions',
      'Web Security: CORS, CSRF, and XSS Vulnerabilities',
    ],
    chat: [
      'What are the core technical differences between Gemma 2 and Llama 3?',
      'Help me outline a 1-day MVP hackathon strategy',
      'Draft a Kaggle competition writeup structure for AI products',
    ],
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && prompt.trim()) {
        onGenerate();
      }
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 flex flex-col gap-4 border border-white/10 relative overflow-hidden">
      
      {/* Subtle background glow accent */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Quick Settings Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold tracking-tight text-white capitalize">
            {activeMode} Studio Workspace
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
              showSettings 
                ? 'bg-purple-600/20 border-purple-500/40 text-purple-300' 
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Parameters</span>
          </button>

          {prompt && (
            <button
              onClick={() => setPrompt('')}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 px-2 py-1.5 rounded-lg hover:bg-slate-900/60 transition-colors"
              title="Clear prompt"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Parameters Panel */}
      {showSettings && (
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-purple-500/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">
              Explanation Tone / Style:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['Pragmatic', 'ELI5', 'Academic'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`py-1 px-2 rounded-md font-medium text-[11px] border transition-all ${
                    tone === t
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                      : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1.5 font-medium">
              <span>Creativity (Temperature):</span>
              <span className="text-cyan-400 font-mono font-bold">{temperature}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Deterministic (0.1)</span>
              <span>Creative (1.0)</span>
            </div>
          </div>
        </div>
      )}

      {/* Preset Sample Prompt Chips */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          <span>Quick Inspiration Templates:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {samplePrompts[activeMode]?.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(sample);
                onGenerate(sample);
              }}
              className="text-left text-xs bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 px-3 py-1.5 rounded-lg transition-all"
            >
              "{sample}"
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert Display */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-200">Gemma Request Notice</p>
            <p className="mt-0.5 leading-relaxed text-red-300/90">{error}</p>
            {error.includes('GOOGLE_API_KEY') && (
              <div className="mt-2 p-2 rounded bg-black/40 border border-red-500/20 text-[11px] font-mono text-amber-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Tip: Add GOOGLE_API_KEY to .env.local locally or Vercel Environment Variables.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prompt Textarea */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Enter your topic, question, or code snippet for Gemma (${activeMode} mode)...`}
          rows={5}
          className="w-full glass-input rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 resize-none font-sans focus:ring-0"
        />
        
        {/* Textarea Bottom Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 px-1 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-500">
              {prompt.length} chars
            </span>
            <span className="hidden sm:inline font-mono text-[11px] text-slate-500">
              Model: <span className="text-purple-400">{selectedModel}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1 text-[11px] text-slate-500">
              <CornerDownLeft className="w-3 h-3 text-slate-400" /> Ctrl + Enter to run
            </span>
            
            <button
              onClick={() => onGenerate()}
              disabled={isLoading || !prompt.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-500 hover:via-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/25 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Gemma Thinking...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-white" />
                  <span>Generate with Gemma</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
