# Krate

Deluge WebUI theme aligned with HarmonyUI (sky accent, Dark / Light).

**Distribution**

- **Any Deluge** — copy `themes/css/xtheme-krate.css` into Deluge’s `ui/web/themes/css/`, set `"theme": "krate"` in `web.conf`, and load `init.js` (Caddy inject or a `<script>` in `index.html`).
- **KRATE** — synced into `krate-apps/extensions/deluge/themes`; install copies the xtheme into the vendor WebUI and injects the shell via Caddy.

## Variants

| Variant | Role |
|---------|------|
| **Dark** | Default. Charcoal `#171519`, sky accent. |
| **Light** | Light gray page, sky accent. |
| **Auto** | HarmonyUI `krate_theme` cookie → `localStorage.theme` → `prefers-color-scheme`. |

The chrome control (injected) switches variants. Auto re-checks when the tab regains focus.

## Install

### KRATE

Install/update writes the xtheme into the active Deluge vendor tree and sets `"theme": "krate"`. Caddy injects `init.js` and serves theme assets under `{base}/krate-theme/`.

### Any Deluge

```bash
# From this tree:
cp themes/css/xtheme-krate.css /path/to/deluge/ui/web/themes/css/
# web.conf → "theme": "krate"
# Serve this tree and inject: <script defer src="…/init.js"></script>
```

## Development

- Tests: `npm test`
- Catalog: `sh scripts/i18n.sh`
- Bump SemVer + changelogs: `bash scripts/release.sh`

## License

Unlicense — [LICENSE](LICENSE).
