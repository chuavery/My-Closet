# Fix Plan: Import Issues, Errors & Strict Typing

## Category 1: WatermelonDB Decorator Errors (46 TS1240 errors)

**Problem:** `@field`, `@relation`, `@children` decorators don't satisfy strict `PropertyDecorator` signature.

**Fix:** Create `src/types/watermelondb.d.ts` ambient declaration file.

---

## Category 2: WatermelonDB Model `any` Types (14 occurrences)

**Problem:** All `@relation` and `@children` properties typed as `any`.

**Fix:** Import `Relation` and `Query` from `@nozbe/watermelondb` and replace `any` with proper types in all 9 model files.

| Model | Property | Type |
|-------|----------|------|
| ArticleModel | `storageSpace` | `Relation<StorageSpaceModel>` |
| StorageSpaceModel | `articles` | `Query<ArticleModel>` |
| OutfitModel | `outfitArticles` | `Query<OutfitArticleModel>` |
| OutfitModel | `outfitTags` | `Query<OutfitTagModel>` |
| OutfitArticleModel | `outfit` | `Relation<OutfitModel>` |
| OutfitArticleModel | `article` | `Relation<ArticleModel>` |
| TagModel | `articleTags` | `Query<ArticleTagModel>` |
| TagModel | `outfitTags` | `Query<OutfitTagModel>` |
| ArticleTagModel | `article` | `Relation<ArticleModel>` |
| ArticleTagModel | `tag` | `Relation<TagModel>` |
| OutfitTagModel | `outfit` | `Relation<OutfitModel>` |
| OutfitTagModel | `tag` | `Relation<TagModel>` |
| WearLogModel | `article` | `Relation<ArticleModel>` |
| WearLogModel | `outfit` | `Relation<OutfitModel>` |

---

## Category 3: Local Repository Type Errors (5 errors)

### 3a. `LocalArticleRepository.ts`
- **Line 78:** `rec.storageSpaceId` doesn't exist — use `rec.storageSpace.set()`
- **Line 81:** `lastWornAt` null vs undefined — use `?? undefined`
- **Line 110:** Same `storageSpaceId` issue — use `rec.storageSpace.set()`
- **Line 119:** `(l: any)` — remove any, add `@field` decorators to ArticleTagModel
- **Lines 49-62:** `create()` drops `storageSpaceId` — add `rec.storageSpace.set()`

### 3b. `LocalOutfitRepository.ts`
- **Line 67:** `lastWornAt` null vs undefined — use `?? undefined`

---

## Category 4: Screen FlatList Type Errors (3 errors)

**Problem:** Manual `{ item: { id: string; [key: string]: any } }` type annotations conflict with inferred types.

**Fix:** Remove all manual type annotations in:
- `app/(tabs)/closet.tsx` lines 79, 86-87
- `app/(tabs)/storage.tsx` lines 48, 50
- `app/outfit/[id].tsx` lines 82, 90

---

## Category 5: ViewModel Type Safety (3 issues)

### 5a. `useClosetHome.ts` line 63
- `setFilter` value type too loose — use generic: `<K extends keyof ClosetFilters>(key: K, value: ClosetFilters[K])`

### 5b. `useArticleForm.ts` line 78
- Fabricated return value after update — re-fetch from repository

### 5c. `useOutfitBuilder.ts` line 55
- `outfitId ?? ''` passes empty string — guard with `if (!outfitId) return`

---

## Category 6: Architecture Violations (2 issues)

### 6a. `app/(tabs)/outfits.tsx`
- Calls `outfitRepository.getAll()` directly — create `useOutfitList` ViewModel

### 6b. `app/storage/[id].tsx`
- Calls repos directly — create `useStorageSpaceDetail` ViewModel

---

## Category 7: Mock Repository Cascade Gap (1 issue)

### 7a. `MockWearLogRepository.ts`
- `logOutfitWorn` doesn't cascade to individual articles — inject `articleRepository` and `outfitRepository` to create per-article logs

---

## Category 8: ArticleTagModel Missing Fields (1 issue)

### 8a. `ArticleTagModel.ts`
- Missing `@field('article_id')` and `@field('tag_id')` for direct column access in queries

---

## Files to Create (2)
1. `src/types/watermelondb.d.ts`

## Files to Create (ViewModels) (2)
1. `src/viewmodels/useOutfitList.ts`
2. `src/viewmodels/useStorageSpaceDetail.ts`

## Files to Modify (22)
1. `src/lib/watermelon/models/ArticleModel.ts`
2. `src/lib/watermelon/models/StorageSpaceModel.ts`
3. `src/lib/watermelon/models/OutfitModel.ts`
4. `src/lib/watermelon/models/OutfitArticleModel.ts`
5. `src/lib/watermelon/models/TagModel.ts`
6. `src/lib/watermelon/models/ArticleTagModel.ts`
7. `src/lib/watermelon/models/OutfitTagModel.ts`
8. `src/lib/watermelon/models/WearLogModel.ts`
9. `src/lib/watermelon/models/UserSettingsModel.ts`
10. `src/repositories/local/LocalArticleRepository.ts`
11. `src/repositories/local/LocalOutfitRepository.ts`
12. `src/repositories/mock/MockWearLogRepository.ts`
13. `src/viewmodels/useClosetHome.ts`
14. `src/viewmodels/useArticleForm.ts`
15. `src/viewmodels/useOutfitBuilder.ts`
16. `app/(tabs)/closet.tsx`
17. `app/(tabs)/outfits.tsx`
18. `app/(tabs)/storage.tsx`
19. `app/outfit/[id].tsx`
20. `app/storage/[id].tsx`
