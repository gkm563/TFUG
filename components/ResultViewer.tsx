'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { StudioMode } from './Sidebar';
import { 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  FileText, 
  Layers, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Share2,
  Clock,
  Zap
} from 'lucide-react';

interface ResultViewerProps {
  result: string | null;
  isLoading: boolean;
  activeMode: StudioMode;
  modelUsed?: string;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({
  result,
  isLoading,
  activeMode,
  modelUsed = 'gemma-2-27b-it',
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw' | 'interactive'>('formatted');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Interactive Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Flashcards flippable state
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MindSpark-Gemma-${activeMode}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleSpeech = () => {
    if (!result) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      // Strip markdown symbols for clean audio read
      const cleanText = result.replace(/[#*`_~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Helper parser for flashcards
  const parseFlashcards = (text: string) => {
    const cardBlocks = text.split(/### Card \d+:?/i).filter(b => b.trim().length > 0);
    return cardBlocks.map((block, idx) => {
      const qMatch = block.match(/\*\*Q:\*\*\s*([\s\S]*?)(?=\*\*A:\*\*|$)/i);
      const aMatch = block.match(/\*\*A:\*\*\s*([\s\S]*?)(?=---|$)/i);
      const titleMatch = block.split('\n')[0].trim();

      return {
        id: idx + 1,
        title: titleMatch || `Flashcard #${idx + 1}`,
        question: qMatch ? qMatch[1].trim() : block.slice(0, 150),
        answer: aMatch ? aMatch[1].trim() : block.slice(150),
      };
    });
  };

  if (isLoading) {
    return (
      <div className="w-full glass-panel rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center gap-4 text-center border border-white/10 min-h-[300px]">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
          <Sparkles className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Gemma is Crafting Your Response...
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Evaluating logic with Google <span className="text-purple-400 font-semibold">{modelUsed}</span>. Responses are isolated on our secure server.
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full glass-panel rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center gap-3 text-center border border-white/10 min-h-[250px] text-slate-400">
        <Zap className="w-8 h-8 text-slate-600 mb-1" />
        <h3 className="text-sm font-semibold text-slate-300">Workspace Ready</h3>
        <p className="text-xs text-slate-500 max-w-md">
          Select a mode from the sidebar, choose a template or enter your topic, and click "Generate with Gemma".
        </p>
      </div>
    );
  }

  const flashcardList = activeMode === 'flashcards' ? parseFlashcards(result) : [];

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 flex flex-col gap-4 border border-white/10 relative">
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        
        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-white/5 text-xs">
          <button
            onClick={() => setActiveTab('formatted')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'formatted'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Formatted Markdown
          </button>
          
          {activeMode === 'flashcards' && (
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                activeTab === 'interactive'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Cards</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'raw'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw Code / Text
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-lg border text-xs transition-all ${
              isSpeaking
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-slate-800'
            }`}
            title={isSpeaking ? 'Stop voice readout' : 'Read output aloud'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-xs text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-xs text-purple-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Export .md</span>
          </button>
        </div>

      </div>

      {/* Main Content Render */}
      <div className="min-h-[250px]">
        {activeTab === 'formatted' && (
          <div className="markdown-body p-2 sm:p-4 bg-slate-950/40 rounded-xl border border-white/5">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result}
            </ReactMarkdown>
          </div>
        )}

        {activeTab === 'raw' && (
          <pre className="p-4 bg-slate-950 rounded-xl border border-white/10 text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {result}
          </pre>
        )}

        {activeTab === 'interactive' && activeMode === 'flashcards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
            {flashcardList.map((card) => {
              const isFlipped = !!flippedCards[card.id];
              return (
                <div
                  key={card.id}
                  onClick={() =>
                    setFlippedCards((prev) => ({ ...prev, [card.id]: !prev[card.id] }))
                  }
                  className="glass-card p-6 rounded-2xl cursor-pointer border border-white/10 hover:border-purple-500/40 transition-all min-h-[160px] flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-xs text-purple-400 font-mono mb-2">
                    <span>Card #{card.id}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Click to {isFlipped ? 'Show Question' : 'Reveal Answer'}
                    </span>
                  </div>

                  <div className="my-auto">
                    {isFlipped ? (
                      <div className="text-sm font-medium text-emerald-300 leading-relaxed">
                        <span className="font-bold text-emerald-400 block mb-1">Answer:</span>
                        {card.answer}
                      </div>
                    ) : (
                      <div className="text-sm font-semibold text-white leading-relaxed">
                        <span className="font-bold text-cyan-400 block mb-1">Question:</span>
                        {card.question}
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-500 text-right mt-3">
                    {isFlipped ? ' Showing Answer' : ' Question View'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Output: {result.length} characters</span>
        </div>
        <div className="text-purple-400">
          Powered by Google {modelUsed}
        </div>
      </div>

    </div>
  );
};
