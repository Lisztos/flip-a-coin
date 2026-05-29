# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**coinflip** — photorealistic 3D coin flip in the browser. Three.js r128 (CDN global) + Express static server + Docker.

## Commands

```bash
npm install          # install dependencies
npm start            # production server on :3000
npm run dev          # dev server with --watch
```

```bash
docker compose up --build    # build and run container
```

Health check: `GET /health` → `{ status: "ok" }`

## Architecture

The frontend is pure ES modules loaded from `public/`. Three.js is loaded from CDN as a global (`THREE`) before the modules execute — do not import it.

| File | Responsibility |
|------|---------------|
| `scene.js` | WebGLRenderer, camera, three PointLights, resize handler. Exports `{ scene, camera, renderer, keyLight }`. |
| `coin.js` | Builds `THREE.Mesh` from `CylinderGeometry(1,1,0.08,128)`. Material array: `[0]=edge, [1]=heads(top), [2]=tails(bottom)`. Generates procedural `CanvasTexture` for all faces immediately; upgrades to real JPGs from `/textures/{coin}-{side}.jpg` asynchronously if available. `disposeCoin` cleans up geometry, materials, and textures. |
| `animation.js` | State machine: `idle → flipping → settling → idle`. `tick(coin, keyLight, dt)` drives all motion. `startFlip` picks result at call time. `setOnComplete(fn)` registers the landing callback. Module-level `faceBase` (0 or π) preserves which face is up across idle cycles. |
| `ui.js` | Coin selector (3 pill buttons with per-coin border colors), flip button disable/enable, result fade-in, heads/tails counters. Calls `setOnComplete` internally. |
| `main.js` | Entry point. Wires scene → coin → animation → ui → render loop. |

## Coin system

Three coins, each with a distinct procedural texture drawn on `512×512` Canvas 2D:

| Key | Color | Heads | Tails |
|-----|-------|-------|-------|
| `mxn` | gold `#c8a020` | Mexican eagle, nopal cactus, lake, arc text | "5 PESOS", year, dot ring |
| `eur` | gold `#c8a020` | 12 stars, Europe silhouette, "EUROPA" | "1 EURO", 12 stars, radial lines |
| `usd` | silver `#c0c0c0` | Washington bust, "LIBERTY", "IN GOD WE TRUST" | Bald eagle, 13 stars, "QUARTER DOLLAR" |

Drop real coin photos into `public/textures/` as `{coin}-heads.jpg` / `{coin}-tails.jpg` and restart — no code changes needed.

## Docker / networking

The container exposes port 3000 internally only (`expose`, not `ports`). An external Nginx reverse proxy on `proxy-network` routes traffic to `http://coinflip:3000`. Change the `networks.proxy-network` name in `docker-compose.yml` to match your actual network.
