# SIGNAL ATLAS / 訊號圖譜

An original, bilingual portfolio of AI-assisted projects by CC HSIEH. Six case studies connect a question, an implementation, an observed result and its limits. Created for the One Who Codes 2026 portfolio challenge.

The scientific drawings are conceptual illustrations, not measured data. Competition public scores are not final rankings or awards. Source code and restricted competition data from the featured projects are not included here.

## Run locally

The published site is `dist/`; it has no framework, package installation, remote font, analytics or build dependency.

```sh
node build.mjs
python -m http.server 8766 --bind 127.0.0.1 --directory dist
```

Open the URL printed by the server. Use English or 繁體中文 at the top of the page. Category filters and accessible case-study dialogs enhance the static document; without JavaScript all six case studies and their outbound links remain readable.

## Editing

- `dist/projects.json`: bilingual case content and already-public evidence links, dated 2026-11-05.
- `build.mjs`: deterministic static HTML generator and original SVG diagrams.
- `dist/app.js`: language selection, category filters and native dialog enhancement.
- `dist/styles.css`: responsive editorial layout with system fonts, reduced motion and forced-color support.

All asset paths are relative, including deployment below a GitHub Pages repository prefix. No login, API key, wallet, data collection or purchase is needed to explore this portfolio. Outbound links lead to separate services.

## Authorship and provenance

CC HSIEH directed the projects and this portfolio with AI-assisted research, implementation and review. This repository records actual new portfolio development; it does not reconstruct or backdate the histories of the featured projects. Linked upstream and project repositories retain their own licenses. This portfolio does not relicense those materials.

Only the scoped files in this repository are intended for public release. Private evidence, review receipts and publication approvals remain outside Git history.

## GitHub Pages publication

The `main` branch contains the portfolio source and genuine development history. The `gh-pages` branch publishes the reviewed contents of `dist/` at its root, including `.nojekyll`, using GitHub Pages branch publishing. The deployment does not require a custom workflow file, a secret or a broader GitHub OAuth scope. A successful push is recorded separately from the live-site verification.
