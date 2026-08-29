# My Closet

A mobile app that turns your physical wardrobe into a searchable, organized virtual closet — catalog what you own, track where it's physically stored, and build outfits from your own pieces.

My Closet solves three connected problems: knowing what you own, knowing where it physically is, and putting pieces together into outfits you'll actually wear.

## Status

🚧 Pre-development — actively being scoped. See [Roadmap](#roadmap) below.

## Features

-   **Article Storage** — Catalog clothing/accessories by photo, with manual fields for name, brand, fabric, fit, size, article type, and color (v1); AI-assisted background removal and auto-tagging planned for v2.
-   **Storage Locator (QR-based)** — Assign items to physical storage spaces (e.g. "Bedroom Closet — Top Shelf") and generate a scannable QR code per space to find anything instantly.
-   **Closet Browser** — A shopping-app-style scrollable grid of your full closet, filterable by color, fabric, type, and theme/occasion.
-   **Outfit Builder** — Layer articles into saved outfits, tag them by occasion, and jump straight to an item's storage location from within an outfit.
-   **Wear History** _(optional, off by default)_ — Opt-in tracking of how often articles and outfits are worn, cascading from outfit-level logs down to each article.

## Tech Stack

| Layer                 | Choice                                                     |
| --------------------- | ---------------------------------------------------------- |
| Mobile app            | React Native + Expo                                        |
| Local database        | WatermelonDB or Expo SQLite (Drizzle ORM)                  |
| Image storage         | On-device sandboxed file storage                           |
| Auth                  | None in v1 — accounts arrive with cloud sync (see Roadmap) |
| On-device AI (future) | Core ML / TensorFlow Lite, fetched on first use            |

v1 is **fully offline** by design — no account, no server, no network dependency for any core feature. See the project PRD for the full rationale and the planned path to accounts + cloud sync.

## Architecture

The codebase follows **MVVM (Model–View–ViewModel)** with a repository layer for data access, rather than MVC — this fits React's declarative, hook-based component model more naturally than a controller-driven pattern.

```
/models          # Article, StorageSpace, Outfit, OutfitArticle, Tag, WearLog, UserSettings
/viewmodels       # Screen-level hooks (useClosetHome, useArticleForm, useOutfitBuilder, ...)
/views            # Presentational screens & components, props-driven only
/repositories     # Data-access layer per entity, abstracts local persistence
/navigation       # App navigation/routing
```

-   **Model** — plain data types matching the core entities.
-   **ViewModel** — one hook per screen; owns state, derives filtered/sorted data, calls repositories. Keeps Views free of business logic.
-   **View** — presentational components; receive data and callbacks as props only.
-   **Repository** — abstracts local persistence so the on-device DB can change, or a future cloud-sync layer can be introduced, without touching ViewModels.

## Getting Started

```bash
# clone the repo
git clone <repo-url>
cd my-closet

# install dependencies
npm install

# start the Expo dev server
npx expo start
```

Requires [Node.js](https://nodejs.org/) and the [Expo Go](https://expo.dev/client) app (or a simulator) for local development.

## Roadmap

| Milestone | Scope                                                                                   |
| --------- | --------------------------------------------------------------------------------------- |
| 1         | Article Storage (manual) + Closet Browser                                               |
| 2         | Storage Locator (QR generation, scanning, assignment)                                   |
| 3         | Outfit Builder                                                                          |
| 4         | Wear History (opt-in toggle)                                                            |
| 5 (v2)    | AI background removal + auto color/type tagging, on-device first                        |
| 6 (v2+)   | Storage "folder" view; AI-assisted outfit suggestions (weather + occasion)              |
| 7 (v3)    | Accounts (email/Google/Apple) + cloud sync, multi-device support, opt-in Online AI Mode |

## Documentation

-   `docs/My_Closet_PRD.docx` — full product requirements document
-   `docs/my-closet-er-diagram.mermaid` — entity-relationship diagram
-   `docs/My_Closet_Wireframes.html` — core screen wireframes
