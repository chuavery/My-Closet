import type { ReactNode } from 'react';

type Tab = 'closet' | 'outfits' | 'storage' | 'settings';

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  {
    id: 'closet', label: 'Closet',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="4" width="18" height="17" rx="1" />
        <line x1="12" y1="4" x2="12" y2="21" />
        <circle cx="8.5" cy="13" r="1" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="13" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'outfits', label: 'Outfits',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5">
        <path d="M2 9l10-6 10 6" />
        <path d="M2 14l10-6 10 6" />
        <path d="M2 19l10-6 10 6" />
      </svg>
    ),
  },
  {
    id: 'storage', label: 'Storage',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 8l-3-5H6L3 8" />
        <rect x="3" y="8" width="18" height="13" rx="1" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    id: 'settings', label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="flex-none border-t border-border bg-card">
      <div className="flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
              active === tab.id
                ? 'text-primary'
                : 'text-muted-foreground active:text-foreground'
            }`}
          >
            {tab.icon}
            <span className={`font-mono text-[9px] uppercase tracking-wider ${active === tab.id ? 'text-primary' : ''}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
