# syntax=docker/dockerfile:1.7

# ─── Build ────────────────────────────────────────────────────────────────────
# Pinned to the same version as .nvmrc and package.json's `engines`. Those three
# disagreeing is how a build starts behaving differently from a developer's
# machine.
FROM node:24.21.0-alpine AS build

# `VITE_*` values are inlined into the bundle at build time — they are public,
# and changing one after the build has no effect. A secret must never be passed
# here; see SECURITY.md.
ARG VITE_API_URL=/api
ARG VITE_ENABLE_MOCKS=true
ENV VITE_API_URL=$VITE_API_URL \
    VITE_ENABLE_MOCKS=$VITE_ENABLE_MOCKS

RUN corepack enable

WORKDIR /app

# Dependencies first, so a source-only change does not reinstall them.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# `engine-strict` in .npmrc checks the Node version; the base image satisfies it.
# The full dependency set is installed, not just production: vite, biome and
# oxlint are all build-time tools.
#
# `--ignore-scripts` because the root `prepare` runs `lefthook install`, which
# needs a git repository the build context deliberately leaves out. No
# dependency's own script is needed either: the bundler binaries arrive as
# platform packages, and MSW's worker is already committed under `public/`.
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm build

# ─── Serve ────────────────────────────────────────────────────────────────────
# The unprivileged variant runs as uid 101 on port 8080 out of the box, rather
# than a root master process dropping privileges for its workers.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

LABEL org.opencontainers.image.title="Supply Chain admin panel" \
      org.opencontainers.image.description="Static SPA; the API is mocked in the browser." \
      org.opencontainers.image.licenses="LicenseRef-Proprietary"

COPY --link docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --link docker/security-headers.conf /etc/nginx/snippets/security-headers.conf

# Only the client bundle ships. `dist/server` exists because SPA mode prerenders
# the shell through a server pass — it is a build artefact, not a runtime one,
# and there is no Node process in this image to run it.
COPY --link --from=build /app/dist/client /usr/share/nginx/html

EXPOSE 8080

# No backend to wait on: the mock API is inside the bundle, so a served shell
# means a working panel.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --spider http://127.0.0.1:8080/healthz || exit 1
