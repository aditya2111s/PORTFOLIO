# Aditya Portfolio

A small, dependency-free portfolio built with semantic HTML, CSS, and vanilla JavaScript.

## Local preview

Serve the directory over HTTP rather than opening `index.html` directly:

```sh
npx serve .
```

Then open the local URL printed by the server. A deployed site should use HTTPS.

## Project structure

- `index.html` — page content, metadata, navigation, and contact form.
- `style.css` — responsive layout, theme tokens, and component styles.
- `script.js` — theme preference, mobile navigation, current year, and AJAX form submission.
- `favicon.svg` — lightweight site icon.

## Contact form

The form uses FormSubmit. Before launching, confirm the form once from the email address configured in `index.html` so the provider can activate it. The form includes:

- Native browser validation and field length limits.
- A FormSubmit honeypot field.
- An accessible pending, success, and error status.
- An email fallback in the contact section.

If the form provider or endpoint changes, update the form action and the AJAX endpoint logic together in `script.js`.

## Theme behavior

The theme defaults to the operating-system preference, remembers an explicit light/dark choice in `localStorage`, and applies the saved choice before the page stylesheet loads. Storage failures are handled without disabling the rest of the page.

## Deployment

No public hosting or automatic deployment workflow is configured. Changes remain local until explicitly committed and published.

## Quality checks

```sh
node --check script.js
npx html-validate index.html
npx eslint script.js --no-config-lookup
```

Before publishing, manually test keyboard navigation, the mobile menu, both themes, reduced motion, form success/failure states, and the FormSubmit activation email.
