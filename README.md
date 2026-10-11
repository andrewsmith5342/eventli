# Eventli landing page (static HTML, CSS and JavaScript)

A single static page. No framework, no build step, no dependencies. Upload the folder to any static host and it works.

```
index.html          all page content
css/styles.css      all styles; brand colours are variables at the top (:root)
js/pricing.js       every fee figure and the calculator maths
js/main.js          audience switch and fee calculator
images/             put the logo, Eli, team photos, favicon and og image here
tools/pricing-check.js   optional check of the calculator maths (needs Node)
```

## Preview locally

Open `index.html` in a browser, or serve the folder (`python3 -m http.server`) and go to http://localhost:8000.

## Hosting

Upload the whole folder as-is. Works on Vercel (no framework preset, no build command, output = root), Netlify (drag and drop), Cloudflare Pages, GitHub Pages or any web server.

## How it works

- **Audience switch:** both versions (organisers, attendees) are in the HTML. `main.js` toggles the `hidden` attribute. Without JavaScript the organiser version shows.
- **FAQ:** native `<details>` elements, so it works with no JavaScript.
- **Calculator:** inputs are in the HTML; `main.js` reads them, calls `calculateFees()` from `pricing.js` and draws the results list.
- **Icons and Eli:** inline SVG symbols defined once at the top of `index.html` and reused with `<use href="#...">`.
- **Swirls:** inline SVGs with the `swirl` class, hidden from screen readers. Some only show on wider screens (`desktop-only`, `wide-only`).

## Before launch

Search the project for `TODO` to find every item.

**Links (index.html)**
- [ ] `#TODO-founding-organiser-form`: application form
- [ ] `#TODO-waitlist-form`: waitlist form
- [ ] `#TODO-booking-link`: walkthrough booking
- [ ] `#TODO-kyle-linkedin`, `#TODO-will-linkedin`, `#TODO-finlay-linkedin`, `#TODO-andrew-linkedin`

**Images (put files in `images/`)**
- [ ] Official logo: replace the `logo-mark` symbol at the top of `index.html`
- [ ] Original Eli artwork: replace the `eli-body` symbol (the waving arm and megaphone are drawn next to each use)
- [ ] Team photos: replace each `placeholder` div in the team section with `<img class="member__photo" src="images/NAME.jpg" alt="NAME">`
- [ ] Kyle's headshot: replace the placeholder in the founder section with `<img class="founder__photo" ...>`
- [ ] Favicon and a 1200x630 `og:image` (see the head of `index.html`)

**Content**
- [ ] Example data is labelled "Example" on the page (hero event card, dashboard, WhatsApp chat). Swap for real data or keep the labels.
- [ ] Privacy policy and terms links in the footer.
- [ ] Recheck competitor rates in `js/pricing.js` (last checked October 2026) and update `checkedOn` and the small print under the calculator.
- [ ] Decide whether Eventli Plus shows before Phase 2. To hide it: remove the `plan--plus` card, the `data-plan="plus"` button and the "What is Eventli Plus?" FAQ.

## Changing prices

Edit the numbers in `js/pricing.js` only. If you change Eventli's own prices, also update the matching text in `index.html` (pricing cards, plan buttons, FAQ, founding section), then run `node tools/pricing-check.js`. Update the expected figures in that file first if the deck figures change.

## Calculator rules

All-in cost per paid ticket. Assumes the organiser absorbs fees, one ticket per order, UK cards.

| Platform | Per ticket |
| --- | --- |
| Eventli standard | 3% + 10p, + Stripe 1.5% + 20p |
| Eventli founding | Stripe only (0% Eventli fee for 6 months) |
| Eventli Plus | Stripe only, + £29 per month |
| Eventbrite | 6.95% + 59p (processing included) |
| Luma free plan | 5% + Stripe |
| Luma Plus | Stripe + about £47 per month (only shown when Plus is selected) |
| Ticket Tailor | 60p + 20% VAT, + Stripe |

The "Cheapest" badge is calculated, not hard-coded: Ticket Tailor wins above roughly £20.70 a ticket and Luma below £5.

## Accessibility

Visible keyboard focus everywhere, `aria-pressed` on the switch and plan buttons, live region on the calculator result, all motion off for `prefers-reduced-motion`, decorative SVGs hidden from screen readers. Checked at 1440px and 390px wide with no horizontal scroll.
