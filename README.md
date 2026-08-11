<!-- KRATE-README-HEADER:START -->
<p align="center">
  <a href="https://github.com/runkrate">
    <img src="https://raw.githubusercontent.com/runkrate/.github/main/assets/logo/logo.png" alt="KRATE" width="128" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/runkrate/krate/stargazers"><img src="https://img.shields.io/github/stars/runkrate/krate?style=flat-square&logo=github" alt="GitHub stars" /></a>
  <a href="https://github.com/runkrate/hub/issues"><img src="https://img.shields.io/github/issues-search/runkrate/hub?query=is%3Aopen&style=flat-square&label=issues%2FPRs" alt="Open issues and pull requests" /></a>
  <a href="https://github.com/runkrate/krate/releases"><img src="https://img.shields.io/github/v/release/runkrate/krate?style=flat-square&label=version" alt="Current version" /></a>
  <a href="https://github.com/runkrate/krate/blob/main/LICENSE"><img src="https://img.shields.io/github/license/runkrate/krate?style=flat-square" alt="License" /></a>
</p>

<p align="center">
  <a href="https://runkrate.com"><img src="https://img.shields.io/badge/Website-runkrate.com-0A66C2?style=flat-square" alt="Website" /></a>
  <a href="https://runkrate.com/docs"><img src="https://img.shields.io/badge/Docs-runkrate.com%2Fdocs-111827?style=flat-square" alt="Docs" /></a>
  <a href="https://ko-fi.com/krate"><img src="https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white" alt="Ko-fi" /></a>
  <a href="https://buymeacoffee.com/krate"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-FFDD00?style=flat-square&logo=buymeacoffee&logoColor=black" alt="Buy Me a Coffee" /></a>
</p>
<!-- KRATE-README-HEADER:END -->

# Extensions

Optional **third-party plugins and themes** packaged for KRATE applications. Today this repository focuses on **ruTorrent** add-ons: plugins under `rutorrent/ext/` and themes under `rutorrent/themes/`.

KRATE syncs upstream trees (see [`rutorrent/sources.yaml`](rutorrent/sources.yaml)), applies packaging metadata, and publishes installable artifacts for hosts that already have the matching app (e.g. ruTorrent). This material is **not** part of the core `krate` `.deb`.

**This project has no affiliation with the upstream maintainers of these plugins or themes.** We only redistribute and package them for convenience on KRATE. Each extension keeps **its own upstream license** — there is no single license for the vendored trees. Packaging scripts and KRATE metadata in this repo are under [AGPL-3.0](LICENSE); see also [`rutorrent/THIRD_PARTY_NOTICES.md`](rutorrent/THIRD_PARTY_NOTICES.md).

## Install KRATE

Do **not** clone this repository to install KRATE. Usable releases come only from [`runkrate/krate`](https://github.com/runkrate/krate).

Follow the install instructions in the [`runkrate/krate` README](https://github.com/runkrate/krate#install). Install the target app first (e.g. ruTorrent), then add extensions from [this repo’s releases](https://github.com/krate-apps/extensions/releases) as described in the [docs](https://runkrate.com/docs).

## What this repository contains

| Path | Contents |
| ---- | -------- |
| `rutorrent/ext/` | Vendored ruTorrent plugins |
| `rutorrent/themes/` | Vendored ruTorrent themes |
| `rutorrent/sources.yaml` | Upstream GitHub sources used for sync |
| `.github/` | Sync / pack workflows |

## Listed extensions (upstream)

Links point to the **official upstream repository** for each add-on (not to this packaging repo).

### Plugins (`rutorrent/ext/`)

| Extension | Upstream |
| --------- | -------- |
| `all-seeders` | [AkdM/rutorrent-all-seeders](https://github.com/AkdM/rutorrent-all-seeders) |
| `autodl-irssi` | [autodl-community/autodl-rutorrent](https://github.com/autodl-community/autodl-rutorrent) |
| `discord` | [DoAndroids/rutorrent-discord](https://github.com/DoAndroids/rutorrent-discord) |
| `diskspace` | [Novik/ruTorrent (PluginDiskspace)](https://github.com/Novik/ruTorrent/wiki/PluginDiskspace) |
| `filemanager` | [nelu/rutorrent-filemanager](https://github.com/nelu/rutorrent-filemanager) |
| `filemanager-media` | [nelu/rutorrent-filemanager-media](https://github.com/nelu/rutorrent-filemanager-media) |
| `filemanager-share` | [nelu/rutorrent-filemanager-share](https://github.com/nelu/rutorrent-filemanager-share) |
| `hide-dotpaths` | [QuickBox/rutorrent_hide-dotpaths](https://github.com/QuickBox/rutorrent_hide-dotpaths) |
| `logoff` | [QuickBox/rutorrent_logoff](https://github.com/QuickBox/rutorrent_logoff) |
| `pausewebui` | [Ardakilic/rutorrent-pausewebui](https://github.com/Ardakilic/rutorrent-pausewebui) |
| `plimits` | [Micdu70/rutorrent-plimits](https://github.com/Micdu70/rutorrent-plimits) |
| `qb-filemanager` | [QuickBox/rutorrent_filemanager](https://github.com/QuickBox/rutorrent_filemanager) |
| `ratiocolor` | [Azema/rutorrent-ratiocolor](https://github.com/Azema/rutorrent-ratiocolor) |
| `rename-torrent` | [Fleshgrinder/rutorrent-rename](https://github.com/Fleshgrinder/rutorrent-rename) |
| `toggle-details-button` | [Micdu70/plugin-toggle_details_button-ruTorrent](https://github.com/Micdu70/plugin-toggle_details_button-ruTorrent) |
| `trackerstatus` | [Micdu70/rutorrent-trackerstatus](https://github.com/Micdu70/rutorrent-trackerstatus) |
| `trklimit` | [Pingblue/trklimit](https://github.com/Pingblue/trklimit) |

### Themes (`rutorrent/themes/`)

| Theme | Upstream |
| ----- | -------- |
| `Agent34` | [norjms/3rd-Party-rutorrent-themes](https://github.com/norjms/3rd-Party-rutorrent-themes) |
| `Agent46` | [norjms/3rd-Party-rutorrent-themes](https://github.com/norjms/3rd-Party-rutorrent-themes) |
| `club-QuickBox` | [QuickBox/club-QuickBox](https://github.com/QuickBox/club-QuickBox) |
| `DarkBetter` | [chocolatkey/DarkBetter](https://github.com/chocolatkey/DarkBetter) |
| `FlatUI_Dark` | [norjms/3rd-Party-rutorrent-themes](https://github.com/norjms/3rd-Party-rutorrent-themes) |
| `FlatUI_Light` | [norjms/3rd-Party-rutorrent-themes](https://github.com/norjms/3rd-Party-rutorrent-themes) |
| `FlatUI_Material` | [norjms/3rd-Party-rutorrent-themes](https://github.com/norjms/3rd-Party-rutorrent-themes) |
| `MaterialDesign` | [themightykitten/ruTorrent-MaterialDesign](https://github.com/themightykitten/ruTorrent-MaterialDesign) |
| `OblivionBlue` | [norjms/3rd-Party-rutorrent-themes](https://github.com/norjms/3rd-Party-rutorrent-themes) |
| `rtModern-Remix` | [Teal-c/rtModern-Remix](https://github.com/Teal-c/rtModern-Remix) |

## Useful links

- [Documentation](https://runkrate.com/docs)
- [Report a bug or suggest a feature](https://github.com/runkrate/hub/issues)

## Contributing

Want to add or update an extension pack? Prefer updating [`rutorrent/sources.yaml`](rutorrent/sources.yaml) and opening a pull request. Read the [contributing guide](https://github.com/runkrate/docs/blob/main/CONTRIBUTING.md) first. Product-wide bugs and ideas go to [hub](https://github.com/runkrate/hub).
