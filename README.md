# Since

A private, single-screen date PWA. A 6-digit `DDMMYY` code unlocks that day and shows how much time has passed since, counted in local calendar days.

## Run

```sh
pnpm install
pnpm dev
```

Open the URL Vite prints.

## Test

```sh
pnpm test
```

## Production build

```sh
pnpm build
pnpm preview
```

The build emits a service worker and a web manifest. After the first load the app works offline.

## Deploy on Railway

The repo includes a multi-stage `Dockerfile` (Node build, then Caddy serving `dist`). Railway detects it automatically.

1. Create a Railway service from this repository.
2. Leave environment variables empty. Railway injects `PORT`; Caddy listens on it.
3. Generate a domain in the service settings. HTTPS is required for the service worker to install.
4. Deploy. No start command override is needed.

Static assets under `/assets/` are cached immutably. `index.html`, the manifest, and the service worker are served with `Cache-Control: no-cache` so updates can roll out.
