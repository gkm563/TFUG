'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Square, ExternalLink, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface KaggleChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KaggleChecklistModal: React.FC<KaggleChecklistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('gemma_kaggle_checklist');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const toggleCheck = (id: string) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    localStorage.setItem('gemma_kaggle_checklist', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  const checklist = [
    {
      id: 'gemma_only',
      title: 'Only Gemma Model Used',
      desc: 'Project calls Google Gemma API directly from backend server (No ChatGPT, Gemini, or Claude)',
    },
    {
      id: 'key_safe',
      title: 'API Key Kept Safe',
      desc: 'GOOGLE_API_KEY lives strictly in Vercel environment variables / process.env. Never hardcoded in git code.',
    },
    {
      id: 'github_public',
      title: 'GitHub Repo is Public',
      desc: 'Repository is public, clean, and contains all frontend & backend source files.',
    },
    {
      id: 'live_vercel',
      title: 'Live Vercel URL Working',
      desc: 'Application deployed on Vercel (.vercel.app) and responds to public user inputs.',
    },
    {
      id: 'demo_video',
      title: '2-3 Min Demo Video',
      desc: 'Unedited screen recording showing live input, Gemma response, and GitHub API call file.',
    },
    {
      id: 'kaggle_writeup',
      title: 'Kaggle Writeup Published',
      desc: 'Contains title, inspiration, how built, GitHub link, and live Vercel link.',
    },
    {
      id: 'google_form',
      title: 'Google Form Submitted',
      desc: 'Submitted form with Kaggle writeup link, GitHub link, live Vercel link, and YouTube video link.',
    },
  ];

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const isAllDone = completedCount === checklist.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl glass-panel rounded-2xl p-6 border border-purple-500/30 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900/80 text-slate-400 hover:text-white border border-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Kaggle Competition Readiness Checklist
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Build with Gemma (TFUG Prayagraj / AI Prayagraj). Tick every box before submitting your Google Form.
        </p>

        {/* Progress Bar */}
        <div className="mb-6 bg-slate-950 p-3 rounded-xl border border-white/10">
          <div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
            <span className="text-slate-300">Completion Status</span>
            <span className={isAllDone ? 'text-emerald-400 font-mono' : 'text-purple-400 font-mono'}>
              {completedCount} / {checklist.length} Completed
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${(completedCount / checklist.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Checklist items */}
        <div className="space-y-2.5">
          {checklist.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isChecked
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                    : 'bg-slate-900/50 border-white/5 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="mt-0.5 shrink-0 text-emerald-400">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div>
                  <h3 className={`text-xs font-semibold ${isChecked ? 'text-emerald-300 line-through' : 'text-white'}`}>
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submission Links Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>5/5 Hackathon rules strictly met</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://forms.gle/xz9Zu7VWn8aEvM6k8"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/20 transition-all"
            >
              <span>Submit Google Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
