# Wanning He - Academic Personal Website

Personal academic page for private faculty review.

Built as a minimal static site (HTML + CSS, no build step). Prepared for private deployment on Cloudflare Pages.

## Structure

- `index.html` — About / homepage
- `research.html` — Research interests + publications
- `projects.html` — Project highlights
- `cv.html` — Curriculum vitae
- `style.css` — Shared stylesheet
- `assets/` — Avatar + project cover images
- `functions/_middleware.js` — Cloudflare Pages Basic Auth gate
- `_headers` — no-index and basic security headers

## Cloudflare Pages Deployment

Create a Cloudflare Pages project from this repository/directory:

- Framework preset: `None`
- Production branch: `main`
- Build command: `exit 0`
- Build output directory: `.`

If importing from a larger repository instead of this `website_preview` repository, set the project root directory to `website_preview` first.

Set these Cloudflare Pages environment variables before deploying:

- `BASIC_AUTH_USER`
- `BASIC_AUTH_PASSWORD`

The middleware fails closed if either variable is missing, so the site will return a 500 error instead of becoming public by accident.

After deployment, send the teacher:

- the Cloudflare Pages URL
- the username
- the password

Do not commit the password into this repository.
