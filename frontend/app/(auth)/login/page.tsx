'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/auth.store';
import api from '../../../lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        setAuth(response.data.data.user, response.data.data.token);
        toast.success(`Welcome back, ${response.data.data.user.name}`);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Sign in to FinTrack</CardTitle>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" loading={loading}>
            Sign In
          </Button>

          <div className="w-full pt-4 border-t border-border">
            <p className="text-xs text-gray-500 mb-2 text-center uppercase tracking-wider font-semibold">Quick Login (Demo)</p>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" className="text-xs py-1" onClick={() => quickLogin('admin@system.com', 'password123')}>Admin</Button>
              <Button type="button" variant="secondary" className="text-xs py-1" onClick={() => quickLogin('recorder@eng.com', 'password123')}>Entry Recorder</Button>
              <Button type="button" variant="secondary" className="text-xs py-1" onClick={() => quickLogin('analyst@system.com', 'password123')}>Analyst</Button>
              <Button type="button" variant="secondary" className="text-xs py-1" onClick={() => quickLogin('user@system.com', 'password123')}>User</Button>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
