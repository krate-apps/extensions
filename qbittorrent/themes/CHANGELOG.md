# Changelog

Release notes for the Krate qBittorrent theme. Per-version files live under `changelogs/`.

## 1.0.0 — 2026-11-03

Initial stable Krate HarmonyUI theme for qBittorrent WebUI: Dark / Light / Auto palette, toolbar brand + mono icons, General overview cards, shell-only Caddy inject (Execution Log safe), Options gear restored, cache-busted theme assets.

## 0.0.19 — 2026-11-03

Fix Execution Log: cache-bust `init.js` in Caddy inject + no-cache theme assets; force `.invisible` with `!important`; repair Mocha `height: NaN`; switch Log column on click (`#logTabLink` is the `<li>`).

## 0.0.18 — 2026-11-03

Fix Execution Log: Caddy inject on a path-disjoint shell route only (no `replace` buffering of Mocha `views/*`). Soften Log tab click if `qBittorrent.Log` failed to init.

## 0.0.17 — 2026-11-02

Stop hiding toolbar buttons that use stock `class="divider"` (Options gear, Start, queue). Scope Caddy HTML inject to `/` and `/index.html` so Mocha panels (Execution Log) are not corrupted by a second `init.js` load.

## 0.0.16 — 2026-11-02

Embed the Krate cube logo as a data URI (no 404). Restore toolbar Options/queue controls. Hide redundant properties tabs. Space overview card rows. Show full tracker and peer lists in the overview cards.

## 0.0.15 — 2026-11-02

Sync the appearance palette with qBittorrent’s Options “Color scheme” (`color_scheme` / ClientData / LocalPreferences). Hide toolbar dividers and strip left borders on tool icons.

## 0.0.14 — 2026-11-02

Use the real Krate cube logo on the toolbar brand chip (`krate-logo.png` at theme root, excluded from mono icon tint). Space overview cards further apart. Restyle properties tabs as an underline strip so they read as navigation rather than competing cards.

## 0.0.13 — 2026-11-02

Fix General overview: force cache-busted `style.css`, hide stock fieldsets (broken `*` selector + JS hide), resolve selected torrent hash more reliably, and draw the toolbar Krate mark as inline SVG.

## 0.0.12 — 2026-11-02

Bundle the General overview into `js/chrome.js` so it no longer depends on a separate `details.js` request (404 on some Caddy layouts).

## 0.0.11 — 2026-11-02

Serve the General overview without nested CSS 403s (styles folded into `style.css`; `details.js` at theme root). Fix the Caddy `krate-theme*` prefix matcher so nested theme assets are not authorized/proxied. Stop replacing the stock qBittorrent favicon — the Krate mark stays on the toolbar brand chip only.

## 0.0.10 — 2026-11-02

Add a ruTorrent-minded General overview for the properties pane: completion ring, live speeds, ratio, ETA, and Swarm / Tracker / Storage cards driven by the qBittorrent properties API. Style properties tabs as pills.

## 0.0.9 — 2026-11-02

Fix the appearance switcher glyph: embed the palette icon as inline SVG so it no longer depends on `images/icons/palette-switch.svg` loading (broken square when the icons tree was missing). Raise the menu z-index and keep the toolbar overflow visible so the dropdown is not clipped.

## 0.0.8 — 2026-11-02

Restore a ruTorrent-minded chrome: keep stock toolbar/filter icons visible with a mono Krate tint (no Deluge opacity:0 masks), show the appearance switcher as a real `<img>`, and harden sidebar text contrast.
