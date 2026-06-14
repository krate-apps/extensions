#!/usr/bin/env bash
# GitHub Actions only — clone sources.yaml into rutorrent/ext/ and rutorrent/themes/.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)/rutorrent"
YAML="${ROOT}/sources.yaml"
declare -A REPO_CACHE=()

git_clone() {
	local repo="$1" dest="$2" url branch
	if [[ "${repo}" == http://* || "${repo}" == https://* || "${repo}" == git@* ]]; then
		url="${repo}"
	else
		url="https://github.com/${repo}"
	fi
	branch="$(git ls-remote --symref "${url}" HEAD 2>/dev/null |
		awk '/^ref:/ { sub(/refs\/heads\//, "", $2); print $2; exit }')"
	branch="${branch:-main}"
	rm -rf "${dest}"
	git clone --depth 1 --branch "${branch}" "${url}" "${dest}"
	# Nested .git would make the parent repo record gitlinks (submodules) on commit.
	rm -rf "${dest}/.git"
}

repo_checkout_dir() {
	local repo="$1"
	if [[ -z "${REPO_CACHE[${repo}]:-}" ]]; then
		REPO_CACHE["${repo}"]="$(mktemp -d)"
		git_clone "${repo}" "${REPO_CACHE[${repo}]}"
	fi
	printf '%s' "${REPO_CACHE[${repo}]}"
}

install_theme() {
	local repo="$1" target="$2" path="$3" dest src
	dest="${ROOT}/themes/${target}"
	[[ -f "${dest}/.krate" ]] && return 0
	if [[ -z "${path}" || "${path}" == "." ]]; then
		git_clone "${repo}" "${dest}"
		return 0
	fi
	src="$(repo_checkout_dir "${repo}")/${path}"
	[[ -d "${src}" ]] || {
		echo "sync-rutorrent-sources: missing ${path} in ${repo}" >&2
		exit 1
	}
	rm -rf "${dest}"
	cp -a "${src}" "${dest}"
	rm -rf "${dest}/.git"
}

cleanup() {
	local d
	for d in "${REPO_CACHE[@]}"; do
		rm -rf "${d}"
	done
}
trap cleanup EXIT

[[ -f "${YAML}" ]] || exit 0

while IFS=$'\t' read -r kind repo target path; do
	[[ -n "${repo}" && -n "${target}" ]] || continue
	if [[ "${kind}" == plugins ]]; then
		dest="${ROOT}/ext/${target}"
		[[ -f "${dest}/.krate" ]] && continue
		git_clone "${repo}" "${dest}"
	elif [[ "${kind}" == themes ]]; then
		install_theme "${repo}" "${target}" "${path}"
	fi
done < <(awk '
	function trim(s) { sub(/^ +| +$/, "", s); return s }
	/^plugins:/ { k = "plugins"; next }
	/^themes:/ { k = "themes"; next }
	/^[[:space:]]*- repo:/ { sub(/^[^:]*:[[:space:]]*/, ""); r = trim($0); p = "."; next }
	/^[[:space:]]*target:/ {
		sub(/^[^:]*:[[:space:]]*/, ""); t = trim($0)
		if (k != "" && r != "") print k "\t" r "\t" t "\t" p
		r = ""; p = "."
		next
	}
	/^[[:space:]]*path:/ { sub(/^[^:]*:[[:space:]]*/, ""); p = trim($0); next }
' "${YAML}")

echo "sync-rutorrent-sources: done"
