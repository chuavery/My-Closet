import { useState } from 'react';
import type { Outfit, Article } from '../models';
import Header from './components/Header';

interface Props {
  outfits: Outfit[];
  articles: Article[];
  onOutfitClick: (id: string) => void;
  onNewOutfit: () => void;
  wearHistoryEnabled: boolean;
}

export default function OutfitsListScreen({ outfits, articles, onOutfitClick, onNewOutfit, wearHistoryEnabled }: Props) {
  const getArticle = (id: string) => articles.find(a => a.id === id);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Outfits"
        subtitle={`${outfits.length} saved`}
        serif
        right={
          <button
            onClick={onNewOutfit}
            className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-sm active:opacity-80 transition-opacity"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {outfits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="w-12 h-12 border border-dashed border-border rounded-sm flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6 text-muted-foreground">
                <path d="M2 9l10-6 10 6" /><path d="M2 14l10-6 10 6" /><path d="M2 19l10-6 10 7" />
              </svg>
            </div>
            <p className="font-serif text-sm text-muted-foreground">No outfits yet</p>
            <button onClick={onNewOutfit} className="mt-3 font-mono text-[10px] uppercase tracking-wider text-primary underline underline-offset-2">
              Build first outfit
            </button>
          </div>
        ) : (
          outfits.map(outfit => {
            const thumbArticles = outfit.articles.slice(0, 4).map(oa => getArticle(oa.articleId)).filter(Boolean) as Article[];
            return (
              <button
                key={outfit.id}
                onClick={() => onOutfitClick(outfit.id)}
                className="w-full bg-card border border-border rounded-sm overflow-hidden notched-corner active:bg-secondary/50 transition-colors text-left"
              >
                {/* Thumbnail strip */}
                <div className="flex h-24 border-b border-border overflow-hidden">
                  {thumbArticles.length > 0 ? (
                    thumbArticles.map((article, i) => (
                      <div
                        key={article.id}
                        className="flex-1 relative overflow-hidden"
                        style={{ borderLeft: i > 0 ? '1px solid #D0C9B8' : 'none' }}
                      >
                        {article.photoUrl ? (
                          <img src={article.photoUrl} alt={article.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full pattern-grid opacity-30" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-full pattern-grid opacity-20 flex items-center justify-center">
                      <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">No articles</p>
                    </div>
                  )}
                </div>

                {/* Info row */}
                <div className="px-3 py-2.5 flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm font-semibold truncate">{outfit.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      {outfit.occasions.map(occ => (
                        <span key={occ} className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground border border-border px-1.5 py-0.5 rounded-sm">
                          {occ}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-none text-right">
                    <p className="font-mono text-[9px] text-muted-foreground">{outfit.articles.length} pcs</p>
                    {wearHistoryEnabled && outfit.wearCount > 0 && (
                      <p className="font-mono text-[9px] text-muted-foreground">×{outfit.wearCount}</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
