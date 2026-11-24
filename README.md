# Digital Business Card

    npm install
    npm run dev          # http://localhost:3000/ahmed-mohamed
    npm run verify       # also: verify:share, verify:theme, verify:qr

## Add a customer
1. Copy `data/cards/ahmed-mohamed.js`, rename it to the customer's slug, edit the values.
2. Register it in `data/cards/index.js`.
3. Put images in `public/cards/<slug>/` (avatar.webp, logo, og.jpg 1200x630).

## Before deploying
- Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`). It drives canonical URLs, Open Graph, the sitemap and robots.txt.
  Without it, Vercel's production domain is used; locally it falls back to localhost.
- Per card: `ogImage` (share preview), `schemaType` (Person, Physician, ...), `seoNoindex: true` to hide a card from Google.

## Security notes (frontend-only project)
- Every customer-supplied value is validated in `lib/` before it becomes a link, image, file or page URL
  (`url.js`, `email.js`, `phone.js`, `maps.js`, `actions.js`, `card.js`). Invalid values hide their button and print a warning at build time.
- Social links must be on the matching platform; "Maps URL" must be a Google Maps link; images must be a `/local/path` or `https://` URL.
- Run `npm run verify:security` after changing anything in `lib/`.
- Customer data on a card is public by design (phone, email, address appear in the page, JSON-LD and the vCard).
- Commit `package-lock.json`, install with `npm ci`, and re-run `npm audit` before each release.
