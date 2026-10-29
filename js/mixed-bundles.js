(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./booking-model.js"));
  else root.BOWMixedBundles = factory(root.BodyOfWorksBooking);
})(typeof globalThis !== "undefined" ? globalThis : this, function (booking) {
  "use strict";
  const options = Object.freeze(["Massage", "Chair Massage", "Pretzeling"].flatMap(group => booking.catalog[group].options));
  function calculate(ids) {
    if (!Array.isArray(ids) || ids.length !== 3) return null;
    const sessions = ids.map(id => options.find(option => option.id === id));
    if (sessions.some(option => !option)) return null;
    const standardCents = sessions.reduce((sum, option) => sum + Math.round(option.price * 100), 0);
    const savingsCents = Math.round(standardCents / 4);
    return Object.freeze({ sessions: Object.freeze(sessions), standardCents, savingsCents, totalCents: standardCents - savingsCents });
  }
  const money = cents => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
  function requestUrl(quote) {
    if (!quote || calculate(quote.sessions.map(s => s.id))?.totalCents !== quote.totalCents) return null;
    const lines = quote.sessions.map((s, i) => `${i + 1}. ${s.name} — ${s.duration} min — ${money(s.price * 100)} [${s.id}]`);
    const body = ["Hello Coach,", "", "Please send me a secure Acuity checkout link for this mixed three-session pack:", ...lines,
      "", "Standard total: " + money(quote.standardCents), "25% bundle saving: " + money(quote.savingsCents),
      "Requested package total: " + money(quote.totalCents), "", "Please confirm the chosen sessions and booking-code details before I purchase."].join("\n");
    return "mailto:imagin8it.home@gmail.com?subject=" + encodeURIComponent("Mixed three-pack checkout request") + "&body=" + encodeURIComponent(body);
  }
  return Object.freeze({ options, calculate, requestUrl, money });
});
