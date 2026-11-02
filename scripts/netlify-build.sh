#!/usr/bin/env bash
set -euo pipefail

cache_root="${NETLIFY_CACHE_DIR:-${PWD}/.cache}"

takumi_version="${TAKUMI_RENDER_VERSION:-0.1.0}"
takumi_archive="takumi-render-v${takumi_version}-x86_64-unknown-linux-musl.tar.gz"
takumi_release="https://github.com/gicrisf/takumi-render/releases/download/v${takumi_version}"
takumi_destination="${cache_root}/takumi-render/v${takumi_version}"

if [[ ! -x "${takumi_destination}/takumi-render" ]]; then
  mkdir -p "${takumi_destination}"
  temporary="$(mktemp -d)"
  trap 'rm -rf "${temporary}"' EXIT

  curl -fsSL "${takumi_release}/${takumi_archive}" -o "${temporary}/${takumi_archive}"
  curl -fsSL "${takumi_release}/SHA256SUMS" -o "${temporary}/SHA256SUMS"
  (cd "${temporary}" && grep "  ${takumi_archive}$" SHA256SUMS | sha256sum -c -)
  tar -xzf "${temporary}/${takumi_archive}" -C "${takumi_destination}" --strip-components=1
fi

export TAKUMI_RENDER_BIN="${takumi_destination}/takumi-render"

version="${ONDINE_VERSION:-0.2.0}"
archive="ondine-v${version}-x86_64-unknown-linux-musl.tar.gz"
release="https://github.com/gicrisf/ondine-cli/releases/download/v${version}"
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
