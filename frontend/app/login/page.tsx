'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useUserStore();
  const router = useRouter();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAuth(data.user, data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Georgia, serif' }}>Giftura</h1>
        <p className="text-gray-500 text-sm mb-6">
          {mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
        </p>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-5">
          {(['login', 'signup'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === m ? 'bg-rose-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>
        {mode === 'signup' && (
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-rose-400 transition-colors" />
          </div>
        )}
        <div className="mb-3">
          <label className="text-xs text-gray-500 mb-1 block">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-rose-400 transition-colors" />
        </div>
        <div className="mb-4">
          <label className="text-xs text-gray-500 mb-1 block">Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-rose-400 transition-colors" />
        </div>
        {error && <p className="text-rose-500 text-xs mb-3">{error}</p>}
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white py-2.5 rounded-lg font-medium text-sm transition-colors">
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 font-medium mb-1">Test Accounts:</p>
          <p className="text-xs text-gray-400">Admin: admin@giftura.com / admin123</p>
          <p className="text-xs text-gray-400">User: user@giftura.com / user123</p>
        </div>
      </div>
    </div>
  );
}
