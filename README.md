# Priyanshu Bharti — Developer Portfolio

A multi-page personal portfolio site for **Priyanshu Bharti**, a Full-Stack Developer based in Bihar, India. Built with plain HTML, CSS and JavaScript — no framework, no build step.

**Live demo:** _[add your deployed URL here, e.g. GitHub Pages / Vercel / Netlify link]_

## Pages

Each nav item is a real, separate HTML page (not a single-page scroll):

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Hero with an animated hanging ID badge, tech marquee, About/Projects previews, contact CTA |
| About | `about.html` | Longer bio and an at-a-glance info card |
| Projects | `projects.html` | Grid of project cards with tags and links |
| Experience | `experience.html` | Career timeline plus a skills chip cloud |
| Open Source | `opensource.html` | Open source contributions and repo stats |
| FAQ | `faq.html` | Expand/collapse accordion |
| Contact | `contact.html` | Contact links and a message form |

All pages share the same nav bar and footer (repeated per file — see [Notes](#notes) below).

## Tech stack

- **HTML5** — semantic, hand-written per page
- **CSS3** — one shared stylesheet (`css/styles.css`), custom properties for theming, CSS animations/keyframes for the hero badge, scroll-reveal, and accordion transitions
- **Vanilla JavaScript** (`js/script.js`) — mobile nav toggle, FAQ accordion, contact form handling, `IntersectionObserver`-based scroll reveals and number counters, scroll-aware nav styling
- **Google Fonts** — [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (display), [Inter](https://fonts.google.com/specimen/Inter) (body), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (stats/tags/data)

No build tools, package manager, or dependencies required.

## Project structure

```
design-portfolio/
├── index.html
├── about.html
├── projects.html
├── experience.html
├── opensource.html
├── faq.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/        # place any images/icons here
├── .gitignore
├── LICENSE
└── README.md
```

## Running locally

No build step — just serve the folder statically. From the project root:

```bash
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser.

Alternatives:

```bash
# Node
npx serve .

# PHP
php -S localhost:8000
```

## Editing

- Update contact info, project details, experience entries and open-source stats directly in the relevant HTML file — content is marked `[Placeholder]` where it's meant to be replaced.
- Shared styling lives in `css/styles.css`; shared behavior in `js/script.js`. Both are linked from every page, so a change there applies site-wide.
- Add real images/icons to `assets/images/` and reference them with a relative path, e.g. `assets/images/photo.jpg`.

## Notes

- The nav bar and footer markup is duplicated in every HTML file by design (no framework/includes). If this project later moves to a framework or static site generator, that markup is the natural candidate to extract into a shared `<Nav>` / `<Footer>` component or template partial.
- The contact form has no backend — wire it up to a service like [Formspree](https://formspree.io/) or your own API to actually receive submissions.

## License

Released under the [MIT License](LICENSE).
