'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';

const NAV_MAP: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/projects': 'projects',
  '/research': 'research',
  '/director': 'director',
  '/calendar': 'calendar',
  '/assets': 'assets',
  '/settings': 'settings',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem('ph_logged_in') !== 'true') {
      router.replace('/');
    }
  }, [router]);

  if (!mounted) return null;

  const activeItem = NAV_MAP[pathname] || 'dashboard';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-ph-bg font-sans">
      <Sidebar
        activeItem={activeItem}
        onNavigate={(id) => {
          const path = id === 'dashboard' ? '/dashboard' : `/${id}`;
          router.push(path);
        }}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}
