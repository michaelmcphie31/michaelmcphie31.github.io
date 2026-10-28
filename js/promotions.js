/* Accessible specials dialog. No tracking, purchases, or scheduler mutations. */
(() => {
  "use strict";
  const data = window.BOWPromotions;
  if (!data) return;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function offerCard(offer) {
    const card = make("article", "offer-card" + (offer.featured ? " offer-featured" : ""));
    card.dataset.offer = offer.id;
    card.append(make("p", "offer-kicker", offer.kicker));
    const value = make("p", "offer-value", offer.value);
    value.append(make("span", "offer-unit", offer.unit));
    card.append(value, make("h3", "", offer.title), make("p", "offer-description", offer.description));
    const details = make("ul", "offer-details");
    offer.details.forEach((text) => details.append(make("li", "", text)));
    const action = make("a", "offer-action", offer.action + " →");
    action.href = offer.href || "mailto:imagin8it.home@gmail.com?subject=" + encodeURIComponent(offer.subject);
    card.append(details, action);
    return card;
  }
  function offersGroup(group) {
    const wrap = make("div", "offers-group");
    wrap.append(make("p", "eyebrow", group.eyebrow));
    const grid = make("div", "offers-grid");
    group.offers.forEach((offer) => grid.append(offerCard(offer)));
    wrap.append(grid);
    return wrap;
  }
  document.querySelectorAll("[data-offers-page]").forEach((host) => {
    data.groups.forEach((group) => {
      const section = host.querySelector("#" + group.id) || make("section", "offers-page-group");
      section.id = group.id;
      section.replaceChildren(make("h2", "", group.label), offersGroup(group));
      host.append(section);
    });
    host.append(make("p", "offer-redemption", data.redemption), make("p", "offer-terms", data.terms));
  });
  // Offer cards add height above the bundle section. Resolve incoming deep links
  // after that layout exists, so a homepage bundle link lands on the actual packs.
  if (document.querySelector("[data-offers-page]") && window.location.hash) {
    const alignIncomingOffer = () => window.requestAnimationFrame(() => {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: "start", behavior: "auto" });
    });
    if (document.readyState === "complete") alignIncomingOffer();
    else window.addEventListener("load", alignIncomingOffer, { once: true });
  }
  const dialog = make("dialog", "promotions-dialog");
  dialog.setAttribute("aria-labelledby", "specials-title");
  dialog.setAttribute("aria-describedby", "specials-intro");
  const top = make("div", "promotions-top");
  const heading = make("div");
  heading.append(make("p", "eyebrow", "A little extra, from Body of Works"));
  const title = make("h2", "", "Good care. Great perks.");
  title.id = "specials-title";
  const intro = make("p", "", "Massage & coaching specials. Scroll to explore every offer.");
  intro.id = "specials-intro";
  heading.append(title, intro);
  const close = make("button", "promotions-close", "×");
  close.type = "button";
  close.setAttribute("aria-label", "Close promotions");
  top.append(heading, close);
  const tabs = make("div", "promotions-tabs");
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", "Promotion categories");
  const content = make("div", "promotions-content");
  const buttons = [];
  const panels = [];
  function choose(index, focus = false) {
    buttons.forEach((button, i) => {
      button.setAttribute("aria-selected", String(i === index));
      button.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    content.scrollTop = 0;
    if (focus) buttons[index].focus();
  }
  data.groups.forEach((group, index) => {
    const button = make("button", "", group.label);
    button.type = "button";
    button.id = "specials-tab-" + group.id;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", "specials-panel-" + group.id);
    const panel = offersGroup(group);
    panel.id = "specials-panel-" + group.id;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", button.id);
    panel.tabIndex = 0;
    button.addEventListener("click", () => choose(index));
    button.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
      if (event.key === "ArrowLeft") next = (index + buttons.length - 1) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      if (next !== undefined) { event.preventDefault(); choose(next, true); }
    });
    buttons.push(button); panels.push(panel);
    tabs.append(button); content.append(panel);
  });
  const bottom = make("div", "promotions-bottom");
  bottom.append(make("p", "offer-redemption", data.redemption), make("p", "offer-terms", data.terms));
  const all = make("a", "text-link", "View all specials on one page →");
  all.href = "promotions.html";
  bottom.append(all);
  dialog.append(top, tabs, content, bottom);
  document.body.append(dialog);
  choose(0);
  const storageKey = "bow-specials-seen-" + data.version;
  let opener = null;
  const remember = () => { try { window.sessionStorage.setItem(storageKey, "1"); } catch { /* Dialog still works when storage is blocked. */ } };
  function open(event) {
    event?.preventDefault();
    if (dialog.open || document.querySelector("dialog[open]")) return;
    opener = event?.currentTarget || document.activeElement;
    dialog.showModal();
    document.body.classList.add("has-promotions-open");
    close.focus({ preventScroll: true });
    remember();
  }
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')]
      .filter((node) => node.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("has-promotions-open");
    remember();
    if (opener instanceof HTMLElement && opener.isConnected && opener.getClientRects().length > 0) {
      opener.focus({ preventScroll: true });
    } else {
      // Mobile navigation closes when Specials is selected; return to its visible toggle.
      const navToggle = document.querySelector("[data-nav-toggle]");
      if (navToggle?.getClientRects().length) navToggle.focus({ preventScroll: true });
    }
  });
  document.querySelectorAll("[data-promo-open]").forEach((trigger) => trigger.addEventListener("click", open));
  let seen = false;
  try { seen = window.sessionStorage.getItem(storageKey) === "1"; } catch { /* No persistent identifier. */ }
  const directTask = /#(?:book-call|testimonials)$/.test(window.location.hash) || new URLSearchParams(window.location.search).has("service");
  const dedicatedPage = document.body.classList.contains("promotions-page") || document.body.classList.contains("thank-you");
  let visitorActed = false;
  ["pointerdown", "keydown"].forEach((event) => document.addEventListener(event, () => { visitorActed = true; }, { once: true }));
  if (!seen && !directTask && !dedicatedPage) window.setTimeout(() => {
    // Do not move focus away from a visitor who already started a task.
    if (!visitorActed && !document.querySelector("dialog[open]")) open();
  }, 1000);
})();
