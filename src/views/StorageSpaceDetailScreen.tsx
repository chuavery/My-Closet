import { useState } from 'react';
import type { StorageSpace, Article } from '../models';
import Header from './components/Header';
import ArticleCard from './components/ArticleCard';
import QRCodeDisplay from './components/QRCodeDisplay';

interface Props {
  space: StorageSpace;
  articles: Article[];
  allSpaces: StorageSpace[];
  onBack: () => void;
  onArticleClick: (id: string) => void;
  onDeleteSpace: (id: string) => void;
  onReassign: (articleId: string, spaceId: string) => void;
}

export default function StorageSpaceDetailScreen({
  space, articles, allSpaces, onBack, onArticleClick, onDeleteSpace, onReassign,
}: Props) {
  const [showDelete, setShowDelete] = useState(false);
  const [reassigning, setReassigning] = useState<string | null>(null);

  const otherSpaces = allSpaces.filter(s => s.id !== space.id);

  return (
    <div className="flex flex-col h-full">
      <Header
        title={space.name}
        subtitle={space.subLocation || undefined}
        onBack={onBack}
        serif
      />

      <div className="flex-1 overflow-y-auto">
        {/* QR banner - only for real spaces */}
        {space.id && <div className="flex items-start gap-4 px-4 pt-4 pb-3 border-b border-border">
          <div className="flex-none border border-border p-1.5 bg-white rounded-sm">
            <QRCodeDisplay id={space.id} size={72} />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Space QR Code</p>
            <p className="font-sans text-sm font-semibold mt-1">{space.name}</p>
            {space.subLocation && (
              <p className="font-mono text-[10px] text-muted-foreground">{space.subLocation}</p>
            )}
            <p className="font-mono text-[10px] text-muted-foreground mt-1">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
          </div>
        </div>}

        {/* Articles */}
        <div className="px-4 pt-4 pb-4">
          {articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-10 h-10 border border-dashed border-border rounded-sm flex items-center justify-center mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-5 h-5 text-muted-foreground">
                  <rect x="3" y="4" width="18" height="17" rx="1" />
                </svg>
              </div>
              <p className="font-serif text-sm text-muted-foreground">No items here yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {articles.map(article => (
                <div key={article.id} className="relative">
                  <ArticleCard
                    article={article}
                    onClick={() => onArticleClick(article.id)}
                    compact
                  />
                  {reassigning === article.id && otherSpaces.length > 0 && (
                    <div className="absolute inset-x-0 bottom-0 bg-card border border-border rounded-sm shadow-lg z-10 p-2 fade-in">
                      <p className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground mb-1">Move to…</p>
                      {otherSpaces.map(s => (
                        <button
                          key={s.id}
                          onClick={() => { onReassign(article.id, s.id); setReassigning(null); }}
                          className="block w-full text-left font-sans text-xs py-1 px-1 hover:text-primary transition-colors"
                        >
                          {s.name}{s.subLocation ? ` · ${s.subLocation}` : ''}
                        </button>
                      ))}
                      <button
                        onClick={() => { onReassign(article.id, ''); setReassigning(null); }}
                        className="block w-full text-left font-sans text-xs py-1 px-1 text-muted-foreground"
                      >
                        Unassign
                      </button>
                      <button onClick={() => setReassigning(null)} className="block w-full text-left font-mono text-[8px] uppercase tracking-wider text-muted-foreground/60 pt-1">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete zone - only for real spaces */}
        {space.id && <div className="px-4 pb-6">
          {showDelete ? (
            <div className="border border-dashed border-primary/40 rounded-sm p-3">
              <p className="font-sans text-xs text-muted-foreground mb-2">
                Delete "{space.name}"? Articles will become unassigned — not deleted.
              </p>
              <div className="flex gap-3">
                <button onClick={() => onDeleteSpace(space.id)} className="font-mono text-[10px] uppercase tracking-wider text-primary">Delete</button>
                <button onClick={() => setShowDelete(false)} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowDelete(true)} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60 underline underline-offset-2">
              Delete this space
            </button>
          )}
        </div>}
      </div>
    </div>
  );
}
