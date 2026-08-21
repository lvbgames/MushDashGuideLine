# Press / Game Asset Update Workspace

This folder is a staging and review workspace for user-approved Lv.B brand and game assets. Files placed here are not published automatically.

## Folders

- `brand/`: approved Lv.B logo or symbol source files
- `mushhero/`: approved MushHero screenshots and game artwork
- `mushdash/`: approved Mush Dash screenshots and game artwork

## Recommended files

- Game screenshots: `mushhero-01`, `mushhero-02`, … or `mushdash-01`, `mushdash-02`, …
- Screenshot size: 1920 × 1080 (16:9), preferably lossless source JPG/PNG or an approved WebP export
- Brand files: clear English names such as `lvb-logo` and `lvb-symbol`; transparent PNG is preferred when transparency is required
- Keep the original extension and do not re-encode an approved source merely to match an existing filename.

## Current site mapping

- Published game screenshots: `site/public/press/assets/mushhero/` and `site/public/press/assets/mushdash/`
- Published brand files: `site/public/brand/`
- Asset paths, dimensions, source URLs and SHA-256 values: `site/src/data/press.ts`
- Press ZIP packages: `site/public/press/downloads/`
- The Home game showcases use the first two local screenshots for each game from the `pressScreenshots` manifest. The Home Hero uses the first three local MushHero screenshots.
- Home serves 640 px and 1280 px WebP derivatives from `site/public/home/assets/`; `site/src/data/homeMedia.ts` maps them to the approved JPG fallback sources. These derivatives are display optimizations, not Press originals.

## Updating an asset

1. Put the user-approved source in the matching folder here and record its source and usage rights.
2. Review the crop, resolution and filename. Do not overwrite an unrelated approved source.
3. Copy the approved byte-for-byte source to the matching published folder under `site/public/`.
4. Update the path, dimensions, source URL and SHA-256 in `site/src/data/press.ts`.
5. If the image appears on Home, regenerate its 640 px and 1280 px WebP derivatives, update `site/src/data/homeMedia.ts` when the filename changes, and update their validation hashes in `scripts/prepare-production.ps1`.
6. If a Press ZIP should change, rebuild that archive and update its byte size, SHA-256 and documented contents in `docs/PRESS_KIT.md`.
7. Run the full validation in `docs/VALIDATION.md` before deployment.

Replacing a file only in this workspace does not change the live site. This separation keeps review sources recoverable and prevents accidental publication.
