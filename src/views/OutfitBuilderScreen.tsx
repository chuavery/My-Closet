import { useState } from 'react';
import type { Article, Layer, Occasion, Outfit } from '../models';
import { LAYERS, LAYER_LABELS, OCCASIONS } from '../models';
import { COLOR_HEX } from '../models';
import Header from './components/Header';

interface Props {
  outfit?: Outfit;
  articles: Article[];
  onSave: (data: { name: string; occasions: Occasion[]; articles: { articleId: string; layer: Layer }[] }) => void;
  onBack: () => void;
}

export default function OutfitBuilderScreen({ outfit, articles, onSave, onBack }: Props) {
  const [name, setName] = useState(outfit?.name ?? '');
  const [occasions, setOccasions] = useState<Occasion[]>(outfit?.occasions ?? []);
  const [slots, setSlots] = useState<Partial<Record<Layer, string>>>(() => {
    const init: Partial<Record<Layer, string>> = {};
    outfit?.articles.forEach(oa => { init[oa.layer] = oa.articleId; });
    return init;
  });
  const [activeSlot, setActiveSlot] = useState<Layer | null>(null);
  const [articleSearch, setArticleSearch] = useState('');

  const getArticle = (id: string) => articles.find(a => a.id === id);

  function assignSlot(layer: Layer, articleId: string) {
    setSlots(prev => ({ ...prev, [layer]: articleId }));
    setActiveSlot(null);
    setArticleSearch('');
  }

  function clearSlot(layer: Layer) {
    setSlots(prev => { const n = { ...prev }; delete n[layer]; return n; });
  }

  function toggleOccasion(occ: Occasion) {
    setOccasions(prev =>
      prev.includes(occ) ? prev.filter(o => o !== occ) : [...prev, occ],
    );
  }

  function handleSave() {
    if (!name.trim()) return;
    const articlesList = LAYERS.filter(l => slots[l]).map(l => ({ articleId: slots[l]!, layer: l }));
    onSave({ name: name.trim(), occasions, articles: articlesList });
  }

  const filteredArticles = articles.filter(a => {
    if (!articleSearch) return true;
    const q = articleSearch.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.type.includes(q);
  });

  const usedIds = new Set(Object.values(slots).filter(Boolean));

  return (
    <div className="flex flex-col h-full">
      <Header
        title={outfit ? 'Edit Outfit' : 'Build Outfit'}
        onBack={onBack}
        serif
        right={
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 bg-primary text-primary-foreground rounded-sm disabled:opacity-40 active:opacity-80 transition-opacity"
          >
            Save
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* Outfit name */}
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <input
            type="text"
            placeholder="Outfit name…"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-transparent font-serif text-xl font-semibold placeholder:text-muted-foreground/40 focus:outline-none border-b border-dashed border-border pb-1"
          />
          {/* Occasion tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {OCCASIONS.map(occ => (
              <button
                key={occ}
                onClick={() => toggleOccasion(occ)}
                className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-sm border transition-colors ${
                  occasions.includes(occ)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border text-muted-foreground'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        {/* Layer slots */}
        <div className="px-4 pt-3 pb-4 space-y-2">
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-2">Layers</p>
          {LAYERS.map(layer => {
            const articleId = slots[layer];
            const article = articleId ? getArticle(articleId) : null;
            const isActive = activeSlot === layer;

            return (
              <div key={layer}>
                <div
                  className={`flex items-center gap-3 border rounded-sm transition-all ${
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card'
                  }`}
                >
                  {/* Thumb */}
                  <div className="w-14 h-14 flex-none border-r border-border overflow-hidden flex items-center justify-center bg-muted/30">
                    {article ? (
                      article.photoUrl ? (
                        <img src={article.photoUrl} alt={article.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: COLOR_HEX[article.color] }} />
                      )
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-5 h-5 text-border">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 py-2">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{LAYER_LABELS[layer]}</p>
                    {article ? (
                      <p className="font-sans text-sm font-medium truncate mt-0.5">{article.name}</p>
                    ) : (
                      <p className="font-sans text-xs text-muted-foreground/60 italic mt-0.5">Empty</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 pr-2">
                    {article && (
                      <button
                        onClick={() => clearSlot(layer)}
                        className="w-6 h-6 flex items-center justify-center text-muted-foreground active:text-primary"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => setActiveSlot(isActive ? null : layer)}
                      className={`w-7 h-7 flex items-center justify-center rounded-sm border transition-colors ${
                        isActive ? 'bg-primary border-primary text-primary-foreground' : 'border-border text-muted-foreground'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Picker tray */}
                {isActive && (
                  <div className="border border-t-0 border-primary/30 bg-card rounded-b-sm overflow-hidden fade-in">
                    <div className="p-2 border-b border-border/50">
                      <input
                        type="text"
                        placeholder="Search articles…"
                        value={articleSearch}
                        onChange={e => setArticleSearch(e.target.value)}
                        autoFocus
                        className="w-full bg-background border border-border rounded-sm px-2.5 py-1.5 text-xs font-sans focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-border/40">
                      {filteredArticles.length === 0 ? (
                        <p className="px-3 py-3 font-mono text-[10px] text-muted-foreground">No articles found</p>
                      ) : (
                        filteredArticles.map(a => (
                          <button
                            key={a.id}
                            onClick={() => assignSlot(layer, a.id)}
                            disabled={usedIds.has(a.id) && slots[layer] !== a.id}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-left transition-colors ${
                              slots[layer] === a.id
                                ? 'bg-primary/10'
                                : usedIds.has(a.id)
                                ? 'opacity-30'
                                : 'active:bg-secondary'
                            }`}
                          >
                            <div
                              className="w-8 h-8 flex-none rounded-sm overflow-hidden border border-border"
                              style={{ backgroundColor: COLOR_HEX[a.color] + '30' }}
                            >
                              {a.photoUrl && (
                                <img src={a.photoUrl} alt={a.name} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-sans text-xs font-medium truncate">{a.name}</p>
                              <p className="font-mono text-[9px] text-muted-foreground capitalize">{a.type}</p>
                            </div>
                            {slots[layer] === a.id && (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-primary flex-none">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
