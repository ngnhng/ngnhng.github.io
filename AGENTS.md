This file provides guidance when working with code in this repository.

## Project Overview

This is a personal website and blog for Nhat-Nguyen, built as a static site using pure HTML and CSS. The project follows a minimalist philosophy prioritizing performance, accessibility, and readability.

## Development Commands

- Always start with `nvm use`
- `pnpm start` - Start local development server using the `serve` package

## Architecture

### Design Philosophy

- Pure HTML/CSS approach (no JavaScript frameworks)
- Mobile-first responsive design with single-column layout
- Base16 default dark color scheme
- Modern browser support only
- Focus on content readability across devices

### File Structure

- `/index.html` - Homepage with bio and blog post links
- `/style.css` - Global styles using CSS custom properties for theming
- `/blog/[post-name]/index.html` - Individual blog posts in their own directories
- `/TODO.md` - Project roadmap and planned features

### CSS Architecture

- Uses CSS custom properties for consistent theming
- Mobile-first responsive design with 768px breakpoint
- Typography: JetBrains Mono for headings, Literata for body text
- Includes accessibility features (focus states, reduced motion support)
- Performance optimizations (font preconnection, minimal dependencies)

### Blog Structure

Each blog post lives in its own directory under `/blog/` with:

- `index.html` containing the post content
- Associated images stored alongside the post
- Shared styling from root `/style.css`

## Development Notes

- The project uses semantic HTML and follows accessibility best practices
- All styling is done through CSS custom properties for maintainability
- Images should be optimized and properly sized for web delivery
- No build process currently exists - files are served directly
