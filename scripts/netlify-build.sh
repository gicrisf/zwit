#!/usr/bin/env bash
set -euo pipefail

version="${ONDINE_VERSION:-0.2.0}"
archive="ondine-v${version}-x86_64-unknown-linux-musl.tar.gz"
release="https://github.com/gicrisf/ondine-cli/releases/download/v${version}"
cache_root="${NETLIFY_CACHE_DIR:-${PWD}/.cache}"
destination="${cache_root}/ondine/v${version}"

if [[ ! -x "${destination}/ondine" ]]; then
  mkdir -p "${destination}"
  temporary="$(mktemp -d)"
  trap 'rm -rf "${temporary}"' EXIT

  curl -fsSL "${release}/${archive}" -o "${temporary}/${archive}"
  curl -fsSL "${release}/SHA256SUMS" -o "${temporary}/SHA256SUMS"
  (cd "${temporary}" && grep "  ${archive}$" SHA256SUMS | sha256sum -c -)
  tar -xzf "${temporary}/${archive}" -C "${destination}" --strip-components=1
fi

export PATH="${destination}:${PATH}"
python3 scripts/site.py build "$@"
