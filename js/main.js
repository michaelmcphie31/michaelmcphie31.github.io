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

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

const hero = document.querySelector(".hero");
const heroVideo = document.querySelector("[data-hero-video]");
const heroVideoBackdrop = document.querySelector("[data-hero-video-backdrop]");
const heroVideoPath = "assets/videos/workout-background.mp4?v=20261004-reviews";

if (hero && heroVideo) {
  if (heroVideoBackdrop) heroVideoBackdrop.src = heroVideoPath;
  heroVideo.src = heroVideoPath;
  heroVideo.addEventListener(
    "canplay",
    () => {
      hero.classList.add("has-video");
      heroVideoBackdrop?.play().catch(() => {});
      heroVideo.play().catch(() => {});
    },
    { once: true }
  );
  heroVideo.addEventListener(
    "error",
    () => {
      hero.classList.remove("has-video");
      heroVideo.removeAttribute("src");
      heroVideoBackdrop?.removeAttribute("src");
    },
    { once: true }
  );
  heroVideoBackdrop?.load();
  heroVideo.load();
}

const revealTargets = document.querySelectorAll(
  ".section-heading, .intro-grid > *, .page-hero-grid > *, .split-copy, .image-panel, .values-grid article, .service-row, .price-card, .review-section-action, .testimonial-card, .submitted-testimonial-grid, .guide-card, .evidence-grid a, .resources-cta"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    if (target.classList.contains("service-row") && index % 2 === 0) target.classList.add("reveal-from-left");
    if (target.classList.contains("service-row") && index % 2 !== 0) target.classList.add("reveal-from-right");
    if (target.classList.contains("split-copy")) target.classList.add("reveal-from-left");
    if (target.classList.contains("image-panel")) target.classList.add("reveal-from-right");
    if (target.matches(".page-hero-grid > :first-child")) target.classList.add("reveal-from-left");
    if (target.matches(".page-hero-grid > p")) target.classList.add("reveal-from-right");
    if (target.matches(".values-grid article")) {
      target.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
    }
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

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
  Pretzeling: { heading: "Book a Pretzeling session.", summary: handsOnSummary },
  Massage: { heading: "Book a massage appointment.", summary: handsOnSummary },
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
  const locationAddress = document.querySelector("[data-location-address]");
  const policyNote = document.querySelector("[data-booking-policy]");
  if (locationNote) locationNote.hidden = service === "1:1 Coaching";
  if (locationAddress) locationAddress.textContent = bookingModel.policy.handsOnLocation;
  if (policyNote) policyNote.textContent = bookingModel.policyText;
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
    const observer = new IntersectionObserver((entries) => {
      document.body.classList.toggle("is-booking-visible", entries.some((entry) => entry.isIntersecting));
    }, { threshold: 0 });
    observer.observe(bookingSection);
  }
}

const thankYouApplication = document.querySelector("[data-thankyou-application]");
if (thankYouApplication) thankYouApplication.hidden = new URLSearchParams(window.location.search).get("service") !== "1:1 Coaching";

const reviewStorageKey = "body-of-works-fitness-reviews-v1";
const reviewDialog = document.querySelector("[data-review-dialog]");
const reviewForm = document.querySelector("[data-review-form]");
const reviewRatingInput = document.querySelector("[data-review-rating-input]");
const reviewSelectedRating = document.querySelector("[data-review-selected-rating]");
const reviewStatus = document.querySelector("[data-review-status]");
const reviewList = document.querySelector("[data-review-list]");
const reviewOpenButtons = document.querySelectorAll("[data-review-open]");
const reviewClose = document.querySelector("[data-review-close]");
const reviewRatingButtons = document.querySelectorAll("[data-review-rating-button]");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const savedReviews = () => {
  try {
    return JSON.parse(window.localStorage.getItem(reviewStorageKey)) || [];
  } catch {
    return [];
  }
};

const persistReview = (review) => {
  try {
    const nextReviews = [review, ...savedReviews()].slice(0, 12);
    window.localStorage.setItem(reviewStorageKey, JSON.stringify(nextReviews));
  } catch {
    // Reviews still submit by email even if browser storage is unavailable.
  }
};

const renderSubmittedReviews = () => {
  if (!reviewList) return;
  const reviews = savedReviews();
  reviewList.hidden = !reviews.length;
  reviewList.innerHTML = reviews
    .map(
      (review) => `
        <article class="testimonial-card submitted-testimonial-card">
          <div class="testimonial-rating" aria-label="${review.rating} out of 5 stars">
            <span>${"★".repeat(review.rating)}</span>
            <small>${Number(review.rating).toFixed(1)}</small>
          </div>
          <p>"${escapeHtml(review.text)}"</p>
          <div>
            <strong>${escapeHtml(review.name)}</strong>
            <span>${escapeHtml(review.service)} / Site review</span>
          </div>
        </article>
      `
    )
    .join("");
};

const setReviewRating = (rating) => {
  const safeRating = Math.max(1, Math.min(5, Number(rating) || 5));
  if (reviewRatingInput) reviewRatingInput.value = String(safeRating);
  if (reviewSelectedRating) reviewSelectedRating.textContent = String(safeRating);
  reviewRatingButtons.forEach((button) => {
    const buttonRating = Number(button.getAttribute("data-review-rating-button") || 0);
    button.classList.toggle("is-active", buttonRating <= safeRating);
  });
};

const openReviewDialog = (rating = 5) => {
  if (!reviewDialog || !reviewForm) return;
  setReviewRating(rating);
  if (reviewStatus) reviewStatus.textContent = "";
  if (typeof reviewDialog.showModal === "function") {
    reviewDialog.showModal();
  } else {
    reviewDialog.setAttribute("open", "");
  }
  window.setTimeout(() => reviewForm.elements.name?.focus(), 60);
};

reviewOpenButtons.forEach((button) => {
  button.addEventListener("click", () => openReviewDialog(button.getAttribute("data-review-rating") || 5));
});

reviewRatingButtons.forEach((button) => {
  button.addEventListener("click", () => setReviewRating(button.getAttribute("data-review-rating-button") || 5));
});

reviewClose?.addEventListener("click", () => {
  reviewDialog?.close();
});

reviewForm?.addEventListener("submit", () => {
  const formData = new FormData(reviewForm);
  const name = String(formData.get("name") || "").trim();
  const text = String(formData.get("review") || "").trim();
  const service = String(formData.get("service") || "General experience").trim();
  const rating = Math.max(1, Math.min(5, Number(formData.get("rating") || 5)));

  if (!name || !text) return;

  persistReview({
    name,
    text,
    service,
    rating,
    createdAt: new Date().toISOString(),
  });

  renderSubmittedReviews();
  if (reviewStatus) reviewStatus.textContent = "Thank you. Your review has been submitted.";
  window.setTimeout(() => {
    reviewDialog?.close();
    reviewForm.reset();
    setReviewRating(5);
  }, 350);
});

setReviewRating(5);
renderSubmittedReviews();
