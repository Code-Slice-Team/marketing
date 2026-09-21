# Code Slice marketing assets

Public media for social posts across Code Slice projects, one folder per project. Metricool fetches images and
videos from this repo's raw URLs, so it must stay public. Nothing here is secret: rendered post images, Reels,
captions and the generators that make them.

- `<project>/instagram/<month>/` — media, `PLAN.md` (captions and dates), `posts.mjs` (copy and schedule), `build.mjs` (renderer).
- Raw URL pattern: `https://raw.githubusercontent.com/Code-Slice-Team/marketing/main/iraqistar/instagram/2026-10/post-02.png`
- Media is copied to Metricool's own storage when a post is scheduled, so old months can be pruned later.
