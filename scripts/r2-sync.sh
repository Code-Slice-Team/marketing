#!/usr/bin/env bash
# Mirror this marketing repo's working files to Cloudflare R2.
#
# Git stays the source of truth (and keeps serving existing Metricool links);
# R2 is an additive mirror. Uses `rclone copy`, which never deletes or
# overwrites-by-removal anything in the bucket, so published URLs keep working.
# Version media by filename (e.g. -v2.mp4) instead of overwriting.
#
# One-time setup:
#   1. brew install rclone
#   2. Create ~/.config/codeslice/r2.env (OUTSIDE this public repo) containing:
#        R2_ACCOUNT_ID=xxxxxxxxxxxxxxxx
#        R2_ACCESS_KEY_ID=xxxxxxxxxxxxxxxx
#        R2_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxx
#        R2_BUCKET=marketing
#        R2_PUBLIC_BASE=https://media.example.com   # custom domain bound to the bucket
#      then: chmod 600 ~/.config/codeslice/r2.env
#
# Usage (from anywhere):
#   scripts/r2-sync.sh --dry-run        # preview what would upload
#   scripts/r2-sync.sh                  # upload the whole repo
#   scripts/r2-sync.sh iraqistar/video  # upload just one subfolder
set -euo pipefail

ENV_FILE="${R2_ENV_FILE:-$HOME/.config/codeslice/r2.env}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

command -v rclone >/dev/null || { echo "rclone not found: brew install rclone" >&2; exit 1; }
[[ -f "$ENV_FILE" ]] || { echo "Missing $ENV_FILE (see header of this script)" >&2; exit 1; }
# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a
for v in R2_ACCOUNT_ID R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_BUCKET; do
  [[ -n "${!v:-}" ]] || { echo "$v is not set in $ENV_FILE" >&2; exit 1; }
done

DRY=()
SUBPATH=""
for arg in "$@"; do
  case "$arg" in
    --dry-run|-n) DRY=(--dry-run) ;;
    *) SUBPATH="${arg%/}" ;;
  esac
done

# Remote defined via env vars, so no rclone.conf and no secrets on disk in the repo.
export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export RCLONE_CONFIG_R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
export RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true

SRC="$REPO_ROOT${SUBPATH:+/$SUBPATH}"
DST="r2:${R2_BUCKET}${SUBPATH:+/$SUBPATH}"
[[ -e "$SRC" ]] || { echo "No such path: $SRC" >&2; exit 1; }

echo "Uploading $SRC -> $DST ${DRY[*]+${DRY[*]}}"
rclone copy "$SRC" "$DST" \
  --filter-from "$REPO_ROOT/.r2ignore" \
  --checksum --transfers 8 --s3-upload-cutoff 100M --s3-chunk-size 50M \
  --progress ${DRY[@]+"${DRY[@]}"}

[[ -n "${R2_PUBLIC_BASE:-}" ]] && echo "Public URLs: ${R2_PUBLIC_BASE%/}/${SUBPATH:+$SUBPATH/}<path>"
