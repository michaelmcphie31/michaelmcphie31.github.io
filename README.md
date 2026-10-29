# Body of Works Fitness Website

Static HTML, CSS, and vanilla JavaScript. No package installation or build is required.

## Refresh 4 published release

Refresh 4 was published with owner approval through pull request #2 on October 28, 2026: production merge `3354bf9f8f0c23537805ccca414cb3a9bf706b7e`. Its 13 changed runtime files and two preserved configuration/catalog files matched this source byte-for-byte after successful Pages deployment. Live desktop/mobile popup, Specials, bundle-store, booking handoff, review disclosure/read and fake-card removal checks passed. No additional review or financial test was submitted for publication. The complete source and recovery checkpoint remain on `codex/refresh-4-interface-promotions`. It adds the Specials popup/page and shared offer data, removes the fictional Marcus H. and Alex P. testimonials, and refines navigation, service/pricing cards, the booking summary, contact layout and motion/focus behavior. Standard prices, durations and Acuity appointment links remain intact. Other promotional redemptions are arranged with Mike.

The owner personally completed Acuity Standard Monthly and approved public package sales. Eight native three-session packs are public, each with 25% already included and 180-day validity. The native cart verified two Swedish 60-minute packs plus one Chair 15-minute pack: nine sessions, $405 total ($135 below standard). The cart was emptied without customer details or payment. All website pack buttons use the full Acuity store so quantities and different whole packs can be combined.

The owner authorized Google send-mail; review backend Version 2 is deployed at the existing endpoint. Two UI-created daily triggers run in the 8–9 AM and 8–9 PM Central windows. One digest is sent only when new reviews exist; publication never waits for email. One approved labeled review produced a delivered owner email, then was hidden with public disappearance verified. No hourly trigger, ScriptApp API permission or Gmail inbox access was added. See `integrations/promotions-maintenance.md` and `integrations/review-wall-setup.md`.

Baseline tag: `before-refresh-4-2026-10-28`; source `3c627dcc57eca470481c14941639f6fcbfe8ab5a`. Approved runtime checkpoint: `f865a02a050652979794d0617ee59fdddb92cf37`. Tag `published-refresh-4-2026-10-28` identifies the production merge; `before-refresh-4-production-2026-10-28` preserves its previous publishing commit. This documentation update does not change approved runtime bytes.

## Refresh 3 production background

This development branch contains the **Refresh 3 implementation and Acuity Starter setup**. The service/pricing pages and booking scripts were confirmed on the live site on October 28; the live review connection was published and verified on October 28 via pull request #1 (merge e2778af). Fifteen approved service/duration choices are private in Acuity and available by direct link. Refresh 3 adds In-Person Training, Chair Massage, individual photo cards, and expanded descriptions. Do not merge/push to the Pages publishing branch, purchase a subscription, publish the booking links, or activate payments without owner approval.

The owner approved **Stripe with a card on file and payment collected later**, personally connected Stripe, and authorized the native setup. The fourteen paid types require a saved card with full advance payment off; the free coaching call remains exempt. The payment/cancellation authorization form is required only for paid types. The static website never collects card details and contains no Stripe secret key or OAuth credentials.

An owner-approved controlled check verified the actual sequence: Acuity's **Reserve without paying** button advances to secure Stripe card entry; it does not confirm the appointment. Checkout explicitly requires a payment card and shows **$0 due now** and the full service fee due at service. The website explains this step and shows that same balance breakdown. No real card was entered or saved, and no final confirmation, charge, or refund was performed. Actual saved-card and later-payment verification remain expressly deferred by the owner; the approved Refresh 3 release is complete within that scope.

The customer chooses a service/duration on the website, then follows the matching Acuity link to choose a real available time and enter contact details. Acuity owns availability, reservations, date/time conversion, confirmations, cancellation, and rescheduling. The website no longer generates request slots, submits appointment requests through FormSubmit, or opens Google Calendar event templates.

One practitioner calendar serves all appointment types. Coaching has its own availability group on that same calendar. Google busy blocking is configured, but external synchronization can lag. Use Acuity for booking changes and urgent unavailable time; changing a synced Acuity booking in Google does not update Acuity. Cleanup padding and Acuity-only blocks do not export to Google.

## Pages and files

- `index.html`: homepage, services, prices, selected-session summary, and Acuity handoff.
- `about.html`: coach story and booking CTA.
- `resources.html`: downloadable guides and research links.
- `thank-you.html`: preserved legacy request acknowledgment URL.
- `js/booking-model.js`: approved catalog and public Acuity appointment-type links. These public IDs are not credentials.
- `js/main.js`: navigation, service selection, and booking handoff.
- `js/reviews.js`: shared review wall and confirmed submission flow.
- `js/review-config.js`: the connected public review-only endpoint, containing no credentials.
- `promotions.html`, `js/promotions-data.js`, `js/promotions.js`: shared Specials page and dismissible dialog.
- `js/massage-bundles.js`, `js/bundles.js`: approved pack prices, native product IDs and full-store links.
- `css/styles.css`: responsive styling.
- `tests/booking.test.cjs`: dependency-free catalog, selection, routing, fallback, and handoff regression checks.
- `integrations/massage-intake-forwarder.gs`: historical request-email automation template. This pilot does not install or use it.

## Approved offerings and scheduling

Free coaching call: 30 minutes. In-Person Training: 30/$30, 60/$60, 90/$90, or 120/$120 ($1/min). Pretzeling: 15 minutes/$30 or 30 minutes/$60. Swedish: 60/$75 or 90/$115. Therapeutic: 60/$90 or 90/$135. Sports: 60/$100 or 90/$150. Chair Massage: 15/$30 or 30/$60 ($2/min). Chair-massage events are quoted separately based on head count; individual-session prices do not determine an event total.

Coaching hours: Mon–Fri 7 AM–7 PM and Sat 1–5 PM. No Sunday coaching.

In-person hours retained: Mon–Fri 3–6 PM, Sat 8 AM–noon, Sun 1–5 PM. All hours America/Chicago. Minimum booking notice: 48 hours. Training reserves **30 minutes after** the advertised session; massage, Chair Massage, and Pretzeling reserve **15 minutes after**. Acuity requires this padding to fit within availability. For a 3–6 PM window, a 120-minute training session's final start is 3:30 PM, followed by cleanup until 6 PM. Training uses the existing in-person address and hours; no new location or hours were introduced.

Owner-approved rules: 60-day booking horizon (Acuity's day-based implementation of two months), 24-hour cancellation notice, a late-cancellation fee of 25% of the scheduled session price, and an 8-hour rescheduling cutoff. Acuity uses one shared online-change cutoff, set to 8 hours. Cancellations between 8 and 24 hours remain subject to the fee; later cancellations use the confirmation email's verified reply-to address. Automatic fee collection is not configured. Hands-on location: 9209 Winfield Lane, Moore, OK 73160; coaching does not inherit that physical location.

A private-pilot workaround requires a phone number. Clearing an optional phone field caused a vendor UI null.length error during the first test. Native required-phone validation produced a clear error and the subsequent valid competing submissions passed. The owner explicitly deferred reminder verification to a later refresh after the trial ends; it is outside this wave's acceptance scope. The original default 24-hour reminder was observed in Refresh 2, but due-time delivery and new-type reminder behavior have not been verified. The earlier Starter trial blocked reminder customization; Standard is now active. Reminder checks remain deferred until a later owner-approved refresh.

## Routine updates

Edit the approved catalog, public policy, and appointment-type mappings in `js/booking-model.js`. Update the matching Acuity appointment types as well; the static site does not automatically fetch provider prices. Keep HTML price fallbacks, service-card price summaries, and the fifteen no-JavaScript booking links consistent. Read back native prices after saving; Acuity's masked currency input requires a full replacement and blur before saving.

Hours, lead time, padding, busy-calendar selection, and notifications belong in Acuity. Keep the website's descriptive hours synchronized when these settings change.

Service links use `data-book-service` and an optional `data-book-option`, such as `therapeutic-90`. Cross-page links can use `?service=Massage&option=therapeutic-90#book-call`. Only approved catalog IDs can generate a handoff. No selected date, personal details, health information, API keys, or OAuth credentials are sent in these links.

The coaching application remains at `https://form.typeform.com/to/nYSQBHoF` and appears only in the coaching route.

## Verification and preview

Run `node --test tests/booking.test.cjs`. These tests do not send email, create appointments, or change calendars. Real provider behavior and delivery require separately recorded controlled tests.

Serve this folder locally, for example `python3 -m http.server 4173 --bind 127.0.0.1`. Stop the preview server when review ends.

## Intake and payments

The owner's supplied intake PDF is under assessment outside the public source tree. No health-history form or PDF has been uploaded to Acuity or published. Full digital intake/consent can follow booking reliability in a subsequent refresh. Do not install the old Gmail forwarder as a substitute for an approved intake workflow.

Refresh 3 payment configuration is complete within the owner’s testing deferrals. Sole Stripe connection, paid-type card rules, the required authorization, and the secure card-entry step are configured and verified at their respective levels. No session payment/deposit is collected at booking. Later session and approved 25% cancellation-fee charges are owner actions; no automatic fee is configured. Actual card saving, charge/receipt behavior, and refund reconciliation require separately authorized tests and remain unverified. The earlier trial showed November 3, 2026 expiry. The owner subsequently completed Standard Monthly for Refresh 4; the assistant did not submit its purchase.

## Existing review and media features

Irma Aragon's supplied five-star Massage review is featured first. Maya R., Jordan T., and Danielle M. were removed at the owner's direction. Marcus H. and Alex P. are also removed in Refresh 4 at the owner’s direction. The other real featured reviews are retained; no new client quotation was invented.

The former FormSubmit email and visitor-local review display have been removed. The owner authorized Google access, and the no-extra-cost Apps Script backend is deployed as the owner with anonymous visitor access. Its dedicated Google Sheet is restricted to the business owner. There is no email verification queue or rating-based approval. Refresh 4 adds informational twice-daily owner digests after publication. The browser confirms each submission by reading back the persisted record before reporting success. `js/review-config.js` now contains the public `/exec` endpoint; it contains no Sheet ID, password or credential. The temporary native Bootstrap initializer is disabled as comments only. The local template is retained for a future fresh installation. See `integrations/review-wall-setup.md` for maintenance and setup details.

Run `node --test tests/booking.test.cjs tests/reviews.test.cjs tests/review-incentive.test.cjs tests/review-notifications.test.cjs tests/bundles.test.cjs` for the 34 booking and local review checks. Separate real Google checks passed for cross-origin browser posting/readback, visibility from another browser origin, cookie-free GET/POST, duplicate-safe retries, one-star publication, literal HTML/Unicode/formula-like text, and rejected-draft retention. Both synthetic rows were reversibly hidden, with disappearance verified through the API and website preview. Those Refresh 3 checks added no email transport or paid billing setup; Refresh 4’s authorized additions are recorded above. The owner approved publication and one labeled review test. The five-file release was merged in PR #1 and is live. All nine checked runtime files match the prepared source byte-for-byte. The real business-domain form published the single test; a separate cookie-free client read it, and its status was then set to hidden and disappearance verified through the API and live wall. Full private-browser-session and live-pagination checks remain unexercised; local pagination tests pass. The current review-wall release is complete.

The hero uses `assets/images/brand-hero.webp` unless the optional `assets/videos/workout-background.mp4` is supplied. Local images/guides and social links remain in their existing locations.

## Rollback

The pre-Refresh 3 checkpoint is `1d0935395091168adbf5317932e0ee31bf3d4783`. Approved Refresh 1 is tag `approved-refresh-1-2026-10-26`, commit `53fb08c872565aa4b20696f685b9e4226f5426da`. Recover an earlier revision on a separate branch and review before publishing. Acuity descriptions, private types, Stripe connection, payment rules, and authorization forms are external state. A Git rollback does not revert them; review corresponding native settings separately before changing them.
