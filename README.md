# Daniel Cruz: Portfolio

Vite + React 19, plain CSS, and Three.js (loaded lazily for the hero scene only).

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run lint      # oxlint over src/
```

## Where things live

| Path | What it is |
| --- | --- |
| `src/data/content.js` | **All your content**: profile, skills, experience, projects, education, form endpoint |
| `src/components/` | One file per section, plus `ui.jsx` (reveal, split text, magnetic, progress bar) |
| `src/scene/heroSceneCore.js` | The Three.js hero scene (dynamic-imported, ~190 kB gz, only when WebGL is usable) |
| `src/hooks/` | Shared scroll bus (one scroll listener for every scroll-linked effect), media queries, in-view, magnetic |
| `src/styles/base.css` | Design tokens, typography, buttons, navbar |
| `src/styles/sections.css` | Every section's layout and motion |
| `src/assets/projects/web/` | Optimised WebP screenshots (+ `-thumb` versions). The original PNG/JPGs are untouched beside them |

## Editing content

- **Add / change a project:** edit `PROJECTS` in `content.js`. Put the screenshot in `src/assets/projects/web/` as `name.webp` and `name-thumb.webp` and reference `"name"` in `images`. `cover` is the index of the screenshot shown first.
- **Hero deck:** `HERO_ORDER` lists project ids, front to back.
- **Project links:** projects have no links today, so none are rendered. Add a `link` field and a button in `Work.jsx` when you have real URLs.
- **Colours and type:** tokens at the top of `base.css`.

## Fallbacks

The hero falls back to a CSS-3D version of the same composition when WebGL is unavailable, the device reports low CPU/memory or data-saver, WebGL context is lost, or the visitor prefers reduced motion (which also removes the pinned scroll story and depth effects).
