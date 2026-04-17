'use client';
import { useState } from 'react';

export default function VoiceSearch() {
  const [listening, setListening] = useState(false);
  const [query, setQuery] = useState('');

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is only supported in Chrome browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setQuery(text);
      setListening(false);
      window.location.href = `/products?q=${encodeURIComponent(text)}`;
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const handleSearch = () => {
    if (query.trim()) window.location.href = `/products?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      <div className="flex-1 flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-2.5 gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={listening ? '🎤 Listening...' : 'Search for gifts...'}
          className="flex-1 bg-transparent text-white placeholder-white/50 text-sm outline-none"
        />
      </div>
      <button
        onClick={startVoice}
        title="Voice Search"
        className={`w-10 h-10 rounded-full flex items-center justify-center text-base transition-all
          ${listening ? 'bg-rose-500 animate-pulse scale-110' : 'bg-white/20 hover:bg-white/30'}`}
      >
        🎤
      </button>
      <button
        onClick={handleSearch}
        className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
      >
        Search
      </button>
    </div>
  );
}
