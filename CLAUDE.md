# Marketing assets repo: working rules for Claude

Public marketing media for Code Slice projects, one folder per project (`iraqistar/`, ...).
Since Oct 2026, **Cloudflare R2 is the host for media**. Git holds source files (generators, briefs,
captions, HTML) and the media that was committed before the switch.

## Where things live

| What | Git | R2 bucket `iraqistar-marketing` |
|---|---|---|
| Videos (`.mp4 .mov .m4v .webm`) | Ignored from Oct 2026 (older ones stay tracked) | Yes |
| Images, audio, HTML, scripts, briefs | Yes | Yes (mirror) |
| `.git`, `node_modules`, `_old`, `.DS_Store`, `CLAUDE.md`, `.githooks` | n/a | Excluded (`.r2ignore`) |

- R2 public base URL: `R2_PUBLIC_BASE_TODO` (the bucket's r2.dev Public Development URL; replace when known).
- R2 keys live on Mustafa's Mac at `~/.config/codeslice/r2.env`, never in this repo (the repo is public).

## Publishing new content

1. Save the file under the project folder, keeping the existing layout,
   e.g. `iraqistar/video/<reel-name>/IraqiStar-<reel-name>.mp4`.
2. **Never overwrite a published file.** A changed asset gets a new name (`-v2`, `-v3`).
   R2 has no version history and caches by URL, so overwriting silently breaks or stale-serves links.
3. Commit the source files and run `git push` **on Mac's own Terminal** (or GitHub Desktop).
   The `.githooks/pre-push` hook runs `scripts/r2-sync.sh` first, which uploads the whole working
   folder to R2 (add-only, never deletes). If the sync fails the push is aborted;
   `SKIP_R2=1 git push` skips it once.
   - Claude's sandbox on the Mac has no GitHub login and cannot reach R2, so Claude can commit but
     must ask Mustafa to push. Upload-only without pushing: `scripts/r2-sync.sh <subfolder>`.
4. One-time on a fresh clone: `git config core.hooksPath .githooks`, `brew install rclone`, create the env file.

## Building the URL for ads and posts

```
<R2_PUBLIC_BASE>/<path relative to repo root>
```
Example: `iraqistar/video/teachers-reel/IraqiStar-teachers-reel.mp4`
-> `R2_PUBLIC_BASE_TODO/iraqistar/video/teachers-reel/IraqiStar-teachers-reel.mp4`

- Path segments are case-sensitive and must match the file exactly. URL-encode spaces and Arabic
  characters (better: use only `A-Z a-z 0-9 - _ .` in filenames).
- **Before handing a URL to Meta or Metricool, verify it**: `curl -sI <url>` must return `200` with
  `content-type: video/mp4` (or the image type). A 404 means the sync has not run for that file yet.
- **Meta Ads**: upload with the media-upload tool in URL mode using the R2 URL, wait until the video
  status is `ready`, then create the creative. For a video creative pass only one of `image_hash` /
  `image_url` as the thumbnail, never both (Meta rejects it).
- **Metricool**: use the R2 URL as the media URL. Metricool copies media into its own storage at
  scheduling time, so the link only needs to work when the post is scheduled.
- **Legacy**: posts and assets created before Oct 2026 use
  `https://raw.githubusercontent.com/Code-Slice-Team/marketing/main/<path>`. Leave those as they are;
  do not use raw GitHub URLs for new videos (they are no longer pushed to git).
- The r2.dev URL is rate-limited and intended for development. It is fine for Meta and Metricool,
  which download once. Do not embed it on websites or in emails that audiences load directly; that
  needs a custom domain on the bucket first.
