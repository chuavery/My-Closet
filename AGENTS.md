# AGENTS.md — My Closet

Instructions for any AI coding agent (or human) building this repository. Read this fully before writing code. It defines the architecture, file structure, what belongs in each file, the data model, and the constraints this app must respect.

## 1. Project Summary

My Closet is a **React Native + Expo** mobile app that turns a physical wardrobe into a searchable virtual closet: catalog clothing/accessories by photo, track where each item is physically stored via QR-coded storage spaces, browse/filter the collection, and build outfits from owned pieces. v1 is a **fully offline, single-device app** — no accounts, no server, no network dependency for any core feature.

Full product context lives in `docs/My_Closet_PRD.md` and `docs/my-closet-er-diagram.mermaid`. This file governs _how to build it_; the PRD governs _what to build and why_. If they ever conflict, the PRD's product decisions win and this file should be updated to match.

## 2. Tech Stack

| Layer          | Choice                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| Framework      | React Native + Expo (managed workflow)                                                                                |
| Language       | TypeScript, strict mode on                                                                                            |
| Local database | WatermelonDB (chosen for its built-in offline-first sync engine, which lines up with the Milestone 7 cloud-sync plan) |
| Image storage  | On-device sandboxed file storage, referenced by local file path                                                       |
| Navigation     | Expo Router (file-based, under `app/`)                                                                                |
| Auth           | None in v1                                                                                                            |
| State          | ViewModel hooks (see Architecture) — no global state library needed unless a cross-cutting need emerges               |

Do not introduce a backend, cloud database, or auth provider in v1. That work is explicitly deferred to Milestone 7 in the roadmap (see Section 8).

## 3. Architecture: MVVM + Repository Pattern

This app follows **MVVM (Model–View–ViewModel)**, not MVC — MVVM's binding model maps naturally onto React's declarative, hook-based components.

-   **Model** (`src/models/`) — plain TypeScript types/interfaces for the core entities. No logic, no imports from anywhere else in the app.
-   **View** (`app/`, `src/components/`) — presentational only. Screens and components receive data and callback props; they never call a repository or contain business logic directly.
-   **ViewModel** (`src/viewmodels/`) — one hook per screen or major flow. Owns screen state, derives filtered/sorted data, calls repositories, exposes a clean object of values + handlers for the View to consume.
-   **Repository** (`src/repositories/`) — abstracts data access behind an interface per entity, with swappable implementations (see below). ViewModels depend only on the interface, never on a concrete implementation.

### The mock/local swap (this is the mechanism that lets you build UI without touching the backend)

Every repository is defined as an interface first, with two implementations:

-   `src/repositories/local/*` — real implementation, backed by the local database.
-   `src/repositories/mock/*` — fake implementation, backed by in-memory fixture data from `src/repositories/mock/fixtures/`.

`src/providers/RepositoryProvider.tsx` reads a single env var, `EXPO_PUBLIC_DATA_SOURCE` (`mock` | `local`), once at startup, and provides the corresponding repository set via React Context. ViewModels pull repositories from this context — they must never `import` a concrete repository class directly. This makes switching between "UI playground" and "real data" a one-line env change, never a code change.

## 4. File Structure

```
my-closet/
├── app/                              # Expo Router screens
│   ├── (tabs)/
│   │   ├── index.tsx                # Closet Browser (home)
│   │   ├── outfits.tsx               # Outfit list
│   │   ├── storage.tsx               # Storage Spaces list
│   │   └── settings.tsx              # Settings (incl. Wear History toggle)
│   ├── article/
│   │   ├── [id].tsx                  # Article detail / edit
│   │   └── new.tsx                   # Add Article
│   ├── storage/
│   │   └── [id].tsx                  # Storage Space detail (contents + QR)
│   └── outfit/
│       ├── [id].tsx                  # Outfit detail
│       └── builder.tsx               # Outfit Builder (layering canvas)
│
├── src/
│   ├── models/
│   │   ├── Article.ts
│   │   ├── StorageSpace.ts
│   │   ├── Outfit.ts
│   │   ├── OutfitArticle.ts
│   │   ├── Tag.ts
│   │   ├── WearLog.ts
│   │   └── UserSettings.ts
│   │
│   ├── components/                   # Presentational only, props-driven
│   │   ├── ArticleCard.tsx
│   │   ├── FilterChipRow.tsx
│   │   ├── LayerSlot.tsx
│   │   ├── QRTile.tsx
│   │   ├── OccasionTagPicker.tsx
│   │   ├── StorageSpaceRow.tsx
│   │   └── WornTodayButton.tsx
│   │
│   ├── viewmodels/
│   │   ├── useClosetHome.ts          # grid data, search, filters
│   │   ├── useArticleForm.ts         # add/edit article, incl. storage assignment
│   │   ├── useStorageSpaces.ts       # list, create, delete (+ orphan cascade), QR scan handling
│   │   ├── useOutfitBuilder.ts       # layering state, save, occasion tags
│   │   ├── useOutfitDetail.ts        # view outfit, locate article, mark worn
│   │   └── useSettings.ts            # Wear History toggle and other prefs
│   │
│   ├── repositories/
│   │   ├── interfaces/
│   │   │   ├── ArticleRepository.ts
│   │   │   ├── StorageSpaceRepository.ts
│   │   │   ├── OutfitRepository.ts
│   │   │   ├── TagRepository.ts
│   │   │   ├── WearLogRepository.ts
│   │   │   └── SettingsRepository.ts
│   │   ├── local/
│   │   │   └── Local*Repository.ts   # one per interface, backed by the local DB
│   │   └── mock/
│   │       ├── Mock*Repository.ts    # one per interface, backed by fixtures
│   │       └── fixtures/
│   │           ├── sampleArticles.ts
│   │           ├── sampleStorageSpaces.ts
│   │           ├── sampleOutfits.ts
│   │           └── sampleTags.ts
│   │
│   ├── providers/
│   │   └── RepositoryProvider.tsx    # context + EXPO_PUBLIC_DATA_SOURCE switch
│   │
│   ├── theme/
│   │   ├── colors.ts                 # ink/paper/accent tokens, see Section 7
│   │   ├── typography.ts
│   │   └── spacing.ts
│   │
│   └── lib/
│       ├── watermelon/
│       │   ├── schema.ts             # WatermelonDB appSchema: tables, columns, indexes
│       │   ├── database.ts           # Database instance (adapter + collections)
│       │   └── models/               # WatermelonDB Model classes (@field-decorated), one per table
│       │       ├── ArticleModel.ts
│       │       ├── StorageSpaceModel.ts
│       │       ├── OutfitModel.ts
│       │       ├── OutfitArticleModel.ts
│       │       ├── TagModel.ts
│       │       ├── ArticleTagModel.ts
│       │       ├── OutfitTagModel.ts
│       │       ├── WearLogModel.ts
│       │       └── UserSettingsModel.ts
│       └── qrcode.ts                 # QR generation/parsing helpers
│
├── docs/
│   ├── My_Closet_PRD.md
│   ├── my-closet-er-diagram.mermaid
│   └── My_Closet_Wireframes.html
│
├── assets/
├── .env.example
├── app.json
├── package.json
├── tsconfig.json
└── AGENTS.md                         # this file
```

## 5. File-by-File Contents

### `src/models/`

Plain types only, no behavior. Field lists must match `docs/my-closet-er-diagram.mermaid` exactly — if the two ever diverge, the mermaid diagram is the source of truth and this section should be corrected to match it.

-   **`Article.ts`** — `id, name?, brand?, articleType (enum, required), color (enum, required list — see Section 7), fabricType?, fit?, size?, originalImageUrl, processedImageUrl?, storageSpaceId (nullable), source ('manual' | 'ai_on_device' | 'ai_online'), wearCount, lastWornAt (nullable), createdAt`
-   **`StorageSpace.ts`** — `id, name, subLocation? (freeform, e.g. "Top Shelf"), qrCodeValue, createdAt`. One level only — no parent/child relationship in v1.
-   **`Outfit.ts`** — `id, name, wearCount, lastWornAt (nullable), createdAt`
-   **`OutfitArticle.ts`** — join type: `outfitId, articleId, layerType ('base'|'mid'|'outer'|'bottom'|'footwear'|'accessory'), zIndex`
-   **`Tag.ts`** — `id, name, category ('theme_occasion' | 'custom')`. Shared taxonomy used by both Article filters and Outfit occasions.
-   **`WearLog.ts`** — `id, articleId (nullable), outfitId (nullable), wornDate, createdAt`
-   **`UserSettings.ts`** — `wearHistoryEnabled (boolean, default false)`

### `src/lib/watermelon/`

WatermelonDB-specific persistence layer — **not** the same thing as `src/models/`. `schema.ts` defines the `appSchema` (tables, columns, indexes) and must mirror `docs/my-closet-er-diagram.mermaid` exactly, including the join tables (`ArticleTagModel`, `OutfitTagModel`) that back the `Tag` many-to-many relationships. Each `*Model.ts` extends WatermelonDB's `Model` class with `@field`/`@relation`/`@children` decorators. `database.ts` wires the schema and models to a `SQLiteAdapter` and exports the `Database` instance used by `Local*Repository` implementations.

### `src/repositories/local/`

Each `Local*Repository` implements its interface from `src/repositories/interfaces/` by querying `src/lib/watermelon/database.ts` and **mapping** WatermelonDB Model instances to the plain types in `src/models/` before returning them — ViewModels and components must never see a raw WatermelonDB `Model` object, only plain data. This mapping boundary is also what keeps the future cloud-sync engine (WatermelonDB's `synchronize()`) isolated to this layer; nothing above it needs to change when sync is introduced in Milestone 7.

### `src/repositories/interfaces/`

Each interface should expose CRUD plus the specific queries its ViewModels need. At minimum:

-   **`ArticleRepository`** — `getAll, getById, create, update, delete, getByStorageSpace, getUnassigned, setStorageSpace(articleId, storageSpaceId | null)`
-   **`StorageSpaceRepository`** — `getAll, getById, getByQrCode, create, update, delete` — `delete` must set `storageSpaceId = null` on all articles referencing it (orphan, never cascade-delete articles).
-   **`OutfitRepository`** — `getAll, getById, create, update, delete, addArticle, removeArticle`
-   **`TagRepository`** — `getAll, getByCategory, create`
-   **`WearLogRepository`** — `logArticleWorn(articleId), logOutfitWorn(outfitId)` — the latter must also write/increment a log entry for every article in that outfit (cascade), per the PRD's wear-tracking decision.
-   **`SettingsRepository`** — `get, update`

### `src/repositories/mock/fixtures/`

Hand-authored sample data covering realistic edge cases: at least one unassigned (orphaned) article, one storage space with a `subLocation` and one without, an outfit using all layer types, and articles across several of the 11 controlled colors. This is what powers UI-only development — keep it varied enough to expose layout issues early.

### `src/providers/RepositoryProvider.tsx`

Reads `process.env.EXPO_PUBLIC_DATA_SOURCE`. If `"mock"`, provides the `Mock*Repository` set; otherwise (`"local"` or unset) provides the `Local*Repository` set. Exposes a `useRepositories()` hook that ViewModels call to get the active set. Fail loudly (throw) if a ViewModel is used outside this provider.

### `src/viewmodels/`

Each hook returns a plain object of `{ data, loading, error, ...handlers }` — no JSX, no styling concerns. Example: `useClosetHome` returns `{ articles, filters, setFilter, searchQuery, setSearchQuery }` and internally calls `ArticleRepository.getAll()` plus client-side filtering.

### `src/components/`

Props in, JSX out — no repository or ViewModel imports here, ever. If a component needs data, it receives it from the screen that composes it.

### `app/`

Each screen file composes its ViewModel + components; screens themselves should stay thin — mostly layout and wiring, with logic living in the ViewModel.

## 6. Data Model Constraints (do not deviate without updating the PRD)

-   **Color** is a controlled enum of exactly 11 values: `red, orange, yellow, green, blue, indigo, violet, pink, white, brown, black`. Never store freeform color text.
-   **Storage nesting** is one level: a `StorageSpace` has a `name` plus an optional freeform `subLocation` string. Do not build a parent/child or tree relationship for v1.
-   **Deleting a storage space** orphans its articles (`storageSpaceId → null`); it never deletes articles and never blocks the deletion. The Closet Browser must surface unassigned articles somewhere reachable.
-   **Wear History** defaults to **off**. The toggle lives in `UserSettings`; when off, wear-tracking UI (badges, "mark as worn" buttons) must not render, even though the underlying tables always exist.
-   **Marking an outfit as worn** must cascade: create/update a `WearLog` for the outfit and for every article within it, in one operation.
-   **Occasion/theme tags** are a single shared `Tag` taxonomy used by both the Closet Browser's filters and the Outfit Builder's occasion selection — do not create two separate tag systems.

## 7. Visual Direction

Theme tokens in `src/theme/` should implement a "garment spec sheet" aesthetic: warm ivory surfaces, graphite ink text, one confident accent color for primary actions, and restrained use of dashed lines/corner notches as a structural motif (echoing tailoring/pattern marks). See `docs/My_Closet_Wireframes.html` for the reference implementation and exact palette. Prioritize clarity and one-handed usability over ornamentation.

## 8. Build Order

Follow this sequence; each milestone should be functionally complete (including its ViewModels wired to the mock repositories at minimum) before starting the next:

1. **Article Storage** (manual entry) + **Closet Browser**
2. **Storage Locator** (QR generation, scanning, assignment, orphan handling)
3. **Outfit Builder**
4. **Wear History** (opt-in toggle + cascade logging)
5. _(v2, not in this repo's initial scope)_ AI-assisted background removal + auto-tagging, on-device first
6. _(v2+)_ Storage "folder" view, AI-assisted outfit suggestions
7. _(v3)_ Accounts + cloud sync, multi-device, opt-in Online AI Mode

## 9. Non-Goals for This Build

Do not implement, scaffold, or add dependencies for any of the following unless explicitly instructed — they are deferred by design:

-   Any backend, cloud database, or API server
-   Any authentication or account system
-   AI background removal or auto-tagging (manual fields only for now)
-   AI-assisted outfit suggestions
-   Multi-device sync
-   Nested/hierarchical storage spaces beyond one level

## 10. Conventions

-   TypeScript strict mode; no `any` without a comment explaining why.
-   One component/hook per file; file name matches the exported symbol.
-   ViewModels are the only place that call repositories. Components are the only place that render JSX. Don't blur this line.
-   Repositories are the only place that import from `src/lib/watermelon/`. Never let a WatermelonDB `Model` instance leak into a ViewModel, component, or screen — always map to the plain `src/models/` type first.
-   Every new entity or field must be reflected in `docs/my-closet-er-diagram.mermaid` **and** `src/lib/watermelon/schema.ts` in the same change.
