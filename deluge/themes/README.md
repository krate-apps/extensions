# Krate — Deluge

Deluge WebUI theme. **Look** aligned with the ruTorrent Krate theme (HarmonyUI sky, cards, palette). Architecture is Deluge-specific: vendor Ext xtheme + one `style.css` + one `js/theme.js`.

## Layout

| Path | Role |
|------|------|
| `themes/css/xtheme-krate.css` | Ext skin (copied into Deluge vendor WebUI) |
| `style.css` | Tokens, palette, Status overview cards |
| `init.js` | Injected by Caddy; loads CSS/JS with `?kr=` bust |
| `js/theme.js` | Palette, mono icons, Status cards |

`init.js` is linked from Deluge’s vendor `index.html` via `${base}krate-theme/…` (install/deploy patches that file). Caddy only serves `/krate-theme/*` (no HTML replace, no SemVer in the proxy). Theme SemVer lives in `init.js` / `plugin.info`.

## Variants

Dark (default), Light, Auto — palette control in the toolbar.

## Deploy (trevor on krate-server)

Run from a machine that can SSH as `krate-client` (this laptop). Paths below are on the **server**, not the laptop.

```bash
THEME=/home/thomas/Dev/GitHub/Organizations/Krate/krate-apps/krate-theme/deluge

rsync -av --delete "$THEME/" krate-client:/opt/trevor/deluge/krate-theme/

ssh krate-client 'cp -f /opt/trevor/deluge/krate-theme/themes/css/xtheme-krate.css \
  /home/trevor/.krate/active/deluge/usr/lib/python3.13/site-packages/deluge/ui/web/themes/css/xtheme-krate.css \
  && chown -R trevor:trevor /opt/trevor/deluge/krate-theme'

# Ensure vendor index.html loads init (once; idempotent):
ssh krate-client 'IDX=/home/trevor/.krate/active/deluge/usr/lib/python3.13/site-packages/deluge/ui/web/index.html
grep -q krate-theme/init.js "$IDX" || sed -i "s|</head>|        <link rel=\"stylesheet\" type=\"text/css\" href=\"\${base}krate-theme/style.css\"/>\n        <script defer type=\"text/javascript\" src=\"\${base}krate-theme/init.js\"></script>\n    </head>|" "$IDX"'

# Only when the Caddy fragment shape changes (not on every version bump):
scp /home/thomas/Dev/GitHub/Organizations/Krate/krate-apps/bugs/caddy/softwares/path/trevor.deluge.caddy \
  krate-client:/etc/caddy/softwares/path/trevor.deluge.caddy
ssh krate-client 'systemctl reload caddy'
```

`web.conf` must have `"theme": "krate"`.

## Development

- Tests: `npm test`
- Bump: `bash scripts/release.sh`

## License

Unlicense — [LICENSE](LICENSE).
