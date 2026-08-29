import { useState, useEffect, useCallback } from 'react';
import type { Article, StorageSpace, Outfit, Occasion, Layer } from './models';
import {
  ArticleRepository,
  StorageSpaceRepository,
  OutfitRepository,
  SettingsRepository,
  seedIfNeeded,
} from './repositories';

import BottomNav from './views/components/BottomNav';
import ClosetHomeScreen from './views/ClosetHomeScreen';
import AddEditArticleScreen from './views/AddEditArticleScreen';
import ArticleDetailScreen from './views/ArticleDetailScreen';
import StorageSpacesScreen from './views/StorageSpacesScreen';
import StorageSpaceDetailScreen from './views/StorageSpaceDetailScreen';
import OutfitsListScreen from './views/OutfitsListScreen';
import OutfitBuilderScreen from './views/OutfitBuilderScreen';
import OutfitDetailScreen from './views/OutfitDetailScreen';
import SettingsScreen from './views/SettingsScreen';

type Tab = 'closet' | 'outfits' | 'storage' | 'settings';

type Screen =
  | { name: 'closet-home' }
  | { name: 'add-article'; articleId?: string }
  | { name: 'article-detail'; articleId: string }
  | { name: 'storage-spaces' }
  | { name: 'storage-space-detail'; spaceId: string }
  | { name: 'unassigned-articles' }
  | { name: 'outfits-list' }
  | { name: 'outfit-builder'; outfitId?: string }
  | { name: 'outfit-detail'; outfitId: string }
  | { name: 'settings' };

function tabForScreen(screen: Screen): Tab {
  switch (screen.name) {
    case 'closet-home':
    case 'add-article':
    case 'article-detail':
      return 'closet';
    case 'outfits-list':
    case 'outfit-builder':
    case 'outfit-detail':
      return 'outfits';
    case 'storage-spaces':
    case 'storage-space-detail':
    case 'unassigned-articles':
      return 'storage';
    case 'settings':
      return 'settings';
  }
}

const TAB_HOME: Record<Tab, Screen> = {
  closet: { name: 'closet-home' },
  outfits: { name: 'outfits-list' },
  storage: { name: 'storage-spaces' },
  settings: { name: 'settings' },
};

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [spaces, setSpaces] = useState<StorageSpace[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [settings, setSettings] = useState(SettingsRepository.get());
  const [screen, setScreen] = useState<Screen>({ name: 'closet-home' });
  const [history, setHistory] = useState<Screen[]>([]);

  const refresh = useCallback(() => {
    setArticles(ArticleRepository.getAll());
    setSpaces(StorageSpaceRepository.getAll());
    setOutfits(OutfitRepository.getAll());
    setSettings(SettingsRepository.get());
  }, []);

  useEffect(() => {
    seedIfNeeded();
    refresh();
  }, [refresh]);

  function navigate(to: Screen) {
    setHistory(prev => [...prev, screen]);
    setScreen(to);
  }

  function goBack() {
    const prev = history[history.length - 1];
    if (prev) {
      setHistory(h => h.slice(0, -1));
      setScreen(prev);
    }
  }

  function switchTab(tab: Tab) {
    setHistory([]);
    setScreen(TAB_HOME[tab]);
  }

  // ─── Article handlers ─────────────────────────────────────────────────────

  function handleSaveArticle(data: Omit<Article, 'id' | 'createdAt' | 'wearCount' | 'lastWornAt'>) {
    const currentScreen = screen;
    const existingId = currentScreen.name === 'add-article' ? currentScreen.articleId : undefined;
    ArticleRepository.save(existingId ? { ...data, id: existingId } : data);
    refresh();
    goBack();
  }

  function handleDeleteArticle() {
    const currentScreen = screen;
    if (currentScreen.name === 'add-article' && currentScreen.articleId) {
      ArticleRepository.delete(currentScreen.articleId);
      refresh();
      setHistory([]);
      setScreen({ name: 'closet-home' });
    }
  }

  function handleMarkArticleWorn(articleId: string) {
    ArticleRepository.markWorn(articleId);
    refresh();
  }

  // ─── Storage Space handlers ────────────────────────────────────────────────

  function handleSaveSpace(name: string, subLocation: string) {
    StorageSpaceRepository.save({ name, subLocation });
    refresh();
  }

  function handleDeleteSpace(id: string) {
    StorageSpaceRepository.delete(id);
    refresh();
    goBack();
  }

  function handleReassignArticle(articleId: string, spaceId: string) {
    const article = ArticleRepository.getById(articleId);
    if (article) {
      ArticleRepository.save({ ...article, storageSpaceId: spaceId });
      refresh();
    }
  }

  // ─── Outfit handlers ───────────────────────────────────────────────────────

  function handleSaveOutfit(data: { name: string; occasions: Occasion[]; articles: { articleId: string; layer: Layer }[] }) {
    const currentScreen = screen;
    const existingId = currentScreen.name === 'outfit-builder' ? currentScreen.outfitId : undefined;
    const existingOutfit = existingId ? OutfitRepository.getById(existingId) : undefined;
    const saved = OutfitRepository.save(existingId ? { ...data, id: existingId, createdAt: existingOutfit?.createdAt, wearCount: existingOutfit?.wearCount, lastWornAt: existingOutfit?.lastWornAt } : data);
    refresh();
    setHistory([]);
    setScreen({ name: 'outfit-detail', outfitId: saved.id });
  }

  function handleMarkOutfitWorn(outfitId: string) {
    OutfitRepository.markWorn(outfitId);
    refresh();
  }

  // ─── Settings ─────────────────────────────────────────────────────────────

  function handleToggleWearHistory() {
    const next = { ...settings, wearHistoryEnabled: !settings.wearHistoryEnabled };
    SettingsRepository.save(next);
    setSettings(next);
  }

  function handleClearData() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('mc_')) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    seedIfNeeded();
    refresh();
    setHistory([]);
    setScreen({ name: 'closet-home' });
  }

  // ─── Render current screen ─────────────────────────────────────────────────

  const activeTab = tabForScreen(screen);

  function renderScreen() {
    switch (screen.name) {
      case 'closet-home':
        return (
          <ClosetHomeScreen
            articles={articles}
            onAddArticle={() => navigate({ name: 'add-article' })}
            onArticleClick={id => navigate({ name: 'article-detail', articleId: id })}
          />
        );

      case 'add-article': {
        const existing = screen.articleId ? ArticleRepository.getById(screen.articleId) : undefined;
        return (
          <AddEditArticleScreen
            article={existing}
            spaces={spaces}
            onSave={handleSaveArticle}
            onDelete={screen.articleId ? handleDeleteArticle : undefined}
            onBack={goBack}
          />
        );
      }

      case 'article-detail': {
        const article = ArticleRepository.getById(screen.articleId);
        if (!article) return null;
        const space = article.storageSpaceId ? StorageSpaceRepository.getById(article.storageSpaceId) : undefined;
        return (
          <ArticleDetailScreen
            article={article}
            space={space}
            onBack={goBack}
            onEdit={() => navigate({ name: 'add-article', articleId: article.id })}
            onLocate={() => space && navigate({ name: 'storage-space-detail', spaceId: space.id })}
            wearHistoryEnabled={settings.wearHistoryEnabled}
            onMarkWorn={() => handleMarkArticleWorn(article.id)}
          />
        );
      }

      case 'storage-spaces':
        return (
          <StorageSpacesScreen
            spaces={spaces}
            articles={articles}
            onSpaceClick={id => navigate({ name: 'storage-space-detail', spaceId: id })}
            onSaveSpace={handleSaveSpace}
            onUnassigned={() => navigate({ name: 'unassigned-articles' })}
          />
        );

      case 'storage-space-detail': {
        const space = StorageSpaceRepository.getById(screen.spaceId);
        if (!space) return null;
        const spaceArticles = ArticleRepository.getBySpaceId(space.id);
        return (
          <StorageSpaceDetailScreen
            space={space}
            articles={spaceArticles}
            allSpaces={spaces}
            onBack={goBack}
            onArticleClick={id => navigate({ name: 'article-detail', articleId: id })}
            onDeleteSpace={handleDeleteSpace}
            onReassign={handleReassignArticle}
          />
        );
      }

      case 'unassigned-articles': {
        const unassigned = ArticleRepository.getUnassigned();
        // Reuse StorageSpaceDetailScreen concept with a virtual "unassigned" space
        const virtualSpace: StorageSpace = { id: '', name: 'Unassigned Items', subLocation: 'No storage space', createdAt: '' };
        return (
          <StorageSpaceDetailScreen
            space={virtualSpace}
            articles={unassigned}
            allSpaces={spaces}
            onBack={goBack}
            onArticleClick={id => navigate({ name: 'article-detail', articleId: id })}
            onDeleteSpace={() => {}}
            onReassign={handleReassignArticle}
          />
        );
      }

      case 'outfits-list':
        return (
          <OutfitsListScreen
            outfits={outfits}
            articles={articles}
            onOutfitClick={id => navigate({ name: 'outfit-detail', outfitId: id })}
            onNewOutfit={() => navigate({ name: 'outfit-builder' })}
            wearHistoryEnabled={settings.wearHistoryEnabled}
          />
        );

      case 'outfit-builder': {
        const existing = screen.outfitId ? OutfitRepository.getById(screen.outfitId) : undefined;
        return (
          <OutfitBuilderScreen
            outfit={existing}
            articles={articles}
            onSave={handleSaveOutfit}
            onBack={goBack}
          />
        );
      }

      case 'outfit-detail': {
        const outfit = OutfitRepository.getById(screen.outfitId);
        if (!outfit) return null;
        return (
          <OutfitDetailScreen
            outfit={outfit}
            articles={articles}
            spaces={spaces}
            onBack={goBack}
            onEdit={() => navigate({ name: 'outfit-builder', outfitId: outfit.id })}
            onLocateArticle={spaceId => navigate({ name: 'storage-space-detail', spaceId })}
            wearHistoryEnabled={settings.wearHistoryEnabled}
            onMarkWorn={() => handleMarkOutfitWorn(outfit.id)}
          />
        );
      }

      case 'settings':
        return (
          <SettingsScreen
            settings={settings}
            articleCount={articles.length}
            outfitCount={outfits.length}
            spaceCount={spaces.length}
            onToggleWearHistory={handleToggleWearHistory}
            onClearData={handleClearData}
          />
        );
    }
  }

  return (
    <div className="flex items-start justify-center h-full bg-background">
      {/* Phone shell */}
      <div
        className="relative flex flex-col bg-background"
        style={{ width: '100%', maxWidth: 390, height: '100%', overflow: 'hidden' }}
      >
        {/* Screen content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderScreen()}
        </div>

        {/* Bottom navigation - only show on tab root screens */}
        <BottomNav active={activeTab} onChange={switchTab} />
      </div>
    </div>
  );
}
