# Krate

Flood theme aligned with HarmonyUI (sky accent, Dark / Light).

**Distribution**

- **Any Flood** — inject `style.css` + `init.js` before `</head>` (reverse-proxy replace, or Stylus).
- **KRATE** — synced into `krate-apps/extensions/flood/themes`; Caddy injects both and serves assets under `{base}/krate-theme/`.

Flood has no native theme drop-in; this is an override layer on top of the built-in light/dark UI.

## Variants

| Variant | Role |
|---------|------|
| **Dark** | Default. Charcoal `#171519`, sky accent. |
| **Light** | Light gray page, sky accent. |
| **Auto** | HarmonyUI `krate_theme` cookie → `localStorage.theme` → `prefers-color-scheme`. |

The switcher mounts in Flood’s top `.action-bar` (not a floating overlay). Flood’s stock sidebar light/dark button is hidden; Krate syncs `userPreferDark` + `.application.dark`.

## Install

### KRATE

Install/update deploys the theme tree next to the Flood binary and regenerates the Caddy fragment (stylesheet + script inject).

### Any Flood (Caddy `replace-response`)

```caddyfile
header_up Accept-Encoding identity
replace {
	`</head>` `<link rel="stylesheet" href="/flood/krate-theme/style.css"><script defer src="/flood/krate-theme/init.js"></script></head>`
}
```

Do **not** run `replace` on `/api/*` — buffer mode stalls Flood's SSE `activity-stream` and leaves `/overview` on the loading screen. Prefer a path split (document route with replace, `/api/*` without).

Serve this tree at that URL path.

## Development

- Tests: `npm test`
- Catalog: `sh scripts/i18n.sh`
- Bump SemVer + changelogs: `bash scripts/release.sh`

## License

Unlicense — [LICENSE](LICENSE).
