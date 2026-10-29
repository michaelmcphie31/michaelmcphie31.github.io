/* Optional twice-daily owner digests, never an approval queue.
 * Owner authorizes send_mail. Configure the two daily triggers in Google's UI,
 * at 8 AM and 8 PM America/Chicago. No ScriptApp API permission is requested.
 * Visitor input can never select the recipient or cadence.
 */
const BOW_REVIEW_OWNER_EMAIL = "imagin8it.home@gmail.com";

// Owner-only editor setup. Preserves reviews and never emails legacy rows.
function enableReviewNotifications() {
  MailApp.getRemainingDailyQuota(); // Verify the send-mail authorization without sending.
  reviewSheet_().getRange(1, 9, 1, 1).setValues([["notificationStatus"]]);
  PropertiesService.getScriptProperties().setProperty("REVIEW_NOTIFICATIONS_ENABLED", "true");
  console.log("Owner review digests enabled. Configure exactly two daily triggers for processReviewNotifications: 8 AM and 8 PM Central. No email is sent on each individual review.");
}

function queueReviewNotification_(review) {
  if (PropertiesService.getScriptProperties().getProperty("REVIEW_NOTIFICATIONS_ENABLED") !== "true") return;
  const rows = reviewRows_();
  const index = rows.findIndex(function (row) { return row[0] === review.id; });
  if (index >= 0) reviewSheet_().getRange(index + 2, 9, 1, 1).setValues([["queued"]]);
}

// Two UI-created time triggers call this function. At most one digest per run;
// no new reviews means no email. All errors are caught/logged, not emailed.
function processReviewNotifications() {
  let lock;
  let acquired = false;
  let pending = [];
  try {
    if (PropertiesService.getScriptProperties().getProperty("REVIEW_NOTIFICATIONS_ENABLED") !== "true") return;
    lock = LockService.getScriptLock();
    acquired = lock.tryLock(10000);
    if (!acquired) return;
    const sheet = reviewSheet_();
    if (sheet.getLastRow() < 2) return;
    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).getValues();
    rows.forEach(function (row, index) {
      if (!["queued", "failed"].includes(row[8])) return;
      const cell = sheet.getRange(index + 2, 9, 1, 1);
      const review = publicReview_(row);
      if (review) pending.push({ review: review, cell: cell });
      else cell.setValues([["skipped"]]);
    });
    if (!pending.length || MailApp.getRemainingDailyQuota() < 1) return;
    const count = pending.length;
    const shown = pending.slice(-20).reverse();
    const summaries = shown.map(function (item) {
      const review = item.review;
      const excerpt = review.text.length > 280 ? review.text.slice(0, 280) + "…" : review.text;
      return "Public name: " + review.name + "\nRating: " + review.rating + " out of 5\nService: " + review.service +
        "\nReview excerpt: " + excerpt + "\nReview ID: " + review.id;
    }).join("\n\n---\n\n");
    const extra = count > shown.length ? "\n\nPlus " + (count - shown.length) + " more new reviews. View the wall to read every review." : "";
    pending.forEach(function (item) { item.cell.setValues([["sending"]]); });
    MailApp.sendEmail({
      to: BOW_REVIEW_OWNER_EMAIL,
      name: "Body of Works Fitness Website",
      subject: count + " new website review" + (count === 1 ? "" : "s") + " — Body of Works Fitness",
      body: count + " new review" + (count === 1 ? " has" : "s have") + " already been published on your website. No approval is needed.\n\n" +
        summaries + extra + "\n\nRead the full reviews: https://bodyofworksfitness.com/#testimonials\n\n" +
        "This is your informational review digest, scheduled for 8 AM and 8 PM Central. No new reviews means no email."
    });
    pending.forEach(function (item) { item.cell.setValues([["sent"]]); });
  } catch (error) {
    pending.forEach(function (item) { try { item.cell.setValues([["failed"]]); } catch (ignored) {} });
    console.warn("A review digest could not be confirmed. Reviews remain public; queued/failed notices can retry at the next twice-daily run.");
  } finally {
    if (acquired) { try { lock.releaseLock(); } catch (ignored) {} }
  }
}
