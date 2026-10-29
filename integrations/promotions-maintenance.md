# Promotions and the Refresh 4 interface

The website is static HTML/CSS/JavaScript. The first-time/bonus/referral/coaching marketing offers do not automatically change appointment prices, lengths, Stripe settings, or customer balances. The owner subsequently chose fixed three-session Acuity packages for bundle sales; these are now public after the owner completed Standard and approved catalog activation. Acuity tracks prepaid credits natively.

## Update an offer

1. Open `js/promotions-data.js` in a development branch. Each offer has a stable ID, category, headline/value, description, details, and an action.
2. Edit the text inside quotes. Keep commas, brackets, IDs, and link paths intact. The dialog and full Specials page read the same offer data.
3. Preserve the approved rules: one promotion per purchase/session; no stacking; 30-minute rewards are table massage only and arranged before booking; later massage referral tiers replace earlier unredeemed rewards; third and later qualifying referrals earn 50% off one next service. Coaching referrals qualify when the new client is under contract, regardless of payment.
4. No expiration, coaching base price, or new service/duration should be added without owner approval. The standard service catalog remains `js/booking-model.js`; keep it aligned with Acuity separately.
5. If a review incentive changes, also review `js/review-incentive.js` and the disclosures in the homepage/About review forms. Preserve disclosure text for already-saved reviews. New form text has a 1,800-character allowance; the stored record retains capacity for a clearly labeled business disclosure within the existing 2,000-character backend limit.
6. Preview and test before publishing. Use the owner-approved publishing process; uploading to the GitHub Pages branch can make a change live.

## Pop-up behavior

- Appears about one second after a new tab-session visit begins, unless the visitor already clicked/typed, is following a direct booking/review link, or is on Specials/Thank You.
- The X and Escape close it. Dismissal is remembered in session storage for this version of the offers. The homepage band and navigation can reopen it; the permanent `promotions.html` page remains available.
- Keyboard Tab stays inside the dialog. Left/Right/Home/End switch category tabs. Focus returns to the opener on close. The close button stays visible while the dialog scrolls.
- No subscription purchase, tracker, email approval queue, or extra dependency was introduced. Informational owner digests are active at 8 AM and 8 PM Central, only when new reviews exist. Storage-blocked browsers still have a working close button and full Specials page; cross-page dismissal cannot persist when session storage is unavailable.

## Arranging a redemption

Website/Acuity display standard rates. Mike confirms eligibility and pricing before the client books or purchases. For additional minutes, arrange the full session length and appropriate buffer in Acuity; do not ask a client to book a 90-minute slot for a 120-minute treatment. The public menu has no 120-minute massage type. The offer does not silently create one. The eight public three-session massage packages are mapped in `js/massage-bundles.js`. Each contains three of exactly one approved appointment type at 25% below the standard total and is valid for 180 days after purchase. Verified native product IDs are recorded in the model. All purchase buttons use the full Acuity store rather than per-product links that can filter/reset a shopping session. The owner approved public catalog sales. Native quantities and mixed pack totals passed cart-only verification; no paid order or credit issuance/redemption was tested. Acuity provides receipts and redemption codes after an actual purchase. Mixed individual sessions use the separate request-and-personalized-link workflow below. The discount is already included in each package price; never apply an extra 25% coupon. Coaching package purchases are still arranged directly with Mike.

The real-card/charge/refund tests remain owner-deferred, as do reminder checks until after the trial. Intake implementation remains later content work. Nothing here authorizes financial transactions or provider changes.

## Development checks

Run `node --test tests/booking.test.cjs tests/reviews.test.cjs tests/review-incentive.test.cjs tests/review-notifications.test.cjs tests/bundles.test.cjs` from the source checkout (tests are deliberately excluded from the upload folder). Inspect all five pages on phone and desktop, the X/Escape and tab keys, standard price/booking links, and a local-only review submission. Never test a public review or real booking without the appropriate owner authorization.

## Mixed three-pack requests

The website selector supports exactly three sessions, including repeated choices, from all table massage, chair massage and Pretzeling durations. It totals approved standard prices and applies one 25% saving. It opens the visitor’s own email draft; it does not send an email by itself, collect payment, issue a code or reserve time.

After receiving a request:
1. Check the three service/duration choices against the current catalog. Treat the email’s calculated price as a quote and independently verify the sum × 0.75.
2. In Acuity, create a NEW private package for that exact combination. Do not edit an existing purchased pack. Name it clearly and include each duration, standard total, saving and package price.
3. Use Total number of appointments. Set all other appointment counts to zero and allocate exactly the requested counts to the selected types; the counts must sum to THREE. A repeated choice gets the appropriate count of two or three. This is not three credits for every eligible type.
4. Enter the quoted package total, 180-day validity, no gift certificate/subscription and the one-promotion rule. Verify saved price/counts/expiry before sending the private checkout link.
5. Send the link to the requesting client yourself. After payment, Acuity issues the package code. The client uses that code when booking each selected appointment. Location details remain in the private confirmation for qualifying treatments.
6. Check paid order and remaining credits in Acuity when administering a real sale. Paid purchase/redemption testing remains deferred; do not claim it passed from a cart preview.

Standard lacks API access for automatic custom credit creation. A future automatic system needs a separately reviewed upgrade/backend and payment-success verification. No secrets belong in this static website.
