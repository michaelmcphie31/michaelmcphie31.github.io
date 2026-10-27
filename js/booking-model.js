(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.BodyOfWorksBooking = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Public scheduling identifiers, never API keys or access to the owner's calendar.
  const ownerId = "40726953";
  const timeZone = "America/Chicago";
  const policy = Object.freeze({"handsOnLocation": "9209 Winfield Lane, Moore, OK 73160", "minimumNoticeHours": 48, "maximumAdvanceDays": 60, "cancellationNoticeHours": 24, "lateCancellationFeePercent": 25, "rescheduleNoticeHours": 8, "onlineChangeCutoffHours": 8});
  const policyText = "Please cancel at least 24 hours before your scheduled appointment. Cancellations with less than 24 hours' notice are subject to a fee equal to 25% of the scheduled session price. Rescheduling is permitted until 8 hours before the scheduled start time. To cancel with less than 8 hours' notice, please reply to your booking confirmation email.";
  const option = (id, name, duration, price, appointmentTypeId) => Object.freeze({
    id, name, duration, price, appointmentTypeId,
    label: name + " — " + duration + " min" + (price === 0 ? " (Free)" : " ($" + price + ")"),
    bookingUrl: "https://app.acuityscheduling.com/schedule.php?owner=" + ownerId + "&appointmentType=" + appointmentTypeId,
  });
  const catalog = Object.freeze({
    "1:1 Coaching": Object.freeze({ options: Object.freeze([
      option("coaching-call", "Free Coaching Call", 30, 0, "99859371"),
    ]) }),
    Pretzeling: Object.freeze({ options: Object.freeze([
      option("pretzeling-15", "Pretzeling", 15, 30, "99859393"),
      option("pretzeling-30", "Pretzeling", 30, 60, "99859421"),
    ]) }),
    Massage: Object.freeze({ options: Object.freeze([
      option("swedish-60", "Classic Swedish", 60, 75, "99859464"),
      option("swedish-90", "Classic Swedish", 90, 115, "99859480"),
      option("therapeutic-60", "Therapeutic", 60, 90, "99859482"),
      option("therapeutic-90", "Therapeutic", 90, 135, "99859494"),
      option("sports-60", "Sports", 60, 100, "99859495"),
      option("sports-90", "Sports", 90, 150, "99859496"),
    ]) }),
  });
  const getService = (service) => Object.prototype.hasOwnProperty.call(catalog, service) ? catalog[service] : null;
  const getOption = (service, optionId) =>
    getService(service)?.options.find((item) => item.id === optionId) || null;

  // Acuity owns dates, live availability, busy-time checks, and confirmation.
  // Never generate alternative slots or a Google Calendar TEMPLATE in this page.
  return Object.freeze({ ownerId, timeZone, catalog, getService, getOption, policy, policyText });
});
