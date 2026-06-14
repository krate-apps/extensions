# KRATE Plugins Store

Curated ruTorrent extensions and themes bundled with the `krate` Debian package at `/opt/Krate/share/applications/plugins/`.

**License:** [AGPL-3.0](LICENSE) for KRATE packaging. Vendored plugins and themes keep their **upstream licenses** — check each directory under `rutorrent/`.

## Layout

```
rutorrent/
  sources.yaml    # upstream repositories and pinned refs
  ext/            # plugin trees
  themes/         # theme trees
```

## Updating upstream sources

Edit `rutorrent/sources.yaml`, then run the sync workflow (`.github/workflows/rutorrent-pack.yml`). It also runs on a weekly schedule and can be triggered manually.

The workflow clones listed upstream repos, refreshes `ext/` and `themes/`, and tags a `rutorrent-pack.tar.gz` release asset.

## Related repositories

- [`apps-official`](https://github.com/krate-client/apps-official) — the `rutorrent` app definition references this pack
- [`releases`](https://github.com/krate-client/releases) — stages plugins into the `krate` `.deb`
- [`apps-official-source`](https://github.com/krate-client/apps-official-source) — plaintext source for official apps

## Third-party notices

See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) for upstream attribution.
