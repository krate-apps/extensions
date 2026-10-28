# Krate

![Krate, Dark](docs/screenshots/main-dark.webp)

ruTorrent theme aligned with HarmonyUI (sky accent, Dark / Light).

**Distribution**

- **Any ruTorrent** — copy or symlink this `Krate/` tree into `plugins/theme/themes/` (see Install). GitHub Releases ship a standalone archive when this theme repo tags a version.
- **KRATE** — included automatically in KRATE app / extensions releases; install/update sets `$defaultTheme = "Krate"`.

## Variants

| Variant | Role |
|---------|------|
| **Dark** | Default. Charcoal `#171519`, sky accent. |
| **Light** | Light gray page, sky accent. |
| **Auto** | HarmonyUI `krate_theme` cookie → `localStorage.theme` → `prefers-color-scheme`. |

Choose a variant next to the stock theme list in Settings. Auto re-checks when the tab regains focus.

Screenshots: [docs/screenshots/README.md](docs/screenshots/README.md). Re-capture against a live install if the chrome has changed.

## Install

### KRATE

Install/update writes `$defaultTheme = "Krate"` into the theme plugin `conf.php`.

### Any ruTorrent

```bash
cd /path/to/rutorrent/plugins/theme/themes
# copy or symlink the Krate/ tree here
chown -R www-data: Krate
printf '%s\n' '<?php' '' '$defaultTheme = "Krate";' > ../conf.php
```

Reload ruTorrent. Auto mode needs a `krate_theme` cookie or `localStorage.theme` (HarmonyUI); otherwise it follows `prefers-color-scheme`.

## Development

- Script contract: [docs/JS.md](docs/JS.md)
- Tests: `npm test`
- Catalog: `sh scripts/i18n.sh`
- Bump SemVer + local changelogs (cache-bust `?kr=<version>`, What’s New): `bash scripts/release.sh`
- GitHub draft notes: Release Drafter (`.github/release-drafter.yml`)

## Translations

Catalog under `lang/`. Procedure: [TRANSLATING.md](TRANSLATING.md).

## Changelog

[CHANGELOG.md](CHANGELOG.md) — also used by the in-UI What’s New dialog.

## License

Unlicense — [LICENSE](LICENSE). Icon glyphs from [Material Design Icons](https://pictogrammers.com/library/mdi/) (Apache-2.0).
