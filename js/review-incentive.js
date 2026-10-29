/* Keep the business's incentive disclosure in the saved public text, including API reads.
   No backend schema/permission change; do not label older reviews retroactively. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.BOWReviewIncentive = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const disclosure = "Business disclosure: This reviewer was offered 30 additional minutes of table massage for an honest website review, regardless of rating.";
  const suffix = "\n\n[" + disclosure + "]";
  return Object.freeze({
    maxTextLength: 1800,
    encode(text) { return String(text).trim() + suffix; },
    decode(text) {
      return text.endsWith(suffix) ? { text: text.slice(0, -suffix.length), disclosure } : { text, disclosure: "" };
    }
  });
});
