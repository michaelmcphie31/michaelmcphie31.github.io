# Shared review wall — activation and maintenance

Status: implemented locally, **not deployed or connected**. The website contains Irma Aragon's supplied review and removes the three testimonials identified by the owner. Public submissions stay disabled until a real endpoint is configured. Copying website files to GitHub alone does not create the review store.

## One-time connection, after owner approval

1. In the business's Google account, create a **new, separate** Apps Script project named `Body of Works Fitness — Website Reviews`. Do not replace the historical intake forwarder, modify Acuity, or put review data in an intake/health spreadsheet.
2. Replace the starter `Code.gs` with the contents of `review-wall.gs` from this folder. Enable **Show appsscript.json manifest file** in Project Settings. Copy `review-wall-appsscript.json` into that manifest, named exactly `appsscript.json` in the editor.
3. Run `setupReviewWall_` in the editor. The owner must personally review/authorize Google's requested spreadsheet permission. The scope allows spreadsheet access; this script uses only its dedicated review Sheet. It requests no Gmail, calendar, contacts, card, or payment permissions. Stop and review any unexpected permissions or Google security warning; do not bypass a browser warning.
4. Setup creates one review spreadsheet and stores its ID and a random hashing salt in Script Properties. Rerunning setup preserves existing rows. Open the created Sheet from the execution result/Google Drive and verify **General access: Restricted**. Do not publish/share the Sheet with the public.
5. After deployment approval, use **Deploy → New deployment → Web app**. Execute as the business owner and allow **Anyone**, including visitors without a Google sign-in. This makes only the review API public; it does not expose the Sheet, OAuth token, or Script Properties. If the account does not allow anonymous apps, stop and select another backend rather than requiring clients to sign in unexpectedly.
6. Copy the returned `https://script.google.com/macros/s/.../exec` web-app URL into `js/review-config.js` as `endpoint`. The URL is public, not a credential. Never copy a Sheet ID, access token, password, `/dev` URL, or editor URL into website code. A blank/invalid endpoint keeps posting disabled with an honest connection-pending message.
7. From a local preview with the real endpoint, test one clearly labeled synthetic review in a signed-out browser. Verify it appears in a **second browser/profile**, its low-rating variant is accepted, and a retry of the same submission does not duplicate it. Check errors and a full-length review. These real Google/browser tests are still pending; the completed tests used a local Sheet adapter.
8. Hide synthetic rows in the Sheet by setting `status` to `hidden`. Verify disappearance on Refresh Reviews. No test email should be sent; the review implementation has no email transport.
9. Save a new development checkpoint, then obtain approval before updating the GitHub Pages publishing branch. Upload the normal website folder contents, preserving its structure. After deployment, verify the actual production origin can read/post and a second signed-out browser sees the result. Website publishing is separate from backend deployment.

## What happens when a visitor posts

- Name, rating (1–5), service and review text are public. Email and phone are not requested. The visitor explicitly agrees to publish their public name and review.
- A valid review is written immediately with `status = published`; there is **no email, owner verification, or approval queue**. One-star reviews use the same process as five-star reviews. These are self-submitted reviews, not claims of verified appointments.
- The browser sends a form-encoded POST, then reads back that exact submission using a random ID. It reports success only after the saved name, rating, service and text match. An unreadable/opaque network response alone is never a success signal. An unknown outcome preserves the text and reuses the ID when the unchanged form is retried in that page.
- GET/JSONP is read-only and contains only public review data; review text is never put in a GET URL. Google redirects Content Service responses. New shared reviews refresh every minute while the page is visible. Loading older pages pauses automatic refresh until Refresh Reviews is clicked, to avoid disrupting reading.
- Irma and the retained featured reviews are in HTML, so they remain visible during an outage. Older visitor-local reviews are no longer displayed or migrated as if they were shared submissions.

## Owner maintenance

The Sheet columns are `id`, `createdAt`, `rating`, `nameJson`, `service`, `textJson`, `visitorHash`, `status`.

Set `status` to `hidden` to remove a shared submission from public reads; set it back to `published` to restore it. This reversible removal option is not a pre-publication queue. There is no public delete/edit endpoint. A static featured review is edited in `index.html`, not in this Sheet.

Free-text fields use JSON strings (including their outer quotes) so input beginning with `=` or other formula characters cannot execute as a spreadsheet formula. Preserve valid JSON if correcting these cells. The public API returns decoded text, rendered with DOM `textContent`, never raw HTML. `visitorHash` is an anonymous browser-token hash used for basic throttling; it is excluded from every public response.

Basic abuse controls include field limits, a honeypot, a script lock, duplicate-safe IDs, a five-minute interval/three-per-hour browser-token limit, and a global 30-per-hour submission limit. Browser tokens can be reset; these controls are not strong identity or IP verification. Because the endpoint is anonymous and publishes automatically, determined spam may require a later CAPTCHA or stronger backend. Google service quotas still apply. No fee, paid plan, trigger, or recurring job has been configured.

When updating backend code, use **Deploy → Manage deployments → Edit → New version** to retain the same `/exec` URL. Keep a copy of the current version and Sheet. Changing website code or rolling Git back does not undo Sheet rows or backend deployments.

## Local verification

Run `node --test tests/booking.test.cjs tests/reviews.test.cjs` from the development checkout. Tests use an explicitly simulated Apps Script/Sheet service and make no Google calls. Test helpers and preview data are excluded from the upload folder.

Official references: [Apps Script web apps](https://developers.google.com/apps-script/guides/web), [Content Service and JSONP](https://developers.google.com/apps-script/guides/content), [Lock Service](https://developers.google.com/apps-script/reference/lock/lock-service), [Google quotas](https://developers.google.com/apps-script/guides/services/quotas).
