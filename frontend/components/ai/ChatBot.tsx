'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const FALLBACK_REPLIES = [
  'Great! For birthdays I recommend our Birthday Hamper Deluxe (₹1,840) — a bestseller! 🎂',
  'For anniversaries, the Crystal Set (₹3,200) or Memory Scrapbook Kit (₹1,100) are perfect! 💍',
  'You can apply coupon GIFT20 for ₹200 off or DIWALI for ₹500 off your order! 🎁',
  'Our top rated this week: Spa & Wellness Kit and Luxury Candle Collection! ✨',
  'Amazing festive gifts under ₹2,000! The Diwali Premium Box is trending right now 🪔',
];
let replyIndex = 0;

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Gifty 🎁 What occasion are you shopping for today?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((p) => [...p, { role: 'assistant', content: data.reply }]);
    } catch {
      const reply = FALLBACK_REPLIES[replyIndex % FALLBACK_REPLIES.length];
      replyIndex++;
      setMessages((p) => [...p, { role: 'assistant', content: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-xl flex items-center justify-center text-2xl z-50 transition-all hover:scale-105"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <div className="bg-rose-500 px-4 py-3">
            <p className="text-white font-semibold text-sm">Gifty AI Assistant</p>
            <p className="text-rose-200 text-xs">Always here to help find the perfect gift 🎁</p>
          </div>
          <div className="h-64 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-xl text-sm leading-relaxed
                  ${m.role === 'user'
                    ? 'bg-rose-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-gray-400 text-sm italic">
                  Gifty is typing...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="p-2 bg-white border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask for gift ideas..."
              className="flex-1 text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-rose-400 transition-colors"
            />
            <button
              onClick={send}
              disabled={loading}
              className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
