# DEPLOYMENT.md

How to run this panel — on a laptop, in a container, and behind a real API.

There is no backend to deploy. The whole application is a static bundle; its API
is Mock Service Worker running in the browser. That makes deployment unusually
simple and puts all the interesting constraints in one place: **every
configuration value is baked in at build time**.

---

## Prerequisites

| Tool | Version | Why exactly this |
|---|---|---|
| Node.js | **24.21.0** | Pinned in `.nvmrc`, `engines.node` and `packageManager`. `.npmrc` sets `engine-strict=true`, so a different version refuses to install rather than producing a subtly different build. |
| pnpm | ≥ 10 | Enabled through corepack; the lockfile is pnpm's. |
| Docker | any recent | Only for the container path. |

```bash
nvm install    # reads .nvmrc
nvm use
corepack enable
```

> **If `pnpm i` fails with `ERR_PNPM_UNSUPPORTED_ENGINE`**, your shell is on
> another Node version. Run `nvm use` in the project directory — that is the
> pin doing its job, not a defect.

---

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Sign in with the pre-filled credentials. They are the seeded operator and are
printed on the login form itself:

| Account | Role | Sees |
|---|---|---|
| `admin@example.com` | `ADMIN` | Everything, including users, roles and the activity log |
| `lukas.weber@example.com` | `SUPPLY_ANALYST` | The map and all reference data; no access management |
| `chloe.durand@example.com` | `AUDITOR` | Everything read-only, plus the activity log |
| `piotr.nowak@example.com` | `VIEWER` | Map and reference data, read-only — **suspended**, so sign-in is refused |

Every account uses the password `supply-chain`. Switching accounts is the
quickest way to see the permission gating: the sidebar, the row actions and the
API's own refusals all follow the role.

### Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server on :3000 |
| `pnpm dev:live` | Same, with `VITE_ENABLE_MOCKS=false` — requests go to `VITE_API_URL` for real |
| `pnpm build` | Production bundle into `dist/` |
| `pnpm preview` | Serves the built bundle on :4173 |
| `pnpm verify` | oxlint → biome → tsc. All three must exit zero |
| `pnpm test` | Unit, integration, markup snapshots and browser screenshots |
| `pnpm test:unit` | Unit specs only |
| `pnpm test:int` | Integration specs only |
| `pnpm test:snapshot` | Markup snapshots only |
| `pnpm test:screenshot` | Browser screenshot comparisons only |
| `pnpm test:stories` | Renders every Storybook story as a browser test |
| `pnpm storybook` | Component workshop on :6006, with all three themes and four languages |
| `pnpm commit` | Guided Conventional Commit prompt |

---

## Environment variables

Only `VITE_`-prefixed variables reach the browser, and **Vite inlines them into
the bundle at build time**. Changing one after a build has no effect; you must
rebuild. Nothing here is a place for a secret — the bundle is public by
definition.

| Variable | Default | Meaning |
|---|---|---|
| `VITE_API_URL` | `/api` | Path or origin the panel calls. |
| `VITE_ENABLE_MOCKS` | `true` | `false` sends requests to `VITE_API_URL` for real, instead of to the in-browser mock. |
| `BASE_PATH` | `/` | Build-time only, read by `vite.config.ts`. The sub-path the bundle is served from, with both slashes (`/supply-chain-admin-panel/`). The router basepath and the MSW worker URL follow it. |

Files:

- **`.env`** — your local copy, git-ignored. Start from `.env.example`.
- **`.env.example`** — committed, placeholders only.
- **`.env.test`** — committed; used by `pnpm test`, with the service-worker
  bootstrap off because specs drive MSW through its Node server instead.

```bash
cp .env.example .env
```

---

## Docker

The image is a static bundle behind nginx. It runs standalone with no network
dependency at runtime: there is nothing for it to connect to.

```bash
docker build -t supply-chain-admin-panel .
docker run --rm -p 8080:8080 supply-chain-admin-panel
# → http://localhost:8080
```

Or with compose:

```bash
docker compose up --build
```

### What the image is

- **Multi-stage.** `node:24.21.0-alpine` builds; `nginxinc/nginx-unprivileged`
  serves. No build toolchain in the final image.
- **Non-root.** The unprivileged nginx image runs as uid 101 and listens on
  **8080** — a low port is unavailable to it, which is the point.
- **Read-only root filesystem** under compose, with `tmpfs` for the two paths
  nginx must write to.
- **Only `dist/client` ships.** `dist/server` exists because SPA mode prerenders
  the shell through a server pass; it is a build artefact, and there is no Node
  process in the image to run it.

### The one nginx detail that matters

TanStack Start's SPA mode prerenders the shell as **`_shell.html`**, not
`index.html`. The history fallback therefore reads:

```nginx
index _shell.html;
location / {
    try_files $uri $uri/ /_shell.html;
}
```

Point it at `index.html` and you get a working `/` and a 404 on every refresh of
`/countries`, `/products` and everything else.

Two caching rules are equally load-bearing:

- `/mockServiceWorker.js` is served **`no-store`**. A cached service worker keeps
  intercepting after a deploy and serves the previous build's mock API.
- `/assets/*` is `immutable` for a year, which is safe because the filenames are
  content-hashed.

And one inheritance rule that is easy to get wrong: nginx drops every
server-level `add_header` from a `location` that declares one of its own. The
security headers (`nosniff`, `X-Frame-Options`, `Referrer-Policy`) therefore
live in `docker/security-headers.conf` and are `include`d in each location that
sets a header. A new such location must include it too, or its responses go
out without them.

### Pointing the container at a real API

The values are build args, not runtime env vars:

```bash
docker build \
  --build-arg VITE_ENABLE_MOCKS=false \
  --build-arg VITE_API_URL=https://api.example.com \
  -t supply-chain-admin-panel:live .
```

A real API must serve the contract in `src/app/mocks/handlers/` — the same
paths, the same query envelope (`search`, `page`, `pageSize`, `sortBy`,
`sortDir`, plus per-resource filters), and the same status codes. In particular
the panel relies on:

- `400` carrying `{ message, fields }` for per-field validation;
- `401` to mean "not signed in" rather than an error;
- `409` with a human-readable `message` for a refused delete.

---

## Deploying the static bundle anywhere else

`dist/client` is a plain static directory. Any host works, provided it does the
two things above: **history fallback to `_shell.html`**, and **no caching for
`mockServiceWorker.js`**.

<details>
<summary>GitHub Pages (<code>.github/workflows/pages.yml</code>)</summary>

Every push to `main` builds with `BASE_PATH=/<repo>/` and publishes
`dist/client`. Pages has no rewrites, so the workflow copies `_shell.html` to
both `index.html` and `404.html`: the root gets the shell directly, and any deep
link lands on the 404 page — which is the same shell — and the router renders
the right route. Enable it once under **Settings → Pages → Source: GitHub
Actions**.

Pages sets its own short cache on every file, including `mockServiceWorker.js`;
that cannot be changed there, and is short enough not to matter for a demo.
</details>

<details>
<summary>Netlify <code>_redirects</code></summary>

```
/mockServiceWorker.js  /mockServiceWorker.js  200!  Cache-Control=no-store
/*                     /_shell.html           200
```
</details>

<details>
<summary>Vercel <code>vercel.json</code></summary>

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/_shell.html" }],
  "headers": [
    {
      "source": "/mockServiceWorker.js",
      "headers": [{ "key": "Cache-Control", "value": "no-store" }]
    }
  ]
}
```
</details>

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| `ERR_PNPM_UNSUPPORTED_ENGINE` | Shell is on another Node. `nvm use`. |
| Refresh on `/countries` gives 404 | History fallback missing, or pointed at `index.html` instead of `_shell.html`. |
| Every request 404s in the browser | The service worker did not register. Check `/mockServiceWorker.js` returns 200 and re-run `npx msw init public/` if it is missing. |
| A stale mock API after deploying | `mockServiceWorker.js` was cached. It must be `no-store`. |
| Numbers formatted for the wrong country | Fixed, but worth knowing the shape: a browser can report `en-PL`, which is English text with Polish number formatting. The panel validates the tag against its four languages instead of trusting it. |
| Signed out on every refresh | Fixed. Was an in-memory token map that the cookie outlived. |
| `pnpm lint` prints nothing and passes | oxlint may have been killed and **still exit zero**. Re-run it alone; `--threads=4` in the script exists to prevent it. |

---

## What this is not

Stated plainly so nobody deploys it expecting otherwise:

- **No backend, no database.** All data is in memory and resets on reload.
- **Passwords are compared in plain text** in the browser. Mock only.
- **The session cookie is not `HttpOnly`** — it cannot be without a server.
  [`SECURITY.md`](SECURITY.md) explains why in full and what a real deployment
  changes.
- **Prices and FX rates are invented**, and every converted figure is labelled
  indicative in the UI.
- **No rate limiting, no CSRF token.** Neither has anything to act on here.

---

## Bundle size

Measured from `dist/client/_shell.html` after `pnpm build` — the entry script
plus every `modulepreload` the shell declares, gzipped:

| | gzip |
|---|---|
| JavaScript, first load | **250 kB** across 22 chunks |
| CSS | 18.55 kB |
| Mock API, fetched on boot | 167 kB — **only** when `VITE_ENABLE_MOCKS` is on |

The mock worker is behind a dynamic `import()` inside `enableMocking`, which
returns before reaching it when mocks are off. A deployment pointed at a real
API (`VITE_ENABLE_MOCKS=false`) therefore never fetches it.

### Against a 100 kB budget

**The current build does not meet a 100 kB first-load budget.** The shell's
entry script and modulepreloads total about 250 kB gzip, excluding the mock API.
Individual chunk names and sizes change when shared modules move between chunks;
a smaller entry file alone is not evidence of a smaller first load.

React DOM, TanStack Router/Start/Query, Zod, Base UI, i18next and the class-merging
libraries account for most of that code. Replacing these dependencies requires a
separate compatibility assessment rather than a chunk configuration change.

The following avoidable loading costs have been removed:

- **The devtools shipped to production.** `@tanstack/react-devtools`, the router
  panel and the query panel were imported at the top of the root route and
  rendered unconditionally. They are now behind `import.meta.env.DEV` in
  `app/devtools.tsx`, so Vite drops the branch and the packages never enter the
  bundle — verified by grepping `dist/client` for their names. Worth 29 kB.
- **All four locales were in the entry chunk.** Only English ships now; German,
  French and Polish are one dynamic import each, fetched when a reader switches.

### XLSX export loading

The XLSX writer is imported only when XLSX is selected. The production CRUD
chunk fell from **96.07 kB (29.04 kB gzip)** to **24.87 kB (9.10 kB gzip)**.
The **71.11 kB (19.88 kB gzip)** Excel/ZIP chunk is fetched on the first XLSX
export and reused thereafter. This reduces the code loaded for CRUD screens;
it does not remove the Excel feature or reduce the entry chunk.

A Chromium download check exercised CSV, XLS and XLSX, verified that CSV/XLS
did not request the XLSX module, and validated the resulting data, XML and ZIP.

### Remaining chunk audit

- **Settings:** the header keeps its trigger; the panel is dynamically imported
  on opening. Its unused static barrel export was removed so Rolldown can split
  it. The Suspense boundary encloses the dialog content, preserving initial
  focus when the panel mounts. Chromium, Firefox and WebKit production checks
  verified no panel request before opening, focus inside the dialog, Escape
  returning focus to the trigger, and reopening without another module request.
- **Map data:** a client-only Rolldown group emits the unchanged atlas as
  `world-atlas-*.js` (107.77 kB / 39.55 kB gzip). Its hash stayed identical in
  three builds with different application chunk graphs. The map route shrank
  from 196.02 kB / 70.87 kB gzip to about 88 kB / 30 kB gzip, plus that separate
  atlas. This improves cache isolation, not first-visit transfer size.
- **React vendor experiment:** rejected. It barely changed total startup gzip
  and its hash changed with the bundler runtime, so it did not establish the
  intended cache benefit. No blanket vendor or 50 kB chunk-size rule remains.
- **Class merging:** both `cn` and the custom `tailwind-merge` helper remain.
  Consolidating their engines changes conflict-resolution semantics and the
  vendored-component contract; it is not a behavior-neutral bundler setting.
- **Other dialogs:** shared Base UI code is also used by visible controls.
  Splitting small wrappers offers limited savings while adding loading and
  state-retention concerns; no blanket lazy-dialog conversion was applied.
- **Fonts/CSS:** font faces already use Unicode ranges, so listed font assets
  are not all downloaded. Removing scripts could change rendering of user
  data. The application stylesheet and font coverage remain unchanged.
- **Mocks:** remain enabled for the standalone demo. Deferring their startup
  past the first API request or disabling them would change behavior.

## Verification status

Honesty about what has actually been exercised on the machine this was built on:

| Checked | How |
|---|---|
| ✅ Gates | `pnpm verify` green; `pnpm test` green — 842 tests across `unit`, `integration`, `snapshot` and `screenshot` (392 files), including 264 browser comparisons; no React `act(...)` warnings or unhandled errors in the full Ubuntu host run |
| ✅ Integration against the mock API | The `integration` project runs MSW in Node from the same handlers the browser worker serves, signing in for anything permission-checked |
| ✅ Production build | `pnpm build` clean, shell prerendered |
| ✅ The running app | Driven in Chrome: sign-in, cookie, map with 24 country dots, CRUD tables, sort/search in the URL, the country↔product narrowing in both directions, the record pages, the export dialog, the IP permission masking, the phone layout and its filter sheet |
| ✅ Storybook build | `pnpm storybook:build` clean — 107 stories across 36 `shared/ui` entries compile and render |
| ✅ **Docker image** | `docker build` clean; the container runs healthy with compose's hardening (`--read-only`, tmpfs, `no-new-privileges`, uid 101). Probed with curl: `/healthz`, the shell, a deep link (history fallback), `mockServiceWorker.js` (no-store, `Service-Worker-Allowed: /`) and a hashed asset (immutable, gzip). The first build exposed two defects, both fixed: `pnpm install` ran the `prepare` hook (`lefthook install`) with no git in the image, and the security headers never reached a response because every `location` set its own `add_header` — they now come from `docker/security-headers.conf`, included in each. |
| ✅ **End-to-end** | `pnpm test:e2e` green — **28 specs**, covering CRUD for all six writable entities, the read-only audit trail, and sign-in/sign-out/404. It found four real defects, all since fixed: no `<h1>` on the login screen, a failed sign-in reported as an expired session, sign-out leaving the operator where they were, and a delete button offered for built-in roles the API always refuses. |
| ✅ **Screenshot baselines** | **264 real PNGs**, directly in each UI component’s `__screenshots__/` directory without nested folders: Chromium, Firefox and WebKit × desktop/mobile. `CI=true pnpm test:screenshot` passed all 264 comparisons on the Ubuntu host. Application CSS/fonts and actual viewport, scale, locale and pointer emulation are verified. After the final date-field width adjustment, all 18 date screenshots were refreshed and compared again. |
| ✅ **Storybook story tests** | `pnpm test:stories` green — 119 stories, each with the a11y addon's axe check. `@storybook/tanstack-react` 10.6 still calls router-core's old object-form `interpolatePath`; `.storybook/router-compat.ts` adapts that one call and says when to delete it. The crash had hidden 19 real axe failures, now fixed: unlabelled controls in stories, an unnamed combobox trigger, and three light-theme contrasts below 4.5:1 (`--destructive` on its tint, `--warning` as text, the error-page code). |

### Visual regression matrix

`pnpm test:screenshot:install` installs Chromium, Firefox and WebKit plus their
Linux dependencies. Then run `pnpm test:screenshot:update` to create reference
PNGs and `pnpm test:screenshot` to compare against them.

The screenshot project in `vite.config.ts` runs each engine at **1280 × 800**
(desktop) and **390 × 844** (mobile), with the application CSS and local fonts,
English locale, UTC, reduced motion and a fixed device scale. The six instances
run in sequence with one worker to bound browser memory use. Screenshot setup
restores Chromium touch emulation before each test because browser cleanup can
clear it. References live directly in `src/shared/ui/<component>/__screenshots__/`, without
nested folders. Filenames contain the assertion, engine, viewport and OS;
mobile and desktop never share a baseline.
`SCREENSHOT_BROWSERS=firefox` selects one engine; invalid names fail configuration.

WebKit covers Safari's rendering engine, not the branded Safari application.
Mobile runs are emulations, not physical device tests; Firefox uses a narrow
viewport and touch because Playwright does not support `isMobile` for Firefox.
Reference paths also include the OS, since font rasterization differs by platform.
See [Vitest screenshot configuration](https://vitest.dev/config/browser/expect).

From a Flatpak editor, run the commands on the Ubuntu host, where the installed
browser dependencies and filesystem are available:

```sh
flatpak-spawn --host sh -lc 'cd /home/lordpluha/develop/supply-chain-admin-panel && pnpm test:screenshot:update'
flatpak-spawn --host sh -lc 'cd /home/lordpluha/develop/supply-chain-admin-panel && pnpm test:screenshot'
```

The browser API binds to `127.0.0.1` and allows baseline writes. Generated failure
attachments are ignored; reference PNGs should be committed with visual changes.
