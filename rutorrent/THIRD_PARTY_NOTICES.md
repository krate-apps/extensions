# Third-party notices — apps-extensions

This repository vendors ruTorrent **extensions** (`rutorrent/ext/`) and **themes** (`rutorrent/themes/`) synced from upstream GitHub projects listed in `rutorrent/sources.yaml`.

## KRATE packaging

Scripts and metadata maintained by KRATE (`sources.yaml`, `.github/`, sync tooling) are licensed under **AGPL-3.0** (see [LICENSE](LICENSE)).

## Vendored components

Each synced tree retains its **upstream license**. Before redistribution, check the `LICENSE`, `COPYING`, or `README` file inside the plugin or theme directory.

Examples (non-exhaustive — run `find rutorrent -name 'LICENSE*' -o -name 'COPYING'` after sync):

| Area                 | Typical upstream licenses                   |
| -------------------- | ------------------------------------------- |
| `rutorrent/ext/*`    | GPL-2.0 / GPL-3.0 / MIT (varies per plugin) |
| `rutorrent/themes/*` | GPL / MIT / project-specific                |

## No unified license

**There is no single license covering the entire `apps-extensions` repository.** Each add-on or extension set retains the license of its upstream project. This repository is not bundled in the KRATE `.deb`.

When adding a new upstream source in `sources.yaml`, record its license in the pull request description.
