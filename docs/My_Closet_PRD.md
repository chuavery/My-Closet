# My Closet — Product Requirements Document

*v0.1 — Draft · Prepared for internal review · design & engineering scoping*

## 1. Overview & Vision

My Closet is a mobile application that turns a user's physical wardrobe into a searchable, organized virtual closet. It solves three connected problems: knowing what you own, knowing where it physically is, and putting pieces together into outfits you'll actually wear.

The product is built around a simple loop: catalog an item once (photo + details), tag it so it's easy to find, and pair it with a physical storage location so "digital search" always resolves to a real-world action — pulling the right item out of the right bin, drawer, or shelf.

### 1.1 Goals for v1

- Let a user build a complete digital inventory of their wardrobe with minimal manual data entry.
- Make physical storage lookup fast and reliable via QR codes, so cataloging pays off immediately.
- Provide a browsing/filtering experience that feels like a personal shopping app, not a spreadsheet.
- Let users assemble and save outfits, and optionally track how often they're worn.

### 1.2 Non-Goals for v1

- Automated background removal and AI auto-tagging (color/type) — planned, but v1 ships with manual entry to validate the core loop first.
- AI-assisted outfit recommendations based on weather/occasion — v2+.
- Social features (sharing closets, following other users).
- Marketplace / resale integration.

## 2. Personas

### The Maximalist Organizer

Owns 150+ articles of clothing across multiple storage locations (main closet, a dresser, a seasonal bin in another room). Struggles to remember what she owns and where it is. Primary value: search + physical location lookup.

### The Outfit Planner

Owns a moderate wardrobe but repeatedly wears the same 20% of it because he can't visualize combinations quickly. Primary value: the Outfit Builder and occasion tagging, so "what do I wear to this thing" has a fast answer.

---

## 3. Scope: v1 vs. Future

| Feature | v1 (Manual / Core) | Future (AI-Assisted / Expanded) |
|---|---|---|
| Article Storage | Manual entry (name, brand, fabric, fit, size, type); user-taken photo, uncropped | AI background removal + auto color/type tagging |
| Article Organizer 1 (Location) | QR generation per storage space; scan-to-view contents; manual space assignment | Nested/hierarchical storage spaces; bulk re-assignment |
| Article Organizer 2 (Browse) | Scrollable grid; filter by color, fabric, type, theme | "Folder" view grouped by storage space |
| Outfit Builder | Manual layering; name + occasion tags; storage lookup per article | AI-assisted suggestions using weather + occasion + wardrobe data |
| Wear History | Optional toggle; manual "mark as worn"; cascades outfit → articles | Laundry-rotation nudges; cost-per-wear; underused-item insights |

## 4. Feature Specifications

### 4.1 Article Storage

The entry point for all inventory: users photograph a piece of clothing or an accessory and log it into their digital closet.

**User flow**

- User taps "Add Article" and takes or uploads a photo.
- (v2) App auto-crops and removes the background, then suggests color and article type.
- User optionally fills in: name, brand, fabric type, fit, size, and article type (required).
- User optionally assigns the article to a storage space (see 4.2).
- Article is saved and appears immediately in the closet grid (4.3).

**Fields**

| Field | Required? | Notes |
|---|---|---|
| Photo | Yes | Source image; processed image stored separately once background removal ships |
| Article type | Yes | Enum: shirt, jacket, dress, pants, shoes, accessory, etc. Drives filtering & outfit layering |
| Name | No | Freeform, user-friendly label |
| Brand | No | Freeform text |
| Fabric type | No | Freeform or select-from-list |
| Fit | No | e.g. slim, relaxed, oversized |
| Size | No | Freeform to support varied sizing systems |
| Color | No | Controlled list of 11 values: red, orange, yellow, green, blue, indigo, violet, pink, white, brown, black. v2 auto-tagging will map its output to one of these same values via defined hex ranges |

Design note: every AI-populated field should carry a "source" flag (manual vs. ai_suggested) even in v1's schema, so v2's auto-tagging can slot in without a data migration, and so field-level accuracy can be measured once it ships.

### 4.2 Article Organizer 1 — Physical Location (QR)

Bridges the digital catalog to the physical closet. Every storage space (a shelf, drawer, bin, rack) gets a generated QR code; articles are linked to a storage space.

**User flow**

- User creates a "Storage Space" (e.g., "Bedroom Closet — Top Shelf") and the app generates a QR code for it.
- User prints or otherwise affixes the QR code to that physical location.
- When logging or editing an article, the user assigns it to a storage space.
- Scanning a space's QR code opens a view of everything assigned to it.
- Tapping an article anywhere in the app (closet grid, outfit builder) surfaces "where is this stored," including its QR code.

**v1 scope**

- One-level storage spaces: a space has a name (e.g. "Bedroom Closet") plus an optional freeform sub-location field for shelf/cabinet/drawer (e.g. "Top Shelf").
- Standard device-camera QR scanning; no custom hardware.
- If a storage space is deleted, its articles are automatically orphaned (unassigned) rather than deleted or blocking the deletion; the closet view surfaces unassigned articles so the user can reassign them.

**Future**

- A dedicated "folders" view of storage spaces (tap a space, see its contents).
- A structured shelf → bin hierarchy in place of today's single freeform sub-location field, once the one-level version is validated with real usage.

### 4.3 Article Organizer 2 — Browse & Filter

The default home view: a scrollable, shopping-app-style grid of every article the user owns.

**Filters (v1)**

- Color
- Fabric type
- Article type (shirt, dress, etc.)
- Theme / occasion (casual, formal, smart casual, etc.) — shares a tag taxonomy with Outfit occasion tags (4.4)

**Future**

- "Folder" view: browse by storage space instead of a flat grid.
- Additional facets as the data model grows: season, last-worn, brand.

### 4.4 Outfit Builder

Lets users layer articles and accessories into a saved outfit, tag it for when they'd wear it, and jump straight to physical location for any piece.

**User flow**

- User selects articles from their closet and arranges them into layers (base, mid, outer, bottom, footwear, accessory).
- User names the outfit and applies one or more "occasion" tags (casual, formal, smart casual, weather-linked tags, etc.).
- User can tap any article in the outfit to jump to its storage location (reuses 4.2).
- Outfit is saved and browsable alongside the closet.

**v1 scope**

- Fully manual construction — no automated suggestions.

**Future**

- AI-assisted outfit suggestions that factor in current/forecast weather, selected occasion, and wardrobe gaps or underused items.

### 4.5 Wear History (optional)

An opt-in feature (default off) that tracks how often articles and outfits are worn.

**Behavior**

- Toggle lives in user settings; underlying schema always exists so toggling on/off never requires a migration.
- "Mark as worn today" is available on both article and outfit detail views.
- Logging a worn outfit cascades: it creates a log entry for the outfit and for every article within it, so wear counts stay consistent at both levels.
- Turning the setting off hides historical data rather than deleting it, in case the user re-enables it later.

**Future, once enabled by usage data**

- Laundry-rotation nudges ("worn 3x since last cleaned").
- Underused-item surfacing ("haven't worn this in 6 months").
- Cost-per-wear, if purchase price is ever captured.

## 5. Data Model

The full entity-relationship diagram is delivered as a companion file (`my-closet-er-diagram.mermaid`). Summary of core entities:

| Entity | Purpose |
|---|---|
| User / UserSettings | Account record; UserSettings holds the wear_history_enabled toggle |
| StorageSpace | A physical location; has a name, an optional freeform sub_location (shelf/cabinet), and a QR code. One level in v1 by design decision |
| Article | A clothing/accessory item; core catalog fields plus a nullable storage_space_id, automatically set to null (orphaned) if its space is deleted; color is a controlled 11-value list rather than freeform text |
| Tag | Shared taxonomy for occasion/theme tags, reused by both Article filters and Outfit occasions |
| Outfit / OutfitArticle | A saved outfit and its join to component articles, including layer position for the builder UI |
| WearLog | One row per "worn" event; nullable outfit_id distinguishes standalone article wears from outfit-cascaded wears |

Two deliberate design decisions worth flagging for engineering:

- Occasion/theme tags are a single shared taxonomy (the Tag entity) used by both Articles (as filters) and Outfits (as occasions), rather than two parallel tag systems that could drift apart.
- Wear-tracking tables exist unconditionally in the schema; the settings toggle only controls whether the app writes to and surfaces them, so there's no future migration to add the feature.

## 6. Offline-First Architecture

v1 is a purely offline application: no account creation, no server round-trips, and no dependency on network connectivity for any core feature (Article Storage, both Organizers, Outfit Builder, Wear History). Everything lives in an on-device database. This is a foundational constraint that shapes the tech stack in Section 7, not an implementation detail — it removes an entire backend/auth layer from v1 scope.

**What this means in practice**

- No login or account system in v1 — "user_id" in the data model is a local profile identifier, not an authenticated account.
- All images (original and, later, background-removed) are stored in the app's local sandboxed file storage, not a cloud bucket.
- QR generation and scanning already had no backend dependency, so this is unaffected — codes simply encode a local storage-space id.
- No sync between devices in v1. Accepted limitation for the initial release — see Decisions Log for the future account-based sync plan.

**Implications for the AI-assisted future features**

The request to keep future AI-assisted features offline where possible changes the v2 recommendation from Section 7 of the previous draft. Cloud vision APIs (remove.bg, GPT-4V-style tagging) are the fastest path to good accuracy but require a network call, which breaks the offline-first principle. The revised approach:

- Background removal: prioritize an on-device segmentation model (Apple's Vision framework on iOS, ML Kit's Subject/Selfie Segmentation on Android, or a bundled lightweight model such as a MobileNet-based U2-Net variant via Core ML / TensorFlow Lite) so cropping works with no connectivity.
- Auto color/type tagging: a small on-device classifier (TensorFlow Lite / Core ML, bundled with the app or downloaded once and cached) trained or fine-tuned on clothing images, mapped to the same controlled color list and article-type enum used in v1's manual fields.
- On-device model quality will likely lag a large cloud model, especially early on. An optional "Online AI Mode" toggle — which requires a signed-in account — can let users who don't mind connectivity and authentication opt into cloud-based processing for higher accuracy, while the offline path remains the default and the fully-functional fallback.
- Both paths should write to the same fields with the same source flag (manual / ai_on_device / ai_online) established in Section 5, so accuracy can be compared and the on-device model improved over time.

**Path to accounts and cloud sync**

v1 intentionally ships without any account system. When multi-device support is prioritized, the plan is to introduce user accounts via email, Google, or Apple sign-in, with the local database syncing to a cloud-hosted copy tied to that account. This single change resolves both the backup/device-transfer gap and multi-device access at once, and is the natural point at which the "future cloud backend" row in Section 7's tech stack gets activated.

## 7. Recommended Tech Stack

Revised for the offline-first constraint: v1 has no backend at all. The stack below optimizes for a fully local, cross-platform app with a clean path to bolt on optional cloud sync and "Online AI Mode" later, without needing to re-architect the local data layer.

| Layer | Recommendation | Why |
|---|---|---|
| Mobile app | React Native + Expo | Single codebase for iOS/Android; mature camera, image-picker, and QR libraries; fast iteration for a small team |
| Local database | WatermelonDB or Expo SQLite (with Drizzle ORM) running on-device | Relational shape (articles ↔ storage ↔ outfits ↔ tags) fits SQL well; WatermelonDB in particular is built offline-first with an optional future sync engine, which matches this app's roadmap directly |
| Image storage | App's local sandboxed file storage (device disk), referenced by local file path instead of a URL | No cloud bucket needed while v1 has no backend; original and (later) background-removed images both stored on-device |
| Auth / accounts | None in v1 — a single local profile per install | No login flow needed until an optional cloud-sync tier is introduced |
| Background removal (future, offline) | On-device segmentation: Apple Vision framework (iOS) / ML Kit Subject Segmentation (Android), or a bundled lightweight model (e.g. U2-Net variant) via Core ML / TensorFlow Lite, fetched once on first use rather than shipped in the app binary | Keeps install size small while still working fully offline after the one-time download |
| Auto-tagging (future, offline) | Small on-device classifier (TensorFlow Lite / Core ML), also fetched once on first use, mapped to the fixed color list and article-type enum | Same fetch-once approach; avoids a network dependency after initial setup |
| Online AI Mode (future, opt-in, requires account) | Managed cloud APIs (e.g. remove.bg / Clipdrop, a vision-language model) called only when a signed-in user explicitly enables this mode | Gives higher accuracy for users who accept a network dependency; tying it to the account system (rather than a stateless call) keeps auth to one system and leaves room for future rate-limiting or cost management |
| QR generate/scan | Client-side libraries (e.g. react-native-qrcode-svg for generation, a vision-camera-based scanner for reading) | Already had no backend dependency; unaffected by the offline-first decision |
| Future cloud sync / backup | Optional managed backend (Supabase or Firebase), introduced alongside account creation (email, Google, or Apple sign-in) for multi-device access and backup | Deferred rather than removed — the local data model's UUID-based ids and clean entity boundaries make bolting this on later straightforward |

This defers, rather than discards, the earlier cloud-backend recommendation: Supabase or Firebase remain the right choice if/when the roadmap adds multi-device sync, account-based backup, or a server-hosted "Online AI Mode." Designing local ids as UUIDs now (rather than auto-incrementing integers) keeps that door open without extra work later.

> **Repo note:** WatermelonDB has since been chosen definitively as the local database (see `AGENTS.md`), specifically for its built-in offline-first sync engine.

## 8. Roadmap

| Phase | Scope |
|---|---|
| Milestone 1 | Article Storage (manual), Article Organizer 2 (browse/filter, no folder view) |
| Milestone 2 | Article Organizer 1 (QR generation + scanning + storage assignment) |
| Milestone 3 | Outfit Builder (manual layering, occasion tags, storage lookup) |
| Milestone 4 | Wear History (optional toggle, manual logging, outfit→article cascade) |
| Milestone 5 (v2) | AI background removal + auto color/type tagging on Article Storage, on-device first |
| Milestone 6 (v2+) | Storage "folder" view; AI-assisted outfit suggestions using weather + occasion |
| Milestone 7 (v3) | Accounts (email, Google, Apple sign-in) + cloud sync, enabling multi-device access, backup, and an opt-in "Online AI Mode" |

## 9. Decisions Log

Resolved during v1 scoping review:

**Wear History default** — Off by default. Lives as a toggle in Settings; the user opts in explicitly.

**Storage space nesting** — v1 is one level: a StorageSpace has a name (e.g. "Bedroom Closet") plus an optional freeform sub-location field for shelf/cabinet/drawer (e.g. "Top Shelf"). This is not a structured hierarchy yet — just a second descriptive field. Future iterations can move to a structured shelf → bin relationship once the one-level version is validated.

**Color field** — Controlled list rather than freeform text, to keep filtering reliable: red, orange, yellow, green, blue, indigo, violet, pink, white, brown, black. When v2's AI-assisted auto-tagging ships, each of these categories will map to a defined hex range so the model's output resolves to one of the same 11 values.

**Deleting a storage space** — Articles assigned to a deleted storage space are automatically orphaned (storage_space_id set to null) rather than deleted or blocking the deletion. The closet view should surface "unassigned" articles somewhere findable so users can reassign them at their own pace.

**Backup / device transfer (v1)** — Not handled in v1 — data loss on reinstall or device change is an accepted limitation for the initial release. A cloud-backed backup path arrives with the account system described below, rather than as a standalone export/import feature beforehand.

**Multi-device support** — v1 is single-device only, with no account system. Future versions will introduce user accounts (email, Google, or Apple sign-in) with cloud sync, so the same closet is accessible across a user's devices. This also resolves the backup/device-transfer question above, since account-linked cloud sync doubles as backup.

**Online AI Mode account requirement** — Online AI Mode requires a signed-in account, using the same account system introduced for cloud sync rather than a separate stateless flow. This keeps auth to a single system and lets usage be tied to an account for any future rate-limiting or cost-management needs.

**On-device AI model distribution** — Background-removal and auto-tagging models are fetched once on first use rather than bundled in the app binary. This keeps the install size small; the trade-off is that the very first use of Article Storage's AI features requires connectivity to download the model, after which it works fully offline.

**Migrating local data to a new account** — When a user signs in for the first time, their existing single-device local data is uploaded to their new account automatically, with no separate "import" step required.
