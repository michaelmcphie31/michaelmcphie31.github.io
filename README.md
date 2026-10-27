# Body of Works Fitness — GitHub upload folder

This is the complete static website with Refreshes 1–2, the current Refresh 3 service/payment setup, and the review-wall follow-up. No build or package installation is required.

## Upload

Copy everything INSIDE this folder into the repository root, keeping assets/, css/, integrations/, js/, the four HTML pages, and CNAME. Use a review branch first. Updating the GitHub Pages publishing branch can make changes live and still requires owner approval. The agent has not pushed or deployed.

## Review changes

Irma Aragon's full five-star Massage review is featured first. Maya R., Jordan T., and Danielle M. have been removed. Other featured reviews remain.

The previous FormSubmit review emails and visitor-local wall are removed. The new form is designed for shared automatic publication with no email verification or owner approval queue. It supports 1–5 stars and up to 2,000 characters and confirms a saved record before showing success.

IMPORTANT: Shared posting is not yet active. js/review-config.js deliberately has a blank endpoint; the form stays disabled with a truthful connection-pending message. Uploading this folder will update the featured reviews, but cannot activate a shared backend by itself. Follow integrations/review-wall-setup.md after owner approval to authorize a separate Google Sheet review store, deploy its Apps Script endpoint, connect the URL, and perform signed-out checks. Keep the Sheet restricted. No email, calendar, intake, payment credentials or card fields belong in review configuration.

## Services and booking

In-Person Training: 30/$30, 60/$60, 90/$90 or 120 minutes/$120, with 30 minutes after. Chair Massage: 15/$30 or 30/$60, with 15 minutes after. Events are separately quoted by head count. All fifteen approved choices retain their Acuity links and prices.

Stripe was personally connected by the owner. Fourteen paid types are configured for a saved card, with $0 session payment due at booking; the free call is exempt. Acuity's Reserve without paying opens secure card entry before final confirmation. Mandatory fields/amounts were checked, but actual real-card saving, charges, refunds and receipts remain unverified and deferred by owner. No automatic cancellation-fee charge is configured.

Use Acuity for urgent blocks/appointment edits because Google synchronization can lag. Keep website catalog/prices and native types synchronized. Reminder testing remains deferred until after the trial, which showed November 3, 2026 expiry. No subscription purchase, card charge or refund was performed. The supplied medical intake form is excluded and its implementation remains a later refresh.

## Files and checkpoint

index.html is the homepage; about.html, resources.html and thank-you.html preserve the existing page structure. js/booking-model.js controls the approved menu; js/main.js handles booking/navigation; js/reviews.js handles reviews. Keep all referenced JS and CSS files.

Source checkpoint: f6fe09ba5413c17ba5248c8ef7415725f751a53c, branch codex/refresh-3-review-wall, tag checkpoint-refresh-3-review-wall-package-2026-10-27. This upload README is customized. Runtime files match that source checkpoint. Reports, screenshots, test helpers/data, intake documents and Git recovery backups are kept separately.
