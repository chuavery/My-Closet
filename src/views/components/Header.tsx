import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
  serif?: boolean;
}

export default function Header({ title, subtitle, onBack, right, serif = false }: Props) {
  return (
    <header className="flex-none flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
      {onBack && (
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center -ml-1 text-foreground active:text-primary transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className={`truncate leading-tight ${serif ? 'font-serif text-xl font-semibold' : 'text-base font-semibold'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="flex-none">{right}</div>}
    </header>
  );
}
