'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPage } from '@/components/LoginPage';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem('ph_logged_in') === 'true') {
      router.replace('/dashboard');
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <LoginPage
      onLogin={() => {
        localStorage.setItem('ph_logged_in', 'true');
        router.replace('/dashboard');
      }}
    />
  );
}
