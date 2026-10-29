# Shared review wall — setup and maintenance

Status, October 28, 2026: **the review backend is deployed and its public endpoint is configured in the prepared website files.** Owner authorization, owner-only spreadsheet sharing, live submission/readback, anonymous API access and test cleanup were verified. The website is published and production-origin verification passed. No new subscription, purchase or billing account was configured. Google storage/service quotas still apply.

**The owner does not need to rerun Bootstrap.gs or create another review store.** The native initializer was disabled by replacing its contents with comments. The project retains Code.gs, ReviewNotifications.gs, appsscript.json and an inert Bootstrap.gs with no runnable functions. The local review-wall-bootstrap.gs file remains a reference template for a new installation.

## Current live release and future updates

The owner approved the five-file website release. It was merged in pull request #1 on October 28, 2026 and served from the production domain. Nine runtime files were verified byte-for-byte. The business-domain form published one clearly labeled synthetic review, a separate anonymous client read it, and that test was then reversibly hidden. The live wall and public API no longer return it. No current upload or Bootstrap rerun is needed.

For future changes, keep the familiar folder structure, save a checkpoint, test the affected flow and obtain approval before another live release. Keep js/review-config.js connected to the public `/exec` URL. Preserve the underlying Sheet's restricted sharing. Do not place Sheet IDs, editor URLs, passwords or OAuth tokens in website code.

## Recreate a new installation only if necessary

The following sequence is a reference, not work that must be repeated for the current account.

1. Create a separate Apps Script project under the business owner’s Google account. Do not replace the historical intake forwarder, modify Acuity, or store review data in an intake/health spreadsheet.
2. Paste review-wall.gs into Code.gs. Enable manifest visibility and copy review-wall-appsscript.json into the editor’s appsscript.json. Save and read back both files.
3. Add a temporary Bootstrap.gs using review-wall-bootstrap.gs. Open that file, select initializeReviewStore and Run. The owner personally reviews and authorizes the expected spreadsheet access. The explicit scope permits broad Sheet access; this code uses the dedicated review Sheet. No Gmail, Calendar, Stripe, card or payment scope is requested.
4. Verify the created Sheet has a Reviews tab and Restricted, owner-only sharing. Setup stores the Sheet connection and a random hashing salt in Script Properties. Rerunning setup preserves existing rows, but routine operation does not require it.
5. Disable Bootstrap.gs by replacing its code with comments and saving. Verify it contains no runnable functions before deployment. Keeping the inert file avoids unnecessary file deletion.
6. After backend deployment approval, choose Deploy → New deployment → Web app. Execute as the owner and permit Anyone, including anonymous visitors. Keep the underlying spreadsheet private. If anonymous access is unavailable, stop rather than unexpectedly requiring customers to sign into Google.
7. Copy the public `https://script.google.com/macros/s/.../exec` URL into js/review-config.js. A blank or invalid endpoint disables posting honestly. Do not use an editor or `/dev` URL.
8. Test actual browser submission, persisted readback, a separate client, cookie-free access, a low rating, duplicate-safe retry and error handling. Hide synthetic rows and verify public reads no longer return them. Save a checkpoint before the separate website release.

Google can show “Google hasn’t verified this app” for a new Gmail-owned script, including to its owner. That is an OAuth consent warning, not a paid-upgrade request. The owner must inspect the project identity and requested access before deciding whether to authorize it. A private Chrome window signed into only the business account and opening the specific blocked authorization popup can help with a stalled consent flow. Stop for unexpected permissions, payment requests, SSL/certificate warnings or an app-blocked policy message. Do not weaken browser/account protections. [Client verification](https://developers.google.com/apps-script/guides/client-verification), [account troubleshooting](https://developers.google.com/apps-script/guides/support/troubleshooting).

## What happens when a visitor posts

- Name, rating (1–5), service and review text are public. Email and phone are not requested. The visitor agrees to publish the name and review.
- Accepted reviews are saved immediately with status published. There is no email verification or owner approval queue; low ratings use the same process. Informational owner digests happen after publication. These are self-submitted reviews, not claims of verified appointments.
- The browser sends a form-encoded POST, then reads back the exact persisted submission before showing success. An opaque network response alone is not proof of success. Unknown outcomes preserve the text and reuse the ID when the unchanged form is retried on that page.
- GET/JSONP is read-only and returns public review fields. Review text is not placed in a GET URL. New reviews refresh every minute while the page is visible. Loading older pages pauses automatic refresh until Refresh Reviews is clicked.
- Featured reviews, including Irma’s supplied review, remain in HTML during an outage. Old visitor-local submissions are not imported as shared reviews.

## Owner maintenance

The Sheet columns are id, createdAt, rating, nameJson, service, textJson, visitorHash, status and notificationStatus. The last two and visitorHash are excluded from public responses.

Set status to hidden to remove a shared submission from public reads; set it back to published to restore it. Refresh the website to see the change. There is no public delete/edit endpoint. A static featured review is edited in index.html rather than in the Sheet.

Free text is stored as JSON strings, including outer quotes, so input beginning with formula characters cannot execute as a spreadsheet formula. Preserve valid JSON when correcting a cell. Public text is rendered with DOM textContent, never raw HTML. visitorHash is an anonymous browser-token hash for basic throttling and is excluded from public responses.

Basic abuse controls include limits, a honeypot, a script lock, duplicate-safe IDs, a five-minute interval/three-per-hour browser-token limit and a global 30-per-hour submission limit. Tokens can be reset, so these are not identity or IP verification. Automatic publication may require stronger spam controls later. Google quotas apply; no automatic paid upgrade is configured. The twice-daily informational email workflow is described below.

For backend updates, save a checkpoint, edit the existing Code.gs and use Deploy → Manage deployments → Edit → New version to retain the same endpoint URL. Keep the initializer inert and preserve the Sheet. Git rollback does not reverse a Google deployment or Sheet data.

## Informational owner digests — active Version 2

1. The owner personally authorized the existing spreadsheet scope plus `script.send_mail`. No ScriptApp API or Gmail inbox scope is requested.
2. `enableReviewNotifications` added column I and enabled queuing; it does not send mail or create schedules. Do not rerun Bootstrap.
3. Exactly two Google UI time triggers call `processReviewNotifications`, deployment Head, Day timer, 8–9 AM and 8–9 PM in America/Chicago. Delivery occurs within those windows. Google failure notices are set to weekly.
4. Accepted submissions publish first and queue a private notification marker. The scheduled function sends one digest to `imagin8it.home@gmail.com` only if new queued/failed public reviews exist. Legacy rows are not emailed. Each email includes public names, ratings, services, bounded excerpts and the wall link.
5. Sent rows are not intentionally resent. Quota limits or caught mail failures retain notices for the next scheduled run without changing publication. A provider-accepted message followed by lost acknowledgment can produce a retry duplicate; Google service outages can delay operation.
6. The approved single synthetic review, **BOW QA Refresh 4 Notice**, was submitted through the production form. Its digest arrived at the verified owner inbox, column I read `sent`, and only that row’s status was changed to `hidden`. Anonymous lookup and the refreshed wall verified removal. No real review was changed.
7. For a future code update, save changes and edit the existing deployment to a new version; preserve the endpoint, private Sheet and inert initializer. The two triggers use Head, so review saved code before changing it.

To change cadence, open **Triggers** in the existing project, edit the two `processReviewNotifications` schedules and preserve the project’s America/Chicago timezone. Do not add hourly triggers. To stop notices, remove/disable those schedules or set `REVIEW_NOTIFICATIONS_ENABLED` to `false`; public reviews remain independent. Do not manually run the digest repeatedly to test delivery.

## Verification

The original live checks covered browser publication, anonymous/shared reads, one-star acceptance, literal text safety, duplicate-safe retries and reversible cleanup. Production-domain release and cleanup passed in Refresh 3. Refresh 4 verified delivered owner email and hiding cleanup for exactly one additional synthetic review. Four QA rows remain hidden; real public reviews are retained.

The 34 local booking/review/incentive/digest/bundle tests use a simulated adapter and make no Google or payment calls. Run `node --test tests/booking.test.cjs tests/reviews.test.cjs tests/review-incentive.test.cjs tests/review-notifications.test.cjs tests/bundles.test.cjs`. Full private-browser-session and live pagination checks remain unexercised. Natural 8 AM/8 PM timer delivery has not yet been observed; manual execution of the same digest function delivered the approved test email.

Official references: [Apps Script web apps](https://developers.google.com/apps-script/guides/web), [Content Service](https://developers.google.com/apps-script/guides/content), [Lock Service](https://developers.google.com/apps-script/reference/lock/lock-service), [quotas](https://developers.google.com/apps-script/guides/services/quotas).
