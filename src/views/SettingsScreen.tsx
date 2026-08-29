import type { UserSettings } from '../models';
import Header from './components/Header';

interface Props {
  settings: UserSettings;
  articleCount: number;
  outfitCount: number;
  spaceCount: number;
  onToggleWearHistory: () => void;
  onClearData: () => void;
}

export default function SettingsScreen({
  settings, articleCount, outfitCount, spaceCount, onToggleWearHistory, onClearData,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" serif />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Stats */}
        <div className="bg-card border border-border rounded-sm overflow-hidden notched-corner">
          <div className="px-4 py-3 border-b border-border/60">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Closet Summary</p>
          </div>
          <div className="flex divide-x divide-border">
            {[
              { label: 'Articles', value: articleCount },
              { label: 'Outfits', value: outfitCount },
              { label: 'Spaces', value: spaceCount },
            ].map(({ label, value }) => (
              <div key={label} className="flex-1 px-3 py-3 text-center">
                <p className="font-serif text-2xl font-semibold">{value}</p>
                <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Preferences</p>
          </div>

          {/* Wear history toggle */}
          <div className="flex items-start gap-4 px-4 py-4 border-b border-border/60">
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm font-medium">Wear History</p>
              <p className="font-sans text-xs text-muted-foreground mt-0.5">
                Track how often you wear each article and outfit. Adds "Mark as worn" actions throughout the app.
              </p>
            </div>
            <button
              onClick={onToggleWearHistory}
              className={`flex-none w-10 h-5 rounded-full transition-colors relative mt-0.5 ${
                settings.wearHistoryEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  settings.wearHistoryEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Version */}
          <div className="flex items-center px-4 py-3">
            <p className="flex-1 font-sans text-sm text-muted-foreground">Version</p>
            <p className="font-mono text-[10px] text-muted-foreground">1.0.0</p>
          </div>
        </div>

        {/* About */}
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">About</p>
          </div>
          <div className="px-4 py-4">
            <p className="font-serif text-base font-semibold">My Closet</p>
            <p className="font-sans text-xs text-muted-foreground mt-1 leading-relaxed">
              A virtual closet manager that helps you catalog your clothing, track where it's stored, and build outfits from what you own. All data stays on your device — no account required.
            </p>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-card border border-dashed border-border/60 rounded-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Data</p>
          </div>
          <div className="px-4 py-4">
            <button
              onClick={onClearData}
              className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60 underline underline-offset-2 active:text-primary transition-colors"
            >
              Clear all data and reload sample
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
