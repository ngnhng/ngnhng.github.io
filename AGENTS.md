This file provides guidance when working with code in this repository.

## Project Overview

This is a personal website and notes/blog site for Nhat-Nguyen. The current codebase is built with Astro, Markdown/MDX content collections, and a small Lit custom element for the theme toggle. The generated site is committed back into the repository root for GitHub Pages style publishing.

## Toolchain

- Always start with `nvm use`
- `.nvmrc` pins Node `22`
- Package manager: `pnpm`
- Main framework: Astro
- Content format: Markdown and MDX
- Interactive UI: Lit web component in `src/components/widgets/theme-toggle.ts`

## Development Commands

- `pnpm dev` or `pnpm start` - run the Astro dev server
- `pnpm check` - run Astro type/content checks
- `pnpm build` - build the site into `dist/`
- `pnpm publish:root` - copy `dist/` output into the repository root
- `pnpm fmt` - format the codebase with `oxfmt`
- `pnpm fmt:check` - check formatting without modifying files

## Development Flow

- Make source edits in `src/`, `public/`, or other true source directories
- Do not hand-edit generated root output unless the task is explicitly about published artifacts
- For normal site work:
  1. `nvm use`
  2. edit source files
  3. run `pnpm check`
  4. run `pnpm build` if the change affects generated output
  5. run `pnpm publish:root` when the published root files need to be refreshed

## Source Of Truth

- `src/pages/` defines routes
- `src/layouts/` contains Astro layouts
- `src/components/` contains Astro components
- `src/components/widgets/` contains Lit custom elements
- `src/content/` is the source of truth for blog posts and notes
- `src/styles/global.css` holds the shared site theme and typography
- `public/` contains static assets that should be copied through as-is

## Generated And Published Artifacts

These paths are generated or published output and should usually be updated through the build flow, not edited directly:

- `/index.html`
- `/blog/**/index.html`
- `/notes/**/index.html`
- `/_astro/`
- `/rss.xml`
- `/sitemap-*.xml`
- `/sitemap-index.xml`
- `/dist/`

The repository root acts as the published site output after `pnpm publish:root`.

## Content Architecture

- Blog content lives in `src/content/blog/**/*.{md,mdx}`
- Notes content lives in `src/content/notes/**/*.{md,mdx}`
- Content schemas are defined in `src/content.config.ts`
- Blog and notes routes are rendered from Astro pages in `src/pages/blog/` and `src/pages/notes/`
- If a note or post references static media, keep those assets under `public/` unless there is a clear Astro-specific reason to do otherwise

## Presentations

- The REST API design workshop presentation is checked in under `blog/rest-api-design-workflow/`
- `pnpm build` runs `scripts/sync-presentation-artifacts.mjs` before the Astro build
- That script copies presentation artifacts into `public/presentations/rest-api-design-workflow`
- `scripts/cleanup-transient-public-assets.mjs` removes those transient copied assets after the build
- Avoid editing `public/presentations/` directly; treat it as transient build input

## Styling And UI

- The site uses CSS custom properties in `src/styles/global.css` for theming
- Default theme is dark, with a light theme selected through the Lit theme toggle
- Keep the visual style minimalist, readable, and content-first
- Preserve semantic HTML and accessibility-focused markup
- For Lit reactive properties, avoid class-field shadowing of declared reactive properties

## Working Conventions

- Prefer changing Astro source files over generated HTML
- Prefer updating content in `src/content/` over editing published pages in `blog/` or `notes/`
- When changing routes or layouts, verify both dev behavior and generated output expectations
- When touching theme behavior, check both the site CSS and the Lit toggle component
- Keep static assets optimized and use stable, web-friendly file paths
