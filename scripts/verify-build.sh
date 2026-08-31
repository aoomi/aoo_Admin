#!/usr/bin/env bash
set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
NODE_BIN=$(cd "$ROOT/.." && pwd)/.toolchains/node-v24.19.0-darwin-arm64/bin
[[ -x "$NODE_BIN/node" && -x "$NODE_BIN/npm" ]] || { echo "missing pinned Node/npm toolchain: $NODE_BIN" >&2; exit 1; }

cd "$ROOT"
PATH="$NODE_BIN:$PATH" npm run quality
