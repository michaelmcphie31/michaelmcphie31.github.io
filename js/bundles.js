(() => {
  "use strict";
  const host = document.querySelector("[data-massage-bundles]");
  const bundles = window.BOWMassageBundles;
  if (!host || !bundles) return;
  const money = (cents) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  bundles.packs.forEach((pack) => {
    const card = make("article", "bundle-card");
    card.dataset.bundle = pack.id;
    card.append(make("p", "offer-kicker", "3 sessions · 25% off"), make("h3", "", pack.name),
      make("p", "bundle-duration", pack.duration + " minutes per appointment"));
    const price = make("p", "bundle-price", money(pack.priceCents));
    const regular = make("p", "bundle-standard");
    regular.append(make("s", "", money(pack.standardCents)), " standard total");
    card.append(price, regular, make("p", "bundle-saving", "Save " + money(pack.savingsCents) + " on the pack"), make("p", "bundle-expiry", "Valid for 180 days after purchase"));
    if (bundles.activated && /^https:\/\/(?:app|secure)\.acuityscheduling\.com\//.test(bundles.storeUrl)) {
      const link = make("a", "button button-primary", "Shop packs in Acuity");
      link.href = bundles.storeUrl;
      link.setAttribute("aria-label", "Shop " + pack.name + " " + pack.duration + "-minute packs in Acuity’s store");
      card.append(link);
    } else {
      const disabled = make("button", "button button-secondary", "Online package sales coming soon");
      disabled.type = "button"; disabled.disabled = true;
      card.append(disabled);
    }
    host.append(card);
  });
})();
