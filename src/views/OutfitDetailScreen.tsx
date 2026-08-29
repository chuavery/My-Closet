import type { Outfit, Article, StorageSpace } from '../models';
import { LAYER_LABELS } from '../models';
import { COLOR_HEX } from '../models';
import Header from './components/Header';

interface Props {
  outfit: Outfit;
  articles: Article[];
  spaces: StorageSpace[];
  onBack: () => void;
  onEdit: () => void;
  onLocateArticle: (spaceId: string) => void;
  wearHistoryEnabled: boolean;
  onMarkWorn?: () => void;
}

export default function OutfitDetailScreen({
  outfit, articles, spaces, onBack, onEdit, onLocateArticle, wearHistoryEnabled, onMarkWorn,
}: Props) {
  const getArticle = (id: string) => articles.find(a => a.id === id);
  const getSpace = (id: string) => spaces.find(s => s.id === id);

  const photoArticles = outfit.articles
    .map(oa => getArticle(oa.articleId))
    .filter(Boolean) as Article[];

  return (
    <div className="flex flex-col h-full">
      <Header
        title={outfit.name}
        onBack={onBack}
        serif
        right={
          <button onClick={onEdit} className="font-mono text-[10px] uppercase tracking-wider text-primary px-2">
            Edit
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* Photo collage */}
        <div className="flex h-[200px] border-b border-border overflow-hidden">
          {photoArticles.length > 0 ? (
            photoArticles.slice(0, 5).map((article, i) => (
              <div key={article.id} className="flex-1 relative overflow-hidden"
                style={{ borderLeft: i > 0 ? '1px solid #D0C9B8' : 'none', backgroundColor: COLOR_HEX[article.color] + '20' }}>
                {article.photoUrl ? (
                  <img src={article.photoUrl} alt={article.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 pattern-grid opacity-20" />
                )}
              </div>
            ))
          ) : (
            <div className="w-full pattern-grid opacity-20" />
          )}
        </div>

        {/* Occasion tags */}
        {outfit.occasions.length > 0 && (
          <div className="flex gap-1.5 px-4 pt-3 flex-wrap">
            {outfit.occasions.map(occ => (
              <span key={occ} className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground border border-border px-2 py-1 rounded-sm">
                {occ}
              </span>
            ))}
          </div>
        )}

        {/* Wear history */}
        {wearHistoryEnabled && (
          <div className="mx-4 mt-3 bg-card border border-border rounded-sm p-3 flex items-center justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Times Worn</p>
              <p className="font-serif text-2xl font-semibold mt-0.5">{outfit.wearCount}</p>
              {outfit.lastWornAt && (
                <p className="font-mono text-[9px] text-muted-foreground mt-0.5">
                  Last: {new Date(outfit.lastWornAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
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
        )}

        {/* Articles by layer */}
        <div className="px-4 pt-4 pb-6 space-y-2">
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-3">Articles</p>
          {outfit.articles.map(oa => {
            const article = getArticle(oa.articleId);
            if (!article) return null;
            const space = article.storageSpaceId ? getSpace(article.storageSpaceId) : null;

            return (
              <div key={oa.articleId} className="bg-card border border-border rounded-sm overflow-hidden flex">
                {/* Thumbnail */}
                <div className="w-16 h-16 flex-none border-r border-border overflow-hidden"
                  style={{ backgroundColor: COLOR_HEX[article.color] + '20' }}>
                  {article.photoUrl ? (
                    <img src={article.photoUrl} alt={article.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full opacity-50" style={{ backgroundColor: COLOR_HEX[article.color] }} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 px-3 py-2.5">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{LAYER_LABELS[oa.layer]}</p>
                  <p className="font-sans text-sm font-medium truncate mt-0.5">{article.name}</p>
                  {space ? (
                    <button
                      onClick={() => onLocateArticle(space.id)}
                      className="font-mono text-[9px] text-primary underline underline-offset-1 mt-0.5 truncate max-w-full inline-block"
                    >
                      {space.name}{space.subLocation ? ` · ${space.subLocation}` : ''} →
                    </button>
                  ) : (
                    <p className="font-mono text-[9px] text-muted-foreground/60 italic mt-0.5">Unassigned</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
