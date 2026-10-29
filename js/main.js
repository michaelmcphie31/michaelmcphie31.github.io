const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");

const syncHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

toggle?.addEventListener("click", () => {
  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  nav?.classList.toggle("is-open", !isOpen);
  header?.classList.toggle("is-open", !isOpen);
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
    header?.classList.remove("is-open");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
    toggle.click();
    toggle.focus();
  }
});

document.addEventListener("click", (event) => {
  if (toggle?.getAttribute("aria-expanded") === "true" && !header.contains(event.target)) toggle.click();
});
window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

// Respect motion/data preferences and use one video, with an explicit pause control.
const hero = document.querySelector(".hero");
const heroVideo = document.querySelector("[data-hero-video]");
const motionToggle = document.querySelector("[data-hero-motion]");
const motionPreference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
const mobileMotionPreference = window.matchMedia?.("(max-width: 620px)");
if (hero && heroVideo) {
  const stopMotion = () => {
    heroVideo.pause();
    hero.classList.remove("has-video");
    if (motionToggle) motionToggle.hidden = true;
  };
  const startMotion = () => {
    if (motionPreference?.matches || window.navigator?.connection?.saveData || window.innerWidth <= 620) { stopMotion(); return; }
    const source = heroVideo.querySelector("source[data-src]");
    if (source && !source.src) { source.src = source.dataset.src; heroVideo.load(); }
    heroVideo.play().catch(stopMotion);
  };
  heroVideo.addEventListener("playing", () => {
    hero.classList.add("has-video");
    if (motionToggle) { motionToggle.hidden = false; motionToggle.textContent = "Pause background video"; motionToggle.setAttribute("aria-pressed", "false"); }
  });
  heroVideo.addEventListener("error", stopMotion);
  motionToggle?.addEventListener("click", () => {
    if (heroVideo.paused) startMotion();
    else { heroVideo.pause(); motionToggle.textContent = "Play background video"; motionToggle.setAttribute("aria-pressed", "true"); }
  });
  motionPreference?.addEventListener("change", () => motionPreference.matches ? stopMotion() : startMotion());
  mobileMotionPreference?.addEventListener("change", () => mobileMotionPreference.matches ? stopMotion() : startMotion());
  startMotion();
}

// Keep content visible immediately; no scroll-triggered reveal delays.

const bookingModel = window.BodyOfWorksBooking;
const bookingSection = document.querySelector("#book-call");
const serviceSelect = document.querySelector("[data-service-select]");
const sessionOptionSelect = document.querySelector("[data-session-option-select]");
const sessionOptionField = document.querySelector("[data-session-option-field]");
const bookingTitle = document.querySelector("[data-booking-title]");
const bookingSummary = document.querySelector("[data-booking-summary]");
const sessionStatus = document.querySelector("[data-session-status]");
const schedulerLink = document.querySelector("[data-scheduler-link]");
const coachingApplication = document.querySelector("[data-coaching-application]");
const serviceTriggers = document.querySelectorAll("[data-book-service]");
const serviceChoiceButtons = document.querySelectorAll("[data-service-choice]");
const handsOnSummary = "Monday–Friday, 3–6 PM; Saturday, 8 AM–noon; Sunday, 1–5 PM Central Time. Book 48 hours to 60 days ahead.";
const serviceConfigs = {
  "1:1 Coaching": {
    heading: "Book a free coaching call.",
    summary: "Monday–Friday, 7 AM–7 PM; Saturday, 1–5 PM Central Time. Book 48 hours to 60 days ahead.",
  },
  "In-Person Training": {
    heading: "Book your in-person training.",
    summary: handsOnSummary,
  },
  Pretzeling: { heading: "Book a Pretzeling session.", summary: handsOnSummary },
  Massage: { heading: "Book a massage appointment.", summary: handsOnSummary },
  "Chair Massage": { heading: "Book a chair massage.", summary: handsOnSummary },
};
const currentServiceKey = () => bookingModel.getService(serviceSelect?.value) ? serviceSelect.value : "Massage";
const currentOptions = () => bookingModel.catalog[currentServiceKey()].options;
const currentOption = () => bookingModel.getOption(currentServiceKey(), sessionOptionSelect?.value);

const populateSessionOptions = (preferredId) => {
  if (!sessionOptionSelect) return;
  const previousId = sessionOptionSelect.value;
  sessionOptionSelect.replaceChildren();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choose a session and duration";
  sessionOptionSelect.append(placeholder);
  currentOptions().forEach((option) => {
    const element = document.createElement("option");
    element.value = option.id;
    element.textContent = option.label;
    sessionOptionSelect.append(element);
  });
  const requestedId = preferredId === undefined ? previousId : preferredId;
  const selected = bookingModel.getOption(currentServiceKey(), requestedId);
  sessionOptionSelect.value = selected?.id || (currentOptions().length === 1 ? currentOptions()[0].id : "");
};

const rememberBookingChoice = () => {
  if (!bookingSection || !window.history?.replaceState) return;
  const url = new URL(window.location.href);
  const selected = currentOption();
  const hasBookingParams = url.searchParams.has("service") || url.searchParams.has("option");
  if (!selected && !hasBookingParams) return;
  url.searchParams.set("service", currentServiceKey());
  if (selected) url.searchParams.set("option", selected.id);
  else url.searchParams.delete("option");
  window.history.replaceState(null, "", url.href);
};

const renderBooking = () => {
  const service = currentServiceKey();
  const selected = currentOption();
  const config = serviceConfigs[service];
  if (bookingTitle) bookingTitle.textContent = config.heading;
  if (bookingSummary) bookingSummary.textContent = config.summary;
  if (sessionOptionField) sessionOptionField.hidden = currentOptions().length === 1;
  if (coachingApplication) coachingApplication.hidden = service !== "1:1 Coaching";
  const locationNote = document.querySelector("[data-booking-location]");
  const policyNote = document.querySelector("[data-booking-policy]");
  if (locationNote) locationNote.hidden = !["Massage", "Chair Massage", "Pretzeling"].includes(service);
  if (policyNote) policyNote.textContent = bookingModel.policyText;
  const paymentNote = document.querySelector("[data-payment-note]");
  const showPaymentNote = bookingModel.payments.active && selected && selected.price > 0;
  if (paymentNote) {
    paymentNote.hidden = !showPaymentNote;
    paymentNote.textContent = showPaymentNote ? bookingModel.payments.notice : "";
  }
  document.querySelectorAll("[data-payment-summary]").forEach((row) => { row.hidden = !showPaymentNote; });
  const paymentBalance = document.querySelector("[data-payment-balance]");
  if (paymentBalance) paymentBalance.textContent = showPaymentNote ? "$" + selected.price : "—";
  const paymentHelp = document.querySelector("[data-payment-step-help]");
  if (paymentHelp) paymentHelp.hidden = !showPaymentNote;
  serviceChoiceButtons.forEach((button) => {
    const active = button.dataset.serviceChoice === service;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const values = {
    service: selected?.name || "Choose a session",
    duration: selected ? selected.duration + " minutes" : "—",
    price: selected ? (selected.price === 0 ? "Free" : "$" + selected.price) : "—",
  };
  Object.entries(values).forEach(([key, value]) => {
    const element = document.querySelector("[data-request-" + key + "]");
    if (element) element.textContent = value;
  });
  if (schedulerLink) {
    schedulerLink.setAttribute("aria-disabled", String(!selected));
    if (selected) {
      schedulerLink.setAttribute("href", selected.bookingUrl);
      schedulerLink.removeAttribute("tabindex");
    } else {
      schedulerLink.removeAttribute("href");
      schedulerLink.setAttribute("tabindex", "-1");
    }
  }
  if (sessionStatus) sessionStatus.textContent = selected
    ? "Continue to Acuity to choose an available date and time for this session."
    : "Choose your session and duration to check availability.";
  rememberBookingChoice();
};

const switchService = (service, preferredId) => {
  if (!serviceSelect || !bookingModel.getService(service)) return;
  serviceSelect.value = service;
  populateSessionOptions(preferredId);
  renderBooking();
};
sessionOptionSelect?.addEventListener("change", renderBooking);
serviceChoiceButtons.forEach((button) => button.addEventListener("click", () => switchService(button.dataset.serviceChoice)));
serviceTriggers.forEach((trigger) => trigger.addEventListener("click", () => switchService(trigger.dataset.bookService, trigger.dataset.bookOption)));

// Price cards and the booking handoff share the owner-approved catalog.
const allOptions = Object.values(bookingModel.catalog).flatMap((service) => service.options);
document.querySelectorAll("[data-catalog-prices]").forEach((container) => {
  const options = allOptions.filter((option) => option.name === container.dataset.catalogPrices);
  container.replaceChildren(...options.map((option) => {
    const line = document.createElement("p");
    const duration = document.createElement("strong");
    duration.textContent = option.duration + " min";
    line.append(duration, " $" + option.price);
    return line;
  }));
});
if (bookingSection) {
  const params = new URLSearchParams(window.location.search);
  const service = bookingModel.getService(params.get("service")) ? params.get("service") : currentServiceKey();
  switchService(service, params.get("option") || "");
  if ("IntersectionObserver" in window) {
    const visibleBookingAreas = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleBookingAreas.add(entry.target);
        else visibleBookingAreas.delete(entry.target);
      });
      document.body.classList.toggle("is-booking-area-visible", visibleBookingAreas.size > 0);
    }, { threshold: 0 });
    document.querySelectorAll("#services, #pricing, #book-call").forEach((area) => observer.observe(area));
  }
}

const thankYouApplication = document.querySelector("[data-thankyou-application]");
if (thankYouApplication) thankYouApplication.hidden = new URLSearchParams(window.location.search).get("service") !== "1:1 Coaching";
