import { useState } from 'react';
import type { Article, StorageSpace } from '../models';
import { ARTICLE_TYPE_LABELS, COLOR_HEX } from '../models';
import Header from './components/Header';

interface Props {
  article: Article;
  space?: StorageSpace;
  onBack: () => void;
  onEdit: () => void;
  onLocate: () => void;
  wearHistoryEnabled: boolean;
  onMarkWorn?: () => void;
}

export default function ArticleDetailScreen({
  article, space, onBack, onEdit, onLocate, wearHistoryEnabled, onMarkWorn,
}: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const colorHex = COLOR_HEX[article.color];

  const rows: [string, string][] = [
    ['Type', ARTICLE_TYPE_LABELS[article.type]],
    ...(article.brand ? [['Brand', article.brand] as [string, string]] : []),
    ...(article.color ? [['Color', article.color] as [string, string]] : []),
    ...(article.fabric ? [['Fabric', article.fabric] as [string, string]] : []),
    ...(article.fit ? [['Fit', article.fit] as [string, string]] : []),
    ...(article.size ? [['Size', article.size] as [string, string]] : []),
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        title={article.name}
        onBack={onBack}
        serif
        right={
          <button onClick={onEdit} className="font-mono text-[10px] uppercase tracking-wider text-primary px-2">
            Edit
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* Photo */}
        <div
          className="relative overflow-hidden"
          style={{ height: 260, backgroundColor: colorHex + '18' }}
        >
          {article.photoUrl && !imgFailed ? (
            <img
              src={article.photoUrl}
              alt={article.name}
              className="w-full h-full object-cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="pattern-grid absolute inset-0 opacity-30" />
          )}
          {/* Color blob for empty state */}
          {(!article.photoUrl || imgFailed) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full opacity-40" style={{ backgroundColor: colorHex }} />
            </div>
          )}
        </div>

        {/* Spec sheet rows */}
        <div className="px-4 pt-4 pb-2">
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            {rows.map(([k, v], i) => (
              <div key={k} className={`flex items-center px-3 py-2.5 ${i > 0 ? 'border-t border-border/60' : ''}`}>
                <span className="flex-none font-mono text-[9px] uppercase tracking-widest text-muted-foreground w-20">{k}</span>
                <span className="flex-1 font-sans text-sm capitalize">{v}</span>
                {k === 'Color' && (
                  <span className="w-4 h-4 rounded-full ml-2 flex-none border border-border"
                    style={{ backgroundColor: colorHex }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Storage location */}
        <div className="px-4 py-2">
          <div className="bg-card border border-dashed border-border rounded-sm p-3 flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-none text-muted-foreground">
              <path d="M21 8l-3-5H6L3 8" /><rect x="3" y="8" width="18" height="13" rx="1" /><line x1="9" y1="14" x2="15" y2="14" />
            </svg>
            {space ? (
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-medium truncate">{space.name}</p>
                {space.subLocation && (
                  <p className="font-mono text-[10px] text-muted-foreground">{space.subLocation}</p>
                )}
              </div>
            ) : (
              <p className="flex-1 font-sans text-sm text-muted-foreground italic">Unassigned</p>
            )}
            {space && (
              <button onClick={onLocate} className="font-mono text-[9px] uppercase tracking-wider text-primary flex-none">
                View →
              </button>
            )}
          </div>
        </div>

        {/* Wear history */}
        {wearHistoryEnabled && (
          <div className="px-4 py-2">
            <div className="bg-card border border-border rounded-sm p-3 flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Times Worn</p>
                <p className="font-serif text-2xl font-semibold mt-0.5">{article.wearCount}</p>
                {article.lastWornAt && (
                  <p className="font-mono text-[9px] text-muted-foreground mt-0.5">
                    Last: {new Date(article.lastWornAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
              <button
                onClick={onMarkWorn}
                className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-primary text-primary rounded-sm active:bg-primary active:text-primary-foreground transition-colors"
              >
                Mark worn
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
