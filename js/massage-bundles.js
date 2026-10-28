/* Owner-approved public Acuity packs, verified October 28, 2026.
   Send shoppers to the full store so they can combine quantities and pack types. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./booking-model.js"));
  else root.BOWMassageBundles = factory(root.BodyOfWorksBooking);
})(typeof globalThis !== "undefined" ? globalThis : this, function (booking) {
  "use strict";
  const nativeProductIds = Object.freeze({
    "swedish-60": 2305050, "swedish-90": 2305053, "therapeutic-60": 2305054, "therapeutic-90": 2305055,
    "sports-60": 2305056, "sports-90": 2305057, "chair-15": 2305058, "chair-30": 2305059
  });
  const packs = ["Massage", "Chair Massage"].flatMap((group) => booking.catalog[group].options.map((option) => {
    const standardCents = option.price * 100 * 3;
    const savingsCents = Math.round(standardCents * 25 / 100);
    return Object.freeze({ id: option.id, name: option.name, duration: option.duration, sessions: 3, expirationDays: 180,
      appointmentTypeId: option.appointmentTypeId, standardCents, savingsCents,
      priceCents: standardCents - savingsCents, discountPercent: 25, nativeProductId: nativeProductIds[option.id] });
  }));
  return Object.freeze({ packs: Object.freeze(packs), storeUrl: "https://app.acuityscheduling.com/catalog.php?owner=40726953", activated: true });
});
