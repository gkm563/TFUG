'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar, StudioMode, HistoryItem } from '@/components/Sidebar';
import { StudioWorkspace } from '@/components/StudioWorkspace';
import { ResultViewer } from '@/components/ResultViewer';
import { KaggleChecklistModal } from '@/components/KaggleChecklistModal';
import { Shield, ExternalLink } from 'lucide-react';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('gemma-2-27b-it');
  const [activeMode, setActiveMode] = useState<StudioMode>('agent');
  const [prompt, setPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [tone, setTone] = useState('Pragmatic');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  // Load saved history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('mindspark_gemma_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse saved history:', e);
      }
    }
  }, []);

  const saveHistoryItem = (item: HistoryItem) => {
    const updated = [item, ...history.slice(0, 19)]; // Keep last 20
    setHistory(updated);
    localStorage.setItem('mindspark_gemma_history', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('mindspark_gemma_history');
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setActiveMode(item.mode);
    setPrompt(item.prompt);
    setResult(item.result);
    setError(null);
  };

  const handleGenerate = async (overridePrompt?: string) => {
    const activePrompt = overridePrompt || prompt;
    if (!activePrompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/gemma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: activePrompt,
          mode: activeMode,
          customModel: selectedModel,
          temperature,
          systemPrompt: tone ? `Explain in a ${tone} tone.` : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || `Server request failed with status ${response.status}`);
      }

      setResult(data.result);

      // Save to session history
      const historyEntry: HistoryItem = {
        id: Date.now().toString(),
        prompt: activePrompt,
        mode: activeMode,
        result: data.result,
        timestamp: new Date().toISOString(),
      };
      saveHistoryItem(historyEntry);

    } catch (err: any) {
      console.error('Generation Error:', err);
      setError(err?.message || 'Failed to generate response. Please check server logs or API key setup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100 selection:bg-purple-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Header
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        onOpenChecklist={() => setIsChecklistOpen(true)}
      />

      {/* Main Studio Body - Clean Responsive Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Sidebar Controls */}
        <Sidebar
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          history={history}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
        />

        {/* Center Studio Area - Takes up remaining width */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-6">
          
          {/* Workspace Input Editor */}
          <StudioWorkspace
            activeMode={activeMode}
            prompt={prompt}
            setPrompt={setPrompt}
            isLoading={isLoading}
            onGenerate={handleGenerate}
            temperature={temperature}
            setTemperature={setTemperature}
            tone={tone}
            setTone={setTone}
            error={error}
            selectedModel={selectedModel}
          />

          {/* Result Output Viewer */}
          <ResultViewer
            result={result}
            isLoading={isLoading}
            activeMode={activeMode}
            modelUsed={selectedModel}
          />

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-4 px-6 text-xs text-slate-500 glass-panel mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">MindSpark Gemma 4 Engine</span>
            <span>•</span>
            <span>Kaggle Build with Gemma Competition (TFUG Prayagraj)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Key Server-Side Isolated
            </span>
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors flex items-center gap-1"
            >
              <span>Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Kaggle Submission Checklist Modal */}
      <KaggleChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
      />

    </div>
  );
}
