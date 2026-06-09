# Robyn Books Page

Single-page static landing page for Robyn Crane's books.

## Files

- `index.html` — landing page with hero, book cards, external book buttons, and waitlist modal.
- `thank-you.html` — placeholder confirmation page.
- `styles.css` — mobile-first styling inspired by robyncrane.com/test-page/.
- `script.js` — accessible modal behavior and placeholder form success handling.
- `assets/` — Robyn Crane logo and book images sourced from robyncrane.com/books/.

## Waitlist form configuration

The modal form currently uses a local placeholder success state with first name, email, and phone fields:

```html
<form action="thank-you.html" method="get" data-success-mode="message">
```

To redirect to `thank-you.html` after submit instead, change `data-success-mode="message"` to `data-success-mode="redirect"`.

To connect a real provider, replace the form `action`, `method`, and input names with the provider embed requirements.
