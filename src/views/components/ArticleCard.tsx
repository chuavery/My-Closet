import { useState } from 'react';
import type { Article } from '../../models';
import { ARTICLE_TYPE_LABELS, COLOR_HEX } from '../../models';

interface Props {
  article: Article;
  onClick?: () => void;
  compact?: boolean;
}

export default function ArticleCard({ article, onClick, compact = false }: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const colorHex = COLOR_HEX[article.color];

  return (
    <button
      onClick={onClick}
      className="w-full text-left group"
    >
      <div className="notched-corner relative bg-card border border-border overflow-hidden transition-all active:scale-[0.97] active:shadow-none"
        style={{ boxShadow: '0 1px 3px rgba(37,35,32,0.06)' }}>
        {/* Photo */}
        <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: colorHex + '22' }}>
          {article.photoUrl && !imgFailed ? (
            <img
              src={article.photoUrl}
              alt={article.name}
              className="w-full h-full object-cover transition-transform duration-300 group-active:scale-105"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 rounded-full opacity-60" style={{ backgroundColor: colorHex }} />
            </div>
          )}
          {/* Color tag */}
          <div
            className="absolute top-2 left-2 w-3 h-3 rounded-full border border-white/60"
            style={{ backgroundColor: colorHex }}
            title={article.color}
          />
        </div>

        {/* Meta strip */}
        <div className={`px-2.5 ${compact ? 'py-1.5' : 'py-2'} border-t border-border`}>
          <p className={`font-sans font-medium leading-tight truncate ${compact ? 'text-[11px]' : 'text-xs'}`}>
            {article.name}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              {ARTICLE_TYPE_LABELS[article.type]}
            </span>
            {article.size && (
              <>
                <span className="text-border text-[9px]">·</span>
                <span className="font-mono text-[9px] text-muted-foreground">{article.size}</span>
              </>
            )}
          </div>
          {article.brand && !compact && (
            <p className="font-mono text-[9px] text-muted-foreground/70 mt-0.5 truncate">{article.brand}</p>
          )}
        </div>
      </div>
    </button>
  );
}
