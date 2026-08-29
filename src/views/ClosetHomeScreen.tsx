import { useState, useMemo } from 'react';
import type { Article, ArticleType, Color } from '../models';
import { ARTICLE_TYPES, ARTICLE_TYPE_LABELS, COLORS, COLOR_HEX } from '../models';
import Header from './components/Header';
import ArticleCard from './components/ArticleCard';

interface Props {
  articles: Article[];
  onAddArticle: () => void;
  onArticleClick: (id: string) => void;
}

export default function ClosetHomeScreen({ articles, onAddArticle, onArticleClick }: Props) {
  const [search, setSearch] = useState('');
  const [filterColor, setFilterColor] = useState<Color | ''>('');
  const [filterType, setFilterType] = useState<ArticleType | ''>('');

  const filtered = useMemo(() => {
    return articles.filter(a => {
      if (filterColor && a.color !== filterColor) return false;
      if (filterType && a.type !== filterType) return false;
      if (search) {
        const q = search.toLowerCase();
        return a.name.toLowerCase().includes(q) ||
          a.brand.toLowerCase().includes(q) ||
          a.fabric.toLowerCase().includes(q);
      }
      return true;
    });
  }, [articles, filterColor, filterType, search]);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="My Closet"
        subtitle={`${articles.length} articles`}
        serif
        right={
          <button
            onClick={onAddArticle}
            className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-sm active:opacity-80 transition-opacity"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        }
      />

      {/* Search */}
      <div className="flex-none px-4 pt-3 pb-2">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search name, brand, fabric…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-sm pl-9 pr-3 py-2 text-sm font-sans placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex-none px-4 pb-3 space-y-2">
        {/* Color filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          <button
            onClick={() => setFilterColor('')}
            className={`flex-none font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-sm border transition-colors ${
              !filterColor ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'
            }`}
          >
            All
          </button>
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setFilterColor(filterColor === c ? '' : c)}
              className={`flex-none flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-sm border transition-colors ${
                filterColor === c ? 'border-primary bg-primary/10' : 'bg-card border-border text-muted-foreground'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full border border-white/40 flex-none"
                style={{ backgroundColor: COLOR_HEX[c] }} />
              {c}
            </button>
          ))}
        </div>

        {/* Type filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          <button
            onClick={() => setFilterType('')}
            className={`flex-none font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-sm border transition-colors ${
              !filterType ? 'bg-foreground text-card border-foreground' : 'bg-card border-border text-muted-foreground'
            }`}
          >
            All Types
          </button>
          {ARTICLE_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(filterType === t ? '' : t)}
              className={`flex-none font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-sm border transition-colors ${
                filterType === t ? 'bg-foreground text-card border-foreground' : 'bg-card border-border text-muted-foreground'
              }`}
            >
              {ARTICLE_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="w-12 h-12 border border-dashed border-border rounded-sm flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6 text-muted-foreground">
                <rect x="3" y="4" width="18" height="17" rx="1" /><line x1="12" y1="4" x2="12" y2="21" />
              </svg>
            </div>
            <p className="font-serif text-sm text-muted-foreground">
              {articles.length === 0 ? 'Your closet is empty' : 'No matching items'}
            </p>
            {articles.length === 0 && (
              <button onClick={onAddArticle} className="mt-3 font-mono text-[10px] uppercase tracking-wider text-primary underline underline-offset-2">
                Add first article
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => onArticleClick(article.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
