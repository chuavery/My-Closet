import type { Article, StorageSpace, Outfit, UserSettings } from '../models';

const KEYS = {
  articles: 'mc_articles',
  spaces: 'mc_spaces',
  outfits: 'mc_outfits',
  settings: 'mc_settings',
  seeded: 'mc_seeded',
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_SPACES: StorageSpace[] = [
  { id: 'ss1', name: 'Bedroom Closet', subLocation: 'Top Shelf', createdAt: '2024-09-01T08:00:00Z' },
  { id: 'ss2', name: 'Bedroom Closet', subLocation: 'Lower Shelf', createdAt: '2024-09-01T08:01:00Z' },
  { id: 'ss3', name: 'Bedroom Closet', subLocation: 'Shoe Rack', createdAt: '2024-09-01T08:02:00Z' },
  { id: 'ss4', name: 'Guest Room', subLocation: 'Wardrobe', createdAt: '2024-09-01T08:03:00Z' },
  { id: 'ss5', name: 'Hallway', subLocation: 'Coat Hooks', createdAt: '2024-09-01T08:04:00Z' },
];

const SEED_ARTICLES: Article[] = [
  {
    id: 'a1', name: 'White Oxford Shirt', brand: 'COS', type: 'shirt', color: 'white',
    fabric: 'Cotton', fit: 'Slim', size: 'M',
    photoUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&auto=format',
    storageSpaceId: 'ss1', createdAt: '2024-09-02T10:00:00Z', lastWornAt: '', wearCount: 0,
  },
  {
    id: 'a2', name: 'Navy Wool Blazer', brand: 'Zara', type: 'jacket', color: 'blue',
    fabric: 'Wool', fit: 'Tailored', size: 'M',
    photoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop&auto=format',
    storageSpaceId: 'ss1', createdAt: '2024-09-02T10:05:00Z', lastWornAt: '', wearCount: 0,
  },
  {
    id: 'a3', name: 'Black Slim Trousers', brand: 'Uniqlo', type: 'pants', color: 'black',
    fabric: 'Cotton blend', fit: 'Slim', size: '32×32',
    photoUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop&auto=format',
    storageSpaceId: 'ss2', createdAt: '2024-09-02T10:10:00Z', lastWornAt: '', wearCount: 0,
  },
  {
    id: 'a4', name: 'Indigo Denim Jacket', brand: "Levi's", type: 'jacket', color: 'indigo',
    fabric: 'Denim', fit: 'Regular', size: 'M',
    photoUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop&auto=format',
    storageSpaceId: 'ss4', createdAt: '2024-09-02T10:15:00Z', lastWornAt: '', wearCount: 0,
  },
  {
    id: 'a5', name: 'Ivory Cashmere Sweater', brand: 'Everlane', type: 'sweater', color: 'white',
    fabric: 'Cashmere', fit: 'Relaxed', size: 'M',
    photoUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format',
    storageSpaceId: 'ss1', createdAt: '2024-09-02T10:20:00Z', lastWornAt: '', wearCount: 0,
  },
  {
    id: 'a6', name: 'White Leather Sneakers', brand: 'Common Projects', type: 'shoes', color: 'white',
    fabric: '', fit: '', size: '42',
    photoUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&auto=format',
    storageSpaceId: 'ss3', createdAt: '2024-09-02T10:25:00Z', lastWornAt: '', wearCount: 0,
  },
  {
    id: 'a7', name: 'Terracotta Linen Shirt', brand: 'Arket', type: 'shirt', color: 'orange',
    fabric: 'Linen', fit: 'Relaxed', size: 'M',
    photoUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&auto=format',
    storageSpaceId: 'ss2', createdAt: '2024-09-02T10:30:00Z', lastWornAt: '', wearCount: 0,
  },
  {
    id: 'a8', name: 'Tan Leather Belt', brand: 'Reiss', type: 'accessory', color: 'brown',
    fabric: 'Leather', fit: '', size: '34"',
    photoUrl: 'https://images.unsplash.com/photo-1553020420-5ba54bb09c01?w=400&h=400&fit=crop&auto=format',
    storageSpaceId: 'ss2', createdAt: '2024-09-02T10:35:00Z', lastWornAt: '', wearCount: 0,
  },
  {
    id: 'a9', name: 'Charcoal Overcoat', brand: 'Theory', type: 'coat', color: 'black',
    fabric: 'Wool', fit: 'Slim', size: 'M',
    photoUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop&auto=format',
    storageSpaceId: 'ss5', createdAt: '2024-09-02T10:40:00Z', lastWornAt: '', wearCount: 0,
  },
  {
    id: 'a10', name: 'Black Chelsea Boots', brand: 'Blundstone', type: 'shoes', color: 'black',
    fabric: 'Leather', fit: '', size: '43',
    photoUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=400&fit=crop&auto=format',
    storageSpaceId: 'ss3', createdAt: '2024-09-02T10:45:00Z', lastWornAt: '', wearCount: 0,
  },
];

const SEED_OUTFITS: Outfit[] = [
  {
    id: 'o1', name: 'Smart Friday', occasions: ['smart casual'],
    articles: [
      { articleId: 'a1', layer: 'base' },
      { articleId: 'a2', layer: 'mid' },
      { articleId: 'a3', layer: 'bottom' },
      { articleId: 'a6', layer: 'footwear' },
      { articleId: 'a8', layer: 'accessory' },
    ],
    createdAt: '2024-09-10T08:00:00Z', lastWornAt: '', wearCount: 0,
  },
  {
    id: 'o2', name: 'Weekend Casual', occasions: ['casual'],
    articles: [
      { articleId: 'a5', layer: 'base' },
      { articleId: 'a4', layer: 'outer' },
      { articleId: 'a3', layer: 'bottom' },
      { articleId: 'a6', layer: 'footwear' },
    ],
    createdAt: '2024-09-10T09:00:00Z', lastWornAt: '', wearCount: 0,
  },
  {
    id: 'o3', name: 'Autumn Walk', occasions: ['casual', 'outdoor'],
    articles: [
      { articleId: 'a7', layer: 'base' },
      { articleId: 'a9', layer: 'outer' },
      { articleId: 'a3', layer: 'bottom' },
      { articleId: 'a10', layer: 'footwear' },
    ],
    createdAt: '2024-09-10T10:00:00Z', lastWornAt: '', wearCount: 0,
  },
];

export function seedIfNeeded(): void {
  if (localStorage.getItem(KEYS.seeded)) return;
  save(KEYS.spaces, SEED_SPACES);
  save(KEYS.articles, SEED_ARTICLES);
  save(KEYS.outfits, SEED_OUTFITS);
  save(KEYS.settings, { wearHistoryEnabled: false } satisfies UserSettings);
  localStorage.setItem(KEYS.seeded, '1');
}

// ─── Article Repository ───────────────────────────────────────────────────────

export const ArticleRepository = {
  getAll(): Article[] {
    return load<Article[]>(KEYS.articles, []);
  },
  getById(id: string): Article | undefined {
    return this.getAll().find(a => a.id === id);
  },
  getBySpaceId(spaceId: string): Article[] {
    return this.getAll().filter(a => a.storageSpaceId === spaceId);
  },
  getUnassigned(): Article[] {
    return this.getAll().filter(a => !a.storageSpaceId);
  },
  save(article: Omit<Article, 'id' | 'createdAt' | 'wearCount' | 'lastWornAt'> & Partial<Article>): Article {
    const all = this.getAll();
    const existing = article.id ? all.findIndex(a => a.id === article.id) : -1;
    const saved: Article = {
      id: article.id ?? uid(),
      createdAt: article.createdAt ?? new Date().toISOString(),
      wearCount: article.wearCount ?? 0,
      lastWornAt: article.lastWornAt ?? '',
      name: article.name,
      brand: article.brand,
      type: article.type,
      color: article.color,
      fabric: article.fabric,
      fit: article.fit,
      size: article.size,
      photoUrl: article.photoUrl,
      storageSpaceId: article.storageSpaceId,
    };
    if (existing >= 0) {
      all[existing] = saved;
    } else {
      all.push(saved);
    }
    save(KEYS.articles, all);
    return saved;
  },
  delete(id: string): void {
    save(KEYS.articles, this.getAll().filter(a => a.id !== id));
  },
  markWorn(id: string): void {
    const all = this.getAll();
    const idx = all.findIndex(a => a.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], lastWornAt: new Date().toISOString(), wearCount: all[idx].wearCount + 1 };
      save(KEYS.articles, all);
    }
  },
  unassignFromSpace(spaceId: string): void {
    const all = this.getAll().map(a =>
      a.storageSpaceId === spaceId ? { ...a, storageSpaceId: '' } : a,
    );
    save(KEYS.articles, all);
  },
};

// ─── StorageSpace Repository ──────────────────────────────────────────────────

export const StorageSpaceRepository = {
  getAll(): StorageSpace[] {
    return load<StorageSpace[]>(KEYS.spaces, []);
  },
  getById(id: string): StorageSpace | undefined {
    return this.getAll().find(s => s.id === id);
  },
  save(space: Partial<StorageSpace> & { name: string }): StorageSpace {
    const all = this.getAll();
    const existing = space.id ? all.findIndex(s => s.id === space.id) : -1;
    const saved: StorageSpace = {
      id: space.id ?? uid(),
      name: space.name,
      subLocation: space.subLocation ?? '',
      createdAt: space.createdAt ?? new Date().toISOString(),
    };
    if (existing >= 0) { all[existing] = saved; } else { all.push(saved); }
    save(KEYS.spaces, all);
    return saved;
  },
  delete(id: string): void {
    ArticleRepository.unassignFromSpace(id);
    save(KEYS.spaces, this.getAll().filter(s => s.id !== id));
  },
};

// ─── Outfit Repository ────────────────────────────────────────────────────────

export const OutfitRepository = {
  getAll(): Outfit[] {
    return load<Outfit[]>(KEYS.outfits, []);
  },
  getById(id: string): Outfit | undefined {
    return this.getAll().find(o => o.id === id);
  },
  save(outfit: Partial<Outfit> & { name: string; articles: Outfit['articles']; occasions: Outfit['occasions'] }): Outfit {
    const all = this.getAll();
    const existing = outfit.id ? all.findIndex(o => o.id === outfit.id) : -1;
    const saved: Outfit = {
      id: outfit.id ?? uid(),
      name: outfit.name,
      occasions: outfit.occasions,
      articles: outfit.articles,
      createdAt: outfit.createdAt ?? new Date().toISOString(),
      lastWornAt: outfit.lastWornAt ?? '',
      wearCount: outfit.wearCount ?? 0,
    };
    if (existing >= 0) { all[existing] = saved; } else { all.push(saved); }
    save(KEYS.outfits, all);
    return saved;
  },
  delete(id: string): void {
    save(KEYS.outfits, this.getAll().filter(o => o.id !== id));
  },
  markWorn(id: string): void {
    const all = this.getAll();
    const idx = all.findIndex(o => o.id === id);
    if (idx >= 0) {
      const outfit = all[idx];
      outfit.articles.forEach(oa => ArticleRepository.markWorn(oa.articleId));
      all[idx] = { ...outfit, lastWornAt: new Date().toISOString(), wearCount: outfit.wearCount + 1 };
      save(KEYS.outfits, all);
    }
  },
};

// ─── Settings Repository ──────────────────────────────────────────────────────

export const SettingsRepository = {
  get(): UserSettings {
    return load<UserSettings>(KEYS.settings, { wearHistoryEnabled: false });
  },
  save(settings: UserSettings): void {
    save(KEYS.settings, settings);
  },
};
