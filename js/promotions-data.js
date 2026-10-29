/* Edit offer copy here. Standard session prices stay in booking-model.js.
   These offers are arranged with Mike; this file does not alter Acuity charges or time. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.BOWPromotions = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  return Object.freeze({
    version: "refresh-4-20261028",
    redemption: "First-time rates, bonus minutes, referral rewards, and coaching offers are arranged with Mike before booking. Extra time must be reserved in advance. Three-session pack prices include the 25% bundle saving. Purchase packs in Acuity’s store, then use your package code to book appointments.",
    terms: "One promotion per purchase or session. Offers cannot be combined. Extra 30-minute rewards apply to table massage only. Confirm eligibility with Mike before booking or purchasing.",
    groups: [
      { id: "massage", label: "Massage offers", eyebrow: "More time to unwind", headline: "Recovery feels even better with a little extra.", offers: [
        { id: "first-massage", kicker: "Your first massage", value: "$1", unit: "per minute", title: "A welcome worth slowing down for.", description: "First-time clients can enjoy any offered massage at $1 per minute, including chair massage.", details: ["Table massage: 60 minutes for $60 or 90 minutes for $90.", "Chair massage: 15 minutes for $15 or 30 minutes for $30."], action: "Explore massage sessions", href: "index.html?service=Massage#book-call", featured: true },
        { id: "review-reward", kicker: "Share your experience", value: "+30", unit: "massage minutes", title: "Honest feedback. A little more recovery.", description: "Leave an honest review on our website wall and receive 30 additional minutes of table massage. Every rating is eligible.", details: ["For example, enjoy 90 minutes at the standard 60-minute price, or 120 minutes at the standard 90-minute price.", "Arrange your longer appointment with Mike before booking. A disclosure of this offer appears with new website reviews."], action: "Visit the review wall", href: "index.html#testimonials" },
        { id: "massage-bundle", kicker: "Make recovery a routine", value: "25%", unit: "off your bundle", title: "Three or more. More value for you.", description: "Purchase a bundle of 3 or more massages and receive 25% off the bundle purchase.", details: ["Choose a ready-made pack, or build your own bundle of three massage and Pretzeling sessions and request your checkout link from Coach."], action: "Explore three-session packs", href: "promotions.html#massage-bundles" },
        { id: "massage-referrals", kicker: "Bring someone into the circle", value: "Refer", unit: "and receive", title: "Good care is worth sharing.", description: "Introduce new clients to Body of Works Fitness and receive referral rewards.", details: ["First qualifying referral: 30 additional minutes of table massage.", "Two paying clients who complete their sessions before you book: one free 60-minute massage, replacing the extra 30-minute reward.", "Each qualifying referral from the third onward: 50% off one next booked session, for any service.", "The later tier replaces an earlier reward that has not been redeemed. Arrange reward sessions with Mike before booking."], action: "Ask about referral rewards", subject: "Massage referral reward inquiry" }
      ] },
      { id: "coaching", label: "Coaching offers", eyebrow: "Invest in your long game", headline: "Build better habits. Enjoy more support.", offers: [
        { id: "friends-family", kicker: "Friends & family", value: "50%", unit: "off coaching", title: "A little closer. A little more support.", description: "The Friends & Family Discount gives eligible friends and family 50% off 1:1 coaching.", details: ["Confirm eligibility and your coaching plan with Mike."], action: "Discuss coaching", href: "index.html?service=1%3A1%20Coaching#book-call", featured: true },
        { id: "coaching-referrals", kicker: "Grow your wellness circle", value: "1 · 3 · 6", unit: "free coaching months", title: "Share the support that moves you forward.", description: "Refer clients for 1:1 coaching and receive free coaching months.", details: ["First referred client: 1 month free.", "Second referred client: 3 months free.", "Third referred client: 6 months free.", "A referred client qualifies when they are under a coaching contract; payment is not required to qualify. Confirm your reward with Mike before booking."], action: "Ask about coaching referrals", subject: "Coaching referral reward inquiry" },
        { id: "coaching-paid-full", kicker: "Paid in full", value: "20–30%", unit: "off your package", title: "Commit to your goals. Keep more value.", description: "Pay in full for a longer coaching package and save on the total package price.", details: ["6 months paid in full: 20% off.", "9 months paid in full: 25% off.", "12 months paid in full: 30% off.", "Discuss your personalized package and total with Mike."], action: "Plan your coaching", href: "index.html?service=1%3A1%20Coaching#book-call" }
      ] }
    ]
  });
});
