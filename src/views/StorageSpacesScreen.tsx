import { useState } from 'react';
import type { StorageSpace, Article } from '../models';
import Header from './components/Header';
import QRCodeDisplay from './components/QRCodeDisplay';

interface Props {
  spaces: StorageSpace[];
  articles: Article[];
  onSpaceClick: (id: string) => void;
  onSaveSpace: (name: string, subLocation: string) => void;
  onUnassigned: () => void;
}

interface AddSpaceSheetProps {
  onSave: (name: string, subLocation: string) => void;
  onClose: () => void;
}

function AddSpaceSheet({ onSave, onClose }: AddSpaceSheetProps) {
  const [name, setName] = useState('');
  const [sub, setSub] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-foreground/20" onClick={onClose} />
      <div className="relative w-full bg-card border-t border-border p-5 slide-up rounded-t-sm">
        <p className="font-serif text-lg font-semibold mb-4">New Storage Space</p>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Bedroom Closet"
              autoFocus
              className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">Sub-location</label>
            <input
              type="text"
              value={sub}
              onChange={e => setSub(e.target.value)}
              placeholder="e.g. Top Shelf"
              className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={() => { if (name.trim()) { onSave(name.trim(), sub.trim()); } }}
            disabled={!name.trim()}
            className="w-full py-2.5 bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-wider rounded-sm disabled:opacity-40 active:opacity-80 transition-opacity"
          >
            Create Space
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StorageSpacesScreen({ spaces, articles, onSpaceClick, onSaveSpace, onUnassigned }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const unassigned = articles.filter(a => !a.storageSpaceId);

  function countInSpace(spaceId: string) {
    return articles.filter(a => a.storageSpaceId === spaceId).length;
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Storage"
        subtitle={`${spaces.length} spaces`}
        serif
        right={
          <button
            onClick={() => setShowAdd(true)}
            className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-sm active:opacity-80 transition-opacity"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Unassigned banner */}
        {unassigned.length > 0 && (
          <button
            onClick={onUnassigned}
            className="w-full flex items-center gap-3 bg-card border border-dashed border-primary/40 rounded-sm p-3 active:bg-secondary transition-colors"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-sm flex items-center justify-center flex-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4 text-primary">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-sans text-sm font-medium">Unassigned Items</p>
              <p className="font-mono text-[10px] text-muted-foreground">{unassigned.length} article{unassigned.length !== 1 ? 's' : ''} need a home</p>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4 text-muted-foreground">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        {spaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <div className="w-12 h-12 border border-dashed border-border rounded-sm flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6 text-muted-foreground">
                <path d="M21 8l-3-5H6L3 8" /><rect x="3" y="8" width="18" height="13" rx="1" />
              </svg>
            </div>
            <p className="font-serif text-sm text-muted-foreground">No storage spaces yet</p>
            <button onClick={() => setShowAdd(true)} className="mt-2 font-mono text-[10px] uppercase tracking-wider text-primary underline underline-offset-2">
              Add first space
            </button>
          </div>
        ) : (
          spaces.map(space => {
            const count = countInSpace(space.id);
            const isExpanded = expandedId === space.id;
            return (
              <div key={space.id} className="bg-card border border-border rounded-sm overflow-hidden notched-corner">
                {/* Space header row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : space.id)}
                  className="w-full flex items-center gap-3 p-3 active:bg-secondary/50 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <p className="font-sans text-sm font-semibold">{space.name}</p>
                    {space.subLocation && (
                      <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{space.subLocation}</p>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{count} item{count !== 1 ? 's' : ''}</span>
                  <svg
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                {/* QR + actions expanded */}
                {isExpanded && (
                  <div className="border-t border-border px-3 pb-3 pt-3 flex items-start gap-4 fade-in">
                    <div className="flex-none border border-border p-1 bg-white rounded-sm">
                      <QRCodeDisplay id={space.id} size={88} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">QR Code</p>
                      <p className="font-mono text-[9px] text-muted-foreground leading-relaxed">
                        Print and attach to locate this space instantly.
                      </p>
                      <button
                        onClick={() => onSpaceClick(space.id)}
                        className="font-mono text-[10px] uppercase tracking-wider text-primary underline underline-offset-2"
                      >
                        View contents →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showAdd && (
        <AddSpaceSheet
          onClose={() => setShowAdd(false)}
          onSave={(name, sub) => { onSaveSpace(name, sub); setShowAdd(false); }}
        />
      )}
    </div>
  );
}
