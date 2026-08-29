# My Closet — Figma Make Generation Prompt

---

Design and generate a mobile app called **My Closet** — a virtual closet manager that helps a user catalog their clothing and accessories, track where each item is physically stored, and assemble outfits from what they own.

## Product summary

My Closet solves three connected problems: knowing what you own, knowing where it physically is, and putting pieces together into outfits you'll actually wear. v1 is a **fully offline, single-device app** with no login or account system — all data lives locally on the device.

## Core features to design

**1. Article Storage** — Users add a clothing/accessory item by taking or uploading a photo. In v1, tagging is manual: the user optionally enters a name, brand, fabric type, fit, and size, and selects a required article type (shirt, jacket, dress, pants, shoes, accessory, etc.) and a color from a fixed list: red, orange, yellow, green, blue, indigo, violet, pink, white, brown, black.

**2. Storage Locator (QR-based)** — Users create "storage spaces" (e.g., "Bedroom Closet"), each with a name and an optional sub-location field for shelf/cabinet/drawer (e.g., "Top Shelf") — one level deep in v1, not a nested hierarchy. Each storage space gets an auto-generated QR code. Scanning a space's QR code shows everything assigned to it; tapping any article anywhere in the app reveals which storage space it belongs to. If a storage space is deleted, its articles become "unassigned" (not deleted) and are surfaced somewhere the user can easily reassign them.

**3. Closet Browser** — The home view: a scrollable grid of every article the user owns, styled like a shopping app. Includes filters for color, fabric, article type, and theme/occasion (casual, formal, smart casual, etc.).

**4. Outfit Builder** — Users select articles and layer them (base, mid, outer, bottom, footwear, accessory) into a saved outfit, name it, and tag it with one or more occasions (shared tag list with the Closet Browser's theme filter). Tapping any article within an outfit jumps to its storage location.

**5. Wear History (optional, off by default)** — A settings toggle lets users opt into tracking. When on, both articles and outfits show a "mark as worn today" action; logging a worn outfit also logs each article within it.

## Screens to generate

1. **Closet Home** — grid/browse view with search and filter chips (color, fabric, type, theme)
2. **Add/Edit Article** — photo capture area, manual fields (name, brand, type, color, fabric, fit, size), storage space assignment
3. **Storage Spaces** — list of storage spaces with their QR codes and item counts, a "scan QR" action, and an "unassigned items" entry point
4. **Storage Space Detail** — contents of a single scanned/selected space
5. **Outfit Builder** — layering canvas with slots by layer type, an article picker tray, outfit naming, and occasion tag selection
6. **Outfit Detail** — saved outfit view with per-article "locate" links
7. **Settings** — Wear History toggle (default off), and other app preferences

## Visual direction

A clean, functional aesthetic that reads as a "garment spec sheet" rather than a generic template — think dressmaker's pattern-drafting paper: warm ivory surfaces, graphite ink text, a single confident accent color for primary actions, and light use of dashed lines or corner notches as a structural motif (echoing tailoring/pattern marks) rather than decorative clutter. Prioritize clarity and scanability over ornamentation — this is a utility app used quickly, often one-handed, while getting dressed.

## Recommended architecture for compartmentalization

Structure the generated code around **MVVM (Model–View–ViewModel)** with a repository layer for data access, rather than traditional MVC. This fits better than MVC because the UI is built from declarative, reactive components (React) rather than an imperative controller-driven flow — MVVM's binding model maps naturally onto React state/hooks, and it cleanly separates concerns for an app with several distinct data entities (articles, storage spaces, outfits, tags, wear logs) and screens that each combine multiple entities:

- **Model** — plain data types matching the app's core entities: `Article`, `StorageSpace`, `Outfit`, `OutfitArticle`, `Tag`, `WearLog`, plus the `UserSettings` object holding the wear-history toggle.
- **ViewModel** — one hook (or hook-based controller) per screen (e.g. `useClosetHome`, `useArticleForm`, `useOutfitBuilder`) that owns screen state, derives filtered/sorted data, and calls into the repository layer. Keeps Views free of business logic.
- **View** — presentational components per screen/section (grid cards, filter chips, layer slots, QR tiles) that receive data and callbacks as props only.
- **Repository/Data layer** — a thin data-access layer per entity (e.g. `ArticleRepository`, `StorageSpaceRepository`) that abstracts local persistence, so the on-device database implementation can change without touching ViewModels, and so a future cloud-sync layer can be introduced behind the same interface.

Suggested folder grouping: `/models`, `/viewmodels` (or `/hooks`), `/views` (or `/screens` + `/components`), `/repositories`, `/navigation`.

## Key constraints to respect

- No login/account screens in v1 — the app opens directly to Closet Home.
- Color is always a single-select from the fixed 11-value list, never freeform text.
- Storage nesting is exactly one level (space name + optional sub-location text), not a tree.
- Wear History UI (badges, "mark as worn" buttons) should only appear when the Settings toggle is on.
