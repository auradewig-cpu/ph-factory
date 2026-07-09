'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, FolderOpen, FlaskConical, Film, Calendar, Music, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApiStatusWidget } from './ApiStatusWidget';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: FolderOpen, label: 'Projects', id: 'projects' },
  { icon: FlaskConical, label: 'Research Engine', id: 'research' },
  { icon: Film, label: 'Director Studio', id: 'director' },
  { icon: Calendar, label: 'Content Calendar', id: 'calendar' },
  { icon: Music, label: 'Asset & Music Library', id: 'assets' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

interface Props {
  activeItem: string;
  onNavigate: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ activeItem, onNavigate, collapsed, onToggleCollapse }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <div
      className={cn(
        'bg-ph-surface border-r border-ph-border flex flex-col h-full overflow-hidden flex-shrink-0 transition-[width,min-width] duration-200',
        collapsed ? 'w-[52px] min-w-[52px]' : 'w-[216px] min-w-[216px]',
      )}
    >
      {/* Header */}
      <div className={cn('px-[14px] py-[14px] border-b border-ph-border flex items-center min-h-[52px]', collapsed ? 'justify-center px-0' : 'justify-between')}>
        {!collapsed && <span className="font-display text-[17px] font-bold tracking-[0.15em] text-ph-text whitespace-nowrap">PH FACTORY</span>}
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="bg-transparent border-none cursor-pointer text-ph-muted p-1 rounded-[4px] flex items-center justify-center flex-shrink-0 outline-offset-2 hover:text-ph-text focus-visible:outline-2 focus-visible:outline-ph-amber"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-1.5 pb-1.5">
        {MENU_ITEMS.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center gap-2.5 border-none cursor-pointer transition-all duration-150 outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-ph-amber',
                collapsed ? 'justify-center py-[9px]' : 'py-[9px] px-[14px] justify-start',
                isActive ? 'text-ph-text bg-[rgba(242,169,59,0.07)] border-l-[3px] border-l-ph-amber' : 'text-ph-muted border-l-[3px] border-l-transparent hover:text-ph-text hover:bg-[rgba(255,255,255,0.03)]',
              )}
            >
              <Icon size={15} className="flex-shrink-0" />
              {!collapsed && <span className="font-sans text-xs font-normal whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* API Status */}
      <ApiStatusWidget collapsed={collapsed} />

      {/* Logout */}
      <div className="border-t border-ph-border">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={cn(
            'w-full flex items-center gap-2.5 border-none cursor-pointer transition-all duration-150 outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-ph-amber text-ph-muted hover:text-ph-error',
            collapsed ? 'justify-center py-[9px]' : 'py-[9px] px-[14px] justify-start',
          )}
        >
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && <span className="font-sans text-xs font-normal whitespace-nowrap">Logout</span>}
        </button>
      </div>
      {collapsed && <div className="pb-3" />}
    </div>
  );
}
