'use client';

import { LayoutDashboard, FolderOpen, FlaskConical, Film, Calendar, Music, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: FolderOpen, label: 'Projects', id: 'projects' },
  { icon: FlaskConical, label: 'Research Engine', id: 'research' },
  { icon: Film, label: 'Director Studio', id: 'director' },
  { icon: Calendar, label: 'Content Calendar', id: 'calendar' },
  { icon: Music, label: 'Asset & Music Library', id: 'assets' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

const API_SERVICES = [
  { name: 'Gemini', used: 847, limit: 1000, status: 'green' as const },
  { name: 'Groq', used: 1240, limit: 5000, status: 'green' as const },
  { name: 'OpenRouter', used: 78, limit: 100, status: 'yellow' as const },
];

const STATUS_COLOR = { green: '#2FA6A0', yellow: '#F2A93B', red: '#D45B4E' };

function fmt(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}

interface Props {
  activeItem: string;
  onNavigate: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ activeItem, onNavigate, collapsed, onToggleCollapse }: Props) {
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

      {/* API Usage Widget */}
      {!collapsed ? (
        <div className="mx-2 mb-2.5 px-3 py-[10px] bg-ph-bg border border-ph-border rounded-[4px]">
          <div className="font-mono text-[9px] text-ph-muted tracking-[0.14em] mb-2.5">API USAGE</div>
          {API_SERVICES.map((svc) => (
            <div key={svc.name} className="flex items-center justify-between mb-1.5 last:mb-0">
              <div className="flex items-center gap-1.5">
                <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: STATUS_COLOR[svc.status], boxShadow: `0 0 4px ${STATUS_COLOR[svc.status]}80` }} />
                <span className="font-mono text-[10px] text-ph-muted">{svc.name}</span>
              </div>
              <span className="font-mono text-[10px] text-ph-text">{fmt(svc.used)}/{fmt(svc.limit)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-[5px] pb-3">
          {API_SERVICES.map((svc) => (
            <div key={svc.name} title={`${svc.name}: ${svc.used}/${svc.limit}`} className="w-[6px] h-[6px] rounded-full" style={{ background: STATUS_COLOR[svc.status] }} />
          ))}
        </div>
      )}
    </div>
  );
}
