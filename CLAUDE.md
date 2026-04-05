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

**Routing:** `App.js` → single route `/` → `Layout` (Header + Outlet + Footer) → `Home`.

**Page composition (`Home.jsx`):**
1. Hero image with intro text panel (`.uvodTxt`)
2. `<Sluzby>` – three service cards
3. `<PortfolioNew>` – project gallery grid
4. `<Kontakt>` – contact form

**Portfolio (`PortfolioNew.jsx`):** Fetches from `https://www.arapro.cz/index.php`. Each project: `{ id, name, location, actions, photos[] }`. Thumbnail = photo named `thumb.png` or `thumb.jpg`. Shows 12 projects initially; +/- button toggles all. Click opens `SlideshowLightbox` (lightbox.js-react).

**Contact form (`Kontakt.jsx`):** EmailJS, service `service_5j7p9wf`, template `template_qpoe784`. Public key from `REACT_APP_EMAILJS_PUBLIC_KEY`.

**Header (`Header.jsx`):** Sticky navbar; `isScrolled` (> 250px) adds `.scrolled` class to the Container for a glass blur background. Scroll-to-top button with typewriter animation appears after 250px scroll.

**Design tokens (CSS variables in `src/index.css`):**
- `--accent: #ffcc00` (brand yellow)
- `--dark: #1c1c1c`
- `--font-heading: 'Cormorant Garamond'` (loaded via Google Fonts in `index.html`)
- `--font-body: 'Inter'`

**Styling:** Each component has a co-located `.css` file. Bootstrap 5 + Reactstrap for layout/UI. Global section heading styles (`.heading`, `.cara`) defined in `src/pages/Layout.css`.

## Environment Variables

`.env` must contain:
```
REACT_APP_EMAILJS_PUBLIC_KEY=<key>
```
