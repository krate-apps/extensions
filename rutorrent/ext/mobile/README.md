# ruTorrent-Mobile

Krate’s mobile UI for [ruTorrent](https://github.com/Novik/ruTorrent). It replaces the bundled `mobile` plugin on KRATE hosts with an app-like shell: bottom navigation, torrent cards, detail action bar, and Dark / Light tokens aligned with the [Krate](https://github.com/krate-apps/krate-torrent) desktop theme.

## Install

This repository is the plugin root (`plugin.info`, `init.js`, `mobile.html`, `mobile.css`, …).

On KRATE it is synced into `extensions` as `rutorrent/ext/mobile` and deployed over `/srv/rutorrent/app/plugins/mobile`.

For a manual install, copy the repository contents into `rutorrent/plugins/mobile/`.

## Usage

- Auto-activates on phones/tablets when detection is enabled (core plugin behavior).
- Force on desktop: append `?mobile=1` to the ruTorrent URL.
- Theme: Settings → Light / Dark / System (`data-kr-variant` + Bootstrap `data-bs-theme`).

## Optional plugins

Same as upstream mobile: `_getdir`, `erasedata`, `seedingtime`, `ratio`, `throttle`, `datadir`, `diskspace`, `check_port`, `geoip`, `tracklabels`.

## License

GPL-3.0-or-later (derivative of Novik/ruTorrent `plugins/mobile`). See [LICENSE](LICENSE).
