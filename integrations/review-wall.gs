/* Body of Works Fitness shared reviews. Install in a NEW Apps Script project.
 * No Gmail inbox, payment, calendar, or intake access. Optional owner notices are
 * separate in review-notifications.gs and require owner authorization/enabling.
 * Public reads return only published review fields. POST publishes immediately.
 */
const BOW_REVIEW_HEADERS = ["id", "createdAt", "rating", "nameJson", "service", "textJson", "visitorHash", "status"];
const BOW_REVIEW_SERVICES = ["1:1 Coaching", "In-Person Training", "Pretzeling", "Massage", "Chair Massage", "General experience"];
const BOW_REVIEW_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Run once from the editor as the owner. Idempotent; never recreates existing data.
function setupReviewWall_() {
  const properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty("REVIEWS_HASH_SALT")) properties.setProperty("REVIEWS_HASH_SALT", Utilities.getUuid());
  if (properties.getProperty("REVIEWS_SPREADSHEET_ID")) return "Already configured. Existing reviews preserved.";
  const spreadsheet = SpreadsheetApp.create("Body of Works Fitness — Website Reviews");
  const sheet = spreadsheet.getSheets()[0];
  sheet.setName("Reviews");
  sheet.getRange(1, 1, 1, BOW_REVIEW_HEADERS.length).setValues([BOW_REVIEW_HEADERS]);
  sheet.setFrozenRows(1);
  properties.setProperty("REVIEWS_SPREADSHEET_ID", spreadsheet.getId());
  return "Private review sheet created: " + spreadsheet.getUrl();
}

function reviewSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty("REVIEWS_SPREADSHEET_ID");
  if (!id) throw new Error("Review store has not been configured.");
  const sheet = SpreadsheetApp.openById(id).getSheetByName("Reviews");
  if (!sheet) throw new Error("Review sheet is missing.");
  return sheet;
}

function reviewRows_() {
  const sheet = reviewSheet_();
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, BOW_REVIEW_HEADERS.length).getValues();
}

function publicReview_(row) {
  if (row[7] !== "published") return null;
  try {
    const rating = Number(row[2]);
    const name = JSON.parse(row[3]);
    const text = JSON.parse(row[5]);
    if (!BOW_REVIEW_UUID.test(String(row[0])) || !Number.isInteger(rating) || rating < 1 || rating > 5 ||
        typeof name !== "string" || typeof text !== "string" || !BOW_REVIEW_SERVICES.includes(row[4])) return null;
    return { id: String(row[0]), createdAt: new Date(row[1]).toISOString(), rating: rating,
      name: name, service: String(row[4]), text: text };
  } catch (error) { return null; }
}

function reviewFailure_(code, message) { return { ok: false, code: code, message: message }; }

function validateReview_(input) {
  if (!input || !BOW_REVIEW_UUID.test(String(input.id || "")) || !BOW_REVIEW_UUID.test(String(input.visitorId || ""))) {
    return reviewFailure_("INVALID_ID", "Please reload the page and try again.");
  }
  if (String(input.website || "").trim()) return reviewFailure_("SPAM", "This review could not be accepted.");
  if (input.consent !== "true") return reviewFailure_("CONSENT", "Please agree to publish your name and review.");
  const name = String(input.name || "").trim();
  const text = String(input.review || "").trim();
  const service = String(input.service || "");
  const rating = Number(input.rating);
  if (!name || name.length > 50) return reviewFailure_("NAME", "Enter a name of 1–50 characters.");
  if (!text || text.length > 2000) return reviewFailure_("TEXT", "Enter a review of 1–2,000 characters.");
  if (!/^[1-5]$/.test(String(input.rating)) || !Number.isInteger(rating)) return reviewFailure_("RATING", "Choose a rating from 1 to 5.");
  if (!BOW_REVIEW_SERVICES.includes(service)) return reviewFailure_("SERVICE", "Choose one of the listed services.");
  // Plain text only; do not remove low ratings or require an approval email.
  return { ok: true, value: { id: input.id.toLowerCase(), visitorId: input.visitorId.toLowerCase(),
    name: name, text: text, service: service, rating: rating } };
}

function sameReview_(existing, input) {
  return existing && existing.rating === input.rating && existing.name === input.name &&
    existing.service === input.service && existing.text === input.text;
}

function saveReview_(input) {
  const validated = validateReview_(input);
  if (!validated.ok) return validated;
  const review = validated.value;
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return reviewFailure_("BUSY", "The review wall is busy. Please try again in a moment.");
  try {
    const rows = reviewRows_();
    const previous = rows.find(function (row) { return String(row[0]) === review.id; });
    if (previous) {
      const published = publicReview_(previous);
      return sameReview_(published, review) ? { ok: true, review: published } :
        reviewFailure_("ID_CONFLICT", "This submission cannot be changed. Start a new review.");
    }
    const now = new Date();
    const salt = PropertiesService.getScriptProperties().getProperty("REVIEWS_HASH_SALT");
    if (!salt) throw new Error("Review store has not been configured.");
    const visitorHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + review.visitorId)
      .map(function (byte) { return (byte & 255).toString(16).padStart(2, "0"); }).join("");
    const recent = rows.filter(function (row) { return now.getTime() - new Date(row[1]).getTime() < 3600000; });
    const ownRecent = recent.filter(function (row) { return row[6] === visitorHash; });
    // Basic abuse controls, not proof of a unique person. No visitor IP is supplied by Apps Script.
    if (ownRecent.length >= 3 || ownRecent.some(function (row) { return now.getTime() - new Date(row[1]).getTime() < 300000; })) {
      return reviewFailure_("RATE_LIMIT", "Please wait before posting another review.");
    }
    if (recent.length >= 30) return reviewFailure_("RATE_LIMIT", "The review wall has received many submissions. Please try again later.");
    const sheet = reviewSheet_();
    // JSON-encode free text: even a name starting '=' is stored as text, never as a Sheet formula.
    const row = [review.id, now.toISOString(), review.rating, JSON.stringify(review.name), review.service,
      JSON.stringify(review.text), visitorHash, "published"];
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
    SpreadsheetApp.flush();
    // Confirm persistence from the Sheet instead of echoing an optimistic submission.
    const saved = reviewRows_().find(function (item) { return item[0] === review.id; });
    const published = saved && publicReview_(saved);
    if (!sameReview_(published, review)) throw new Error("Review readback failed.");
    CacheService.getScriptCache().remove("review-error-" + review.id);
    // A notice must never turn a persisted review into a failed/approval-pending submission.
    try { if (typeof queueReviewNotification_ === "function") queueReviewNotification_(published); }
    catch (notificationError) { console.warn("Review published; owner notice could not be queued."); }
    return { ok: true, review: published };
  } finally { lock.releaseLock(); }
}

function doPost(event) {
  let input = {};
  let result;
  try {
    if (event && event.postData && Number(event.postData.length) > 65536) {
      result = reviewFailure_("TOO_LONG", "This review is too long.");
    } else {
      input = (event && event.parameter) || {};
      result = saveReview_(input);
    }
  } catch (error) {
    // Do not return spreadsheet IDs, raw input, owner account details, or stack traces.
    result = reviewFailure_("UNAVAILABLE", "The review wall is temporarily unavailable. Your text is still here; please try again.");
  }
  if (!result.ok && BOW_REVIEW_UUID.test(String(input.id || ""))) {
    CacheService.getScriptCache().put("review-error-" + input.id.toLowerCase(), JSON.stringify(result), 120);
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(event) {
  const parameters = (event && event.parameter) || {};
  const callback = String(parameters.callback || "");
  // No dotted paths, parentheses, brackets, or arbitrary JavaScript in JSONP callback names.
  if (callback && !/^bowReviews_[A-Za-z0-9_]{1,80}$/.test(callback)) {
    return ContentService.createTextOutput('{"ok":false,"code":"CALLBACK"}').setMimeType(ContentService.MimeType.JSON);
  }
  let result;
  try {
    if (parameters.action === "find" && BOW_REVIEW_UUID.test(String(parameters.id || ""))) {
      const id = String(parameters.id).toLowerCase();
      const row = reviewRows_().find(function (item) { return String(item[0]) === id; });
      const review = row && publicReview_(row);
      const failure = CacheService.getScriptCache().get("review-error-" + id);
      result = review ? { ok: true, review: review } : failure ? JSON.parse(failure) : { ok: true, review: null };
    } else if (parameters.action === "list" || !parameters.action) {
      let reviews = reviewRows_().map(publicReview_).filter(Boolean).sort(function (a, b) {
        return (b.createdAt + ":" + b.id).localeCompare(a.createdAt + ":" + a.id);
      });
      const cursor = String(parameters.cursor || "");
      if (cursor) reviews = reviews.filter(function (review) { return review.createdAt + ":" + review.id < cursor; });
      const page = reviews.slice(0, 20);
      result = { ok: true, reviews: page, nextCursor: reviews.length > 20 ?
        page[page.length - 1].createdAt + ":" + page[page.length - 1].id : null };
    } else result = reviewFailure_("ACTION", "Unknown review request.");
  } catch (error) { result = reviewFailure_("UNAVAILABLE", "Shared reviews are temporarily unavailable. Please try again."); }
  const json = JSON.stringify(result).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  return ContentService.createTextOutput(callback ? callback + "(" + json + ");" : json)
    .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}
