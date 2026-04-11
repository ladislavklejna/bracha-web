# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server at http://localhost:3000
npm run build    # Production build
npm test         # Run tests (interactive watch mode)
```

## Architecture

Single-page React 18 app (Create React App) for **Arapro.cz** – an architectural engineering firm. One scrollable page with smooth-scroll navigation (react-scroll) between four anchor sections: `#uvod`, `#sluzby`, `#reference`, `#kontakt`.

**Routing:** `App.js` → two route trees:
- `/` → `Layout` (Header + Outlet + Footer) → `Home`
- `/admin/login` → `AdminLogin` (standalone, no layout)
- `/admin/*` → `ProtectedRoute` → `AdminLayout` → `AdminDashboard` / `AdminProject`

**Page composition (`Home.jsx`):**
1. Hero image with intro text panel (`.uvodTxt`)
2. `<Sluzby>` – three service cards
3. `<PortfolioNew>` – project gallery grid
4. `<Kontakt>` – contact form

**Portfolio (`PortfolioNew.jsx`):**
- Fetches from `REACT_APP_PORTFOLIO_API_URL` (default `https://www.arapro.cz/index.php`)
- Photo base URL from `REACT_APP_PUBLIC_BASE` (default `https://www.arapro.cz`)
- Cache strategy: shows `localStorage` cache (`arapro_portfolio_v2`) immediately, then checks `?modified` endpoint in background; re-fetches only if the `modified` timestamp changed
- Server returns jpg/png paths; client rewrites all extensions to `.webp` on load
- Shows 12 projects initially; toggle button loads all. Click opens `SlideshowLightbox` (lightbox.js-react)
- Thumbnail = first photo whose name starts with `thumb.`

**Contact form (`Kontakt.jsx`):** EmailJS, service `service_5j7p9wf`, template `template_qpoe784`. Public key from `REACT_APP_EMAILJS_PUBLIC_KEY`.

**Header (`Header.jsx`):** Sticky navbar; `isScrolled` (> 250px) adds `.scrolled` class for glass blur background. Scroll-to-top button with typewriter animation appears after 250px scroll.

## Admin Section

Protected at `/admin/*`, guarded by `ProtectedRoute` which reads `AuthContext`.

**Auth (`src/context/AuthContext.jsx`):** Firebase Authentication (email/password). `user === undefined` means loading; `null` means unauthenticated. Exposes `login`, `logout`, `resetPassword`.

**Admin API (`src/utils/adminApi.js`):** All calls go to `REACT_APP_ADMIN_API_URL` (default `https://www.arapro.cz/server/api`) with `X-Api-Key` header (`REACT_APP_ADMIN_API_KEY`). Every mutating call (`mutate()`) clears the public portfolio localStorage cache after success.

| Function | Endpoint |
|---|---|
| `getProjects` | GET `projects.php` |
| `createProject` | POST `projects.php` |
| `updateProject` | PUT `projects.php?folder=` |
| `deleteProject` | DELETE `projects.php?folder=` |
| `uploadPhoto` | POST `upload.php` (multipart) |
| `setThumbnail` | POST `set_thumbnail.php` |
| `deletePhoto` | DELETE `delete_photo.php` |
| `reorderPhotos` | POST `reorder.php` `{type:"photos"}` |
| `reorderProjects` | POST `reorder.php` `{type:"projects"}` |

**AdminDashboard:** Drag-and-drop project reordering via `@dnd-kit/core` + `@dnd-kit/sortable`. New project modal → on create, navigates directly to `AdminProject`.

**AdminProject:** Photo management for a single project (upload, delete, drag-to-reorder). Uploads are converted to WebP client-side via `src/utils/imageUtils.js` (`convertToWebP`) before sending.

## Design tokens (CSS variables in `src/index.css`)

- `--accent: #ffcc00` (brand yellow)
- `--dark: #1c1c1c`
- `--font-heading: 'Cormorant Garamond'` (Google Fonts in `index.html`)
- `--font-body: 'Inter'`

**Styling:** Each component has a co-located `.css` file. Bootstrap 5 + Reactstrap for layout/UI. Global section heading styles (`.heading`, `.cara`) defined in `src/pages/Layout.css`.

## Environment Variables

`.env` must contain:

```
REACT_APP_EMAILJS_PUBLIC_KEY=<key>

# Firebase (admin auth)
REACT_APP_FIREBASE_API_KEY=<key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<domain>
REACT_APP_FIREBASE_PROJECT_ID=<id>
REACT_APP_FIREBASE_STORAGE_BUCKET=<bucket>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<id>
REACT_APP_FIREBASE_APP_ID=<id>

# Admin API (optional – defaults to production)
REACT_APP_ADMIN_API_URL=https://www.arapro.cz/server/api
REACT_APP_ADMIN_API_KEY=<key>
REACT_APP_PUBLIC_BASE=https://www.arapro.cz
REACT_APP_PORTFOLIO_API_URL=https://www.arapro.cz/index.php
```
