# YOCK Portfolio

Static portfolio site for George Yockachonis, designed to run directly on GitHub Pages.

## Files

- `index.html` - splash entry screen
- `portfolio.html` - main portfolio page
- `styles.css` - responsive layout, splash screen, and visual design
- `script.js` - YOCK entry animation and reduced-motion handling
- `GYockachonis Resume.docx` - downloadable resume linked from the hero buttons

## Local Preview

Open `index.html` in a browser, or serve the folder with any static file server.

## GitHub Pages Setup

For a personal GitHub Pages site, create or use a repository named:

```text
theyock.github.io
```

Put these files at the repository root. After GitHub Pages is enabled, the site should publish at:

```text
https://theyock.github.io/
```

## Before Publishing

- Add your preferred email or LinkedIn link to the contact section when ready.
- Replace the resume file when you have an updated version.
- Add more project source links as the repositories are ready to share.

## Adding project photos — no lists to edit

Put pictures directly in these folders:

- `images/asher/` for Asher Engine
- `images/openrealm/` for Project OpenRealm
- `images/tooling/` for IT / Network Tooling

PNG, JPG, JPEG, GIF, WebP, AVIF, and SVG files are supported. Use any filenames.
Only files directly in those folders are included, not subfolders. Prefix names
with 01-, 02-, etc. to choose the order.

### On your computer

Double-click `Open Portfolio.cmd`. It opens your portfolio and watches the photo
folders. Leave its window open, add or remove images, then refresh your browser.
The helper maintains project-photos.js automatically. Close the window to stop.
Opening portfolio.html on its own uses the last generated photo list.

### On GitHub Pages

Upload the pictures into the matching folders in your public theyock.github.io
repository. The page discovers them using GitHub's public directory API, with no
filename list to maintain. Allow the Pages deployment to finish before refreshing.
Upload the updated project-photos.js as well for an offline/API-failure fallback.
GitHub's unauthenticated API has rate limits; when unavailable, the page uses that
fallback list. This discovery is configured for theyock.github.io at the site root.

Use the updated HTML, CSS, both project JavaScript files, and images folders.
The splash animation is unchanged. Never upload private or sensitive screenshots.
