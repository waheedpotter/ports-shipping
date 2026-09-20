'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border-t-4 border-[#8B0000]">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#8B0000]">Admin Login</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#8B0000] focus:border-[#8B0000]" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#8B0000] focus:border-[#8B0000]" required />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-[#8B0000] hover:bg-red-900 text-white rounded-md font-semibold">Sign In</button>
        </form>
      </div>
    </div>
  );
}
