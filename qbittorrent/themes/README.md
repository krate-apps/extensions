# Krate

qBittorrent WebUI theme aligned with HarmonyUI (sky accent, Dark / Light).

Stock qBittorrent has no CSS theme drop-in; this is an override layer injected before `</head>`.

**Distribution**

- **Any qBittorrent** — inject `style.css` + `init.js` (reverse-proxy replace, or Stylus).
- **KRATE** — synced into `krate-apps/extensions/qbittorrent/themes`; Caddy injects both and serves assets under `{base}/krate-theme/`.

## Variants

| Variant | Role |
|---------|------|
| **Dark** | Default. Charcoal `#171519`, sky accent. |
| **Light** | Light gray page, sky accent. |
| **Auto** | HarmonyUI `krate_theme` cookie → `localStorage.theme` → `prefers-color-scheme`. |

## Install

### KRATE

Install/update deploys the theme tree and regenerates the Caddy fragment.

### Any qBittorrent (Caddy `replace-response`)

```caddyfile
header_up Accept-Encoding identity
replace {
	`</head>` `<link rel="stylesheet" href="/qbittorrent/krate-theme/style.css"><script defer src="/qbittorrent/krate-theme/init.js"></script></head>`
}
```

## Development

- Tests: `npm test`
- Catalog: `sh scripts/i18n.sh`
- Bump SemVer + changelogs: `bash scripts/release.sh`

## License

Unlicense — [LICENSE](LICENSE).
