# KRATE Apps Extensions

Optional add-ons, plugins, and themes for KRATE applications. Extensions are not bundled in the `krate` package — they are published here and installed separately on top of an existing app.

**License:** [AGPL-3.0](LICENSE) for KRATE packaging. Vendored third-party content retains its **upstream license** — check each directory.

## Role in the stack

| Layer                                                            | Responsibility                                                |
| ---------------------------------------------------------------- | ------------------------------------------------------------- |
| **`apps-extensions`** (this repo)                                | Optional add-ons published alongside their target apps        |
| [`apps-official`](https://github.com/krate-client/apps-official) | Official app catalog                                          |
| [`krate`](https://github.com/krate-client/krate)                 | Core `.deb` package (console, setup, HarmonyUI, app catalogs) |
| [`web`](https://github.com/krate-client/web)                     | HarmonyUI — extension management from the browser             |

## Current extensions

### ruTorrent (`rutorrent/`)

Plugins and themes for the [`rutorrent`](https://github.com/krate-client/apps-official) app.

```
rutorrent/
  sources.yaml    # upstream repositories and pinned refs
  ext/            # plugin trees (synced from upstream)
  themes/         # theme trees (synced from upstream)
```

Each release publishes a `rutorrent-pack.tar.gz` asset. The workflow ([`.github/workflows/rutorrent-pack.yml`](.github/workflows/rutorrent-pack.yml)) refreshes `ext/` and `themes/` from upstream weekly and on every change to `sources.yaml`.

## Using extensions

1. Install KRATE and add the target app (e.g. `zen software add rutorrent -u <user>`).
2. Pick a release from [GitHub Releases](https://github.com/krate-client/apps-extensions/releases).
3. Deploy the add-ons you want into the app tree on your server.

Extension management is designed to integrate with **zen** and **HarmonyUI** over time.

## Contributing

To add a new extension set, create a directory for the target app and follow the same `sources.yaml` + sync workflow pattern as `rutorrent/`. Open a pull request against `develop`.

## Documentation

- [KRATE documentation](https://krate.github.io/docs/)
