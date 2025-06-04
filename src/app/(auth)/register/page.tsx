'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/register', form);
      router.push('/login');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed');
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="p-6 bg-white rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input type="text" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required className="mb-3 w-full p-2 border rounded" />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="mb-3 w-full p-2 border rounded" />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className="mb-3 w-full p-2 border rounded" />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button className="w-full bg-green-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
