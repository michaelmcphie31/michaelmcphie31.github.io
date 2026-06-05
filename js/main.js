const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");

const syncHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

toggle?.addEventListener("click", () => {
  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!isOpen));
  nav?.classList.toggle("is-open", !isOpen);
  header?.classList.toggle("is-open", !isOpen);
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    toggle?.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    header?.classList.remove("is-open");
  }
});

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

const hero = document.querySelector(".hero");
const heroVideo = document.querySelector("[data-hero-video]");
const heroVideoBackdrop = document.querySelector("[data-hero-video-backdrop]");
const heroVideoPath = "assets/videos/workout-background.mp4?v=20260603-forceplay";

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
  ".section-heading, .intro-grid > *, .page-hero-grid > *, .split-copy, .image-panel, .values-grid article, .service-row, .price-card, .calendar-panel, .booking-form, .review-section-action, .testimonial-card, .submitted-testimonial-grid, .evidence-grid a"
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

const calendarGrid = document.querySelector("[data-calendar-grid]");
const calendarTitle = document.querySelector("[data-calendar-title]");
const timeTitle = document.querySelector("[data-time-title]");
const timeList = document.querySelector("[data-time-list]");
const prevButton = document.querySelector("[data-calendar-prev]");
const nextButton = document.querySelector("[data-calendar-next]");
const bookingForm = document.querySelector("[data-booking-form]");
const selectedDateInput = document.querySelector("[data-selected-date-input]");
const selectedTimeInput = document.querySelector("[data-selected-time-input]");
const calendarLinkInput = document.querySelector("[data-calendar-link-input]");
const bookingStatus = document.querySelector("[data-booking-status]");
const nextInput = document.querySelector("[data-next-input]");
const subjectInput = document.querySelector("[data-subject-input]");
const autoresponseInput = document.querySelector("[data-autoresponse-input]");
const automationKeyInput = document.querySelector("[data-automation-key-input]");
const bookingTitle = document.querySelector("[data-booking-title]");
const bookingSummary = document.querySelector("[data-booking-summary]");
const submitButton = document.querySelector("[data-submit-button]");
const serviceSelect = document.querySelector("[data-service-select]");
const sessionOptionSelect = document.querySelector("[data-session-option-select]");
const sessionOptionField = document.querySelector("[data-session-option-field]");
const coachingApplication = document.querySelector("[data-coaching-application]");
const serviceTriggers = document.querySelectorAll("[data-book-service]");

const ownerEmail = "imagin8it.home@gmail.com";
const serviceTimeZone = "America/Chicago";
const serviceTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: serviceTimeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const weekdayCallSchedule = [
  {
    days: [1, 2, 3, 4, 5],
    windows: [
      { start: "5:00 AM", end: "8:30 AM" },
      { start: "3:00 PM", end: "6:00 PM" },
    ],
  },
];

const weekendServiceSchedule = [
  {
    days: [6],
    windows: [{ start: "8:00 AM", end: "12:00 PM" }],
  },
  {
    days: [0],
    windows: [{ start: "1:00 PM", end: "5:00 PM" }],
  },
];

const serviceConfigs = {
  "1:1 Coaching": {
    heading: "Choose a free coaching call time.",
    summary:
      "Available Monday through Friday in 30-minute windows: 5:00 AM to 8:30 AM CT and 3:00 PM to 6:00 PM CT. Calls must be booked at least 72 hours in advance.",
    submitLabel: "Book Free Coaching Call",
    subject: "New Body of Works Fitness Coaching Call Request",
    eventTitle: "Body of Works Fitness Free Coaching Call",
    details: "Free coaching call with Body of Works Fitness.",
    automationKey: "coaching-call",
    autoresponse:
      "Thank you for requesting a free 1:1 coaching call with Body of Works Fitness. Please complete the coaching application at https://form.typeform.com/to/nYSQBHoF before your call so I can review your goals in advance.",
    applicationUrl: "https://form.typeform.com/to/nYSQBHoF",
    showApplication: true,
    showSessionOptions: false,
    leadHours: 72,
    schedule: weekdayCallSchedule,
    options: [
      {
        value: "Free Coaching Call (30 min)",
        label: "Free Coaching Call (30 min)",
        duration: 30,
      },
    ],
  },
  Pretzeling: {
    heading: "Choose a Pretzeling session time.",
    summary:
      "Pretzeling sessions are available Saturdays from 8:00 AM to 12:00 PM CT and Sundays from 1:00 PM to 5:00 PM CT.",
    submitLabel: "Book Pretzeling",
    subject: "New Body of Works Fitness Pretzeling Request",
    eventTitle: "Body of Works Fitness Pretzeling Session",
    details: "Pretzeling session with Body of Works Fitness.",
    automationKey: "pretzeling-session",
    autoresponse:
      "Thank you for requesting a Pretzeling session with Body of Works Fitness. Your request was received, and the calendar event link on the booking page can be used to add the session to your calendar.",
    showApplication: false,
    showSessionOptions: true,
    leadHours: 0,
    schedule: weekendServiceSchedule,
    options: [
      { value: "Pretzeling - 30 min ($60)", label: "Pretzeling - 30 min ($60)", duration: 30 },
      { value: "Pretzeling - 45 min ($90)", label: "Pretzeling - 45 min ($90)", duration: 45 },
      { value: "Pretzeling - 60 min ($120)", label: "Pretzeling - 60 min ($120)", duration: 60 },
    ],
  },
  Massage: {
    heading: "Choose a massage session time.",
    summary:
      "Massage sessions are available Saturdays from 8:00 AM to 12:00 PM CT and Sundays from 1:00 PM to 5:00 PM CT.",
    submitLabel: "Book Massage",
    subject: "New Body of Works Fitness Massage Request",
    eventTitle: "Body of Works Fitness Massage Session",
    details: "Massage session with Body of Works Fitness.",
    automationKey: "massage-intake-needed",
    autoresponse:
      "Thank you for requesting a massage session with Body of Works Fitness. Your request was received. If intake paperwork is needed, it will be sent to this email.",
    showApplication: false,
    showSessionOptions: true,
    leadHours: 0,
    schedule: weekendServiceSchedule,
    options: [
      { value: "Classic Swedish - 60 min ($75)", label: "Classic Swedish - 60 min ($75)", duration: 60 },
      { value: "Classic Swedish - 90 min ($115)", label: "Classic Swedish - 90 min ($115)", duration: 90 },
      { value: "Therapeutic - 60 min ($90)", label: "Therapeutic - 60 min ($90)", duration: 60 },
      { value: "Therapeutic - 90 min ($135)", label: "Therapeutic - 90 min ($135)", duration: 90 },
      { value: "Sports - 60 min ($100)", label: "Sports - 60 min ($100)", duration: 60 },
      { value: "Sports - 90 min ($150)", label: "Sports - 90 min ($150)", duration: 90 },
    ],
  },
};

const unavailableDates = new Set();

let visibleMonth = new Date();
let selectedDate = "";
let selectedTime = "";

const timeToMinutes = (time) => {
  const [clock, period] = time.split(" ");
  let [hours, minutes] = clock.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes) => {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
};

const generateSlots = (start, end, durationMinutes) => {
  const slots = [];
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  for (let minutes = startMinutes; minutes + durationMinutes <= endMinutes; minutes += 30) {
    slots.push(minutesToTime(minutes));
  }
  return slots;
};

const dateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const serviceTimeParts = (date) => {
  const parts = Object.fromEntries(serviceTimeFormatter.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hours: Number(parts.hour),
    minutes: Number(parts.minute),
  };
};

const partsToComparableMinutes = ({ year, month, day, hours, minutes }) =>
  Date.UTC(year, month - 1, day, hours, minutes) / 60000;

const prettyDate = (key) => {
  const date = new Date(`${key}T12:00:00`);
  return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
};

const timeToParts = (time) => {
  const [clock, period] = time.split(" ");
  let [hours, minutes] = clock.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
};

const currentServiceKey = () => {
  const service = serviceSelect?.value;
  return service && serviceConfigs[service] ? service : "1:1 Coaching";
};

const currentConfig = () => serviceConfigs[currentServiceKey()];

const currentOption = () => {
  const config = currentConfig();
  return config.options.find((option) => option.value === sessionOptionSelect?.value) || config.options[0];
};

const bookingCutoffMinutes = () => {
  const cutoff = new Date(Date.now() + currentConfig().leadHours * 60 * 60 * 1000);
  return partsToComparableMinutes(serviceTimeParts(cutoff));
};

const slotToComparableMinutes = (key, time) => {
  const [year, month, day] = key.split("-").map(Number);
  const { hours, minutes } = timeToParts(time);
  return partsToComparableMinutes({ year, month, day, hours, minutes });
};

const isBookableSlot = (key, time) => slotToComparableMinutes(key, time) >= bookingCutoffMinutes();

const slotStartParts = (key, time) => {
  const [year, month, day] = key.split("-").map(Number);
  const { hours, minutes } = timeToParts(time);
  return { year, month, day, hours, minutes };
};

const slotEndParts = (key, time, durationMinutes) => {
  const [year, month, day] = key.split("-").map(Number);
  const { hours, minutes } = timeToParts(time);
  const end = new Date(Date.UTC(year, month - 1, day, hours, minutes + durationMinutes));
  return {
    year: end.getUTCFullYear(),
    month: end.getUTCMonth() + 1,
    day: end.getUTCDate(),
    hours: end.getUTCHours(),
    minutes: end.getUTCMinutes(),
  };
};

const formatGoogleDateParts = ({ year, month, day, hours, minutes }) => {
  const formattedMonth = String(month).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  return `${year}${formattedMonth}${formattedDay}T${formattedHours}${formattedMinutes}00`;
};

const scheduleWindowsFor = (date, config) =>
  config.schedule
    .filter((entry) => entry.days.includes(date.getDay()))
    .flatMap((entry) => entry.windows);

const calendarEventTitle = () => {
  const option = currentOption();
  if (option.value === "Free Coaching Call (30 min)") return currentConfig().eventTitle;
  return `${currentConfig().eventTitle}: ${option.value}`;
};

const clientEmailValue = () => {
  const emailInput = bookingForm?.querySelector('input[name="email"]');
  return emailInput ? emailInput.value.trim() : "";
};

const calendarAttendees = () => [ownerEmail, clientEmailValue()].filter(Boolean).join(",");

const calendarEventDetails = () => {
  const config = currentConfig();
  const applicationLine = config.applicationUrl ? ` Coaching application: ${config.applicationUrl}.` : "";
  return `${config.details} Requested option: ${currentOption().value}.${applicationLine}`;
};

const formatGoogleDatesForSlot = () => {
  const option = currentOption();
  const startParts = slotStartParts(selectedDate, selectedTime);
  const endParts = slotEndParts(selectedDate, selectedTime, option.duration);
  return `${formatGoogleDateParts(startParts)}/${formatGoogleDateParts(endParts)}`;
};

const buildCalendarLink = () => {
  if (!selectedDate || !selectedTime) return "";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: calendarEventTitle(),
    dates: formatGoogleDatesForSlot(),
    details: calendarEventDetails(),
    add: calendarAttendees(),
    ctz: serviceTimeZone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const availableTimesFor = (date) => {
  const key = dateKey(date);
  if (unavailableDates.has(key)) return [];
  const config = currentConfig();
  const option = currentOption();
  const slots = scheduleWindowsFor(date, config).flatMap((window) =>
    generateSlots(window.start, window.end, option.duration)
  );
  return slots.filter((time) => isBookableSlot(key, time));
};

const updateBookingCopy = () => {
  const config = currentConfig();
  if (bookingTitle) bookingTitle.textContent = config.heading;
  if (bookingSummary) bookingSummary.textContent = config.summary;
  if (submitButton) submitButton.textContent = config.submitLabel;
  if (subjectInput) subjectInput.value = config.subject;
  if (autoresponseInput) autoresponseInput.value = config.autoresponse || "";
  if (automationKeyInput) automationKeyInput.value = config.automationKey || "";
  if (sessionOptionField) sessionOptionField.hidden = !config.showSessionOptions;
  if (sessionOptionSelect) sessionOptionSelect.disabled = !config.showSessionOptions;
  if (coachingApplication) coachingApplication.hidden = !config.showApplication;
};

const populateSessionOptions = () => {
  if (!sessionOptionSelect) return;
  const config = currentConfig();
  const previousValue = sessionOptionSelect.value;
  sessionOptionSelect.innerHTML = "";
  config.options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    sessionOptionSelect.append(optionElement);
  });
  const stillValid = config.options.some((option) => option.value === previousValue);
  sessionOptionSelect.value = stillValid ? previousValue : config.options[0].value;
};

const updateHiddenFields = () => {
  if (selectedDateInput) selectedDateInput.value = selectedDate ? prettyDate(selectedDate) : "";
  if (selectedTimeInput) selectedTimeInput.value = selectedTime ? `${selectedTime} CT (${currentOption().value})` : "";
  if (calendarLinkInput) calendarLinkInput.value = buildCalendarLink();
  if (automationKeyInput) automationKeyInput.value = currentConfig().automationKey || "";
  if (nextInput) {
    const thankYouUrl = new URL("thank-you.html", window.location.href);
    nextInput.value = thankYouUrl.href;
  }
};

const renderTimes = () => {
  if (!timeList || !timeTitle) return;
  timeList.innerHTML = "";
  if (!selectedDate) {
    timeTitle.textContent = "Available Times";
    const empty = document.createElement("p");
    empty.className = "form-note";
    empty.textContent = "No availability";
    timeList.append(empty);
    return;
  }

  const date = new Date(`${selectedDate}T12:00:00`);
  const times = availableTimesFor(date);
  timeTitle.textContent = `Available Times for ${prettyDate(selectedDate)}`;
  if (selectedTime && !times.includes(selectedTime)) {
    selectedTime = times[0] || "";
    updateHiddenFields();
  }
  if (!times.length) {
    const empty = document.createElement("p");
    empty.className = "form-note";
    empty.textContent = "No availability";
    timeList.append(empty);
    return;
  }
  times.forEach((time) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `time-option${time === selectedTime ? " is-selected" : ""}`;
    button.textContent = `${time} CT`;
    button.addEventListener("click", () => {
      selectedTime = time;
      updateHiddenFields();
      renderTimes();
    });
    timeList.append(button);
  });
};

const renderCalendar = () => {
  if (!calendarGrid || !calendarTitle) return;
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  calendarTitle.textContent = first.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  calendarGrid.innerHTML = "";

  for (let i = 0; i < first.getDay(); i += 1) {
    const spacer = document.createElement("span");
    spacer.className = "calendar-day is-empty";
    calendarGrid.append(spacer);
  }

  for (let day = 1; day <= last.getDate(); day += 1) {
    const date = new Date(year, month, day);
    const key = dateKey(date);
    const times = availableTimesFor(date);
    const unavailable = !times.length;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `calendar-day${unavailable ? " is-unavailable" : ""}${key === selectedDate ? " is-selected" : ""}`;
    button.textContent = String(day);
    button.disabled = unavailable;
    button.addEventListener("click", () => {
      selectedDate = key;
      selectedTime = times[0] || "";
      updateHiddenFields();
      renderCalendar();
      renderTimes();
    });
    calendarGrid.append(button);
  }
};

const selectFirstAvailable = () => {
  const search = new Date();
  for (let i = 0; i < 45; i += 1) {
    const candidate = new Date(search);
    candidate.setDate(search.getDate() + i);
    const times = availableTimesFor(candidate);
    if (times.length) {
      selectedDate = dateKey(candidate);
      selectedTime = times[0];
      visibleMonth = new Date(candidate.getFullYear(), candidate.getMonth(), 1);
      updateHiddenFields();
      return;
    }
  }
  selectedDate = "";
  selectedTime = "";
  visibleMonth = new Date();
  updateHiddenFields();
};

const resetSelectionToFirstAvailable = () => {
  selectedDate = "";
  selectedTime = "";
  selectFirstAvailable();
  updateHiddenFields();
  renderCalendar();
  renderTimes();
};

const refreshBooking = () => {
  populateSessionOptions();
  updateBookingCopy();
  if (bookingStatus) bookingStatus.textContent = "";
  resetSelectionToFirstAvailable();
};

const serviceLeadMessage = () =>
  currentConfig().leadHours
    ? `Select an available date and time at least ${currentConfig().leadHours} hours out.`
    : "Select an available date and time from the service schedule.";

prevButton?.addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  renderCalendar();
});

nextButton?.addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  renderCalendar();
});

serviceSelect?.addEventListener("change", refreshBooking);

sessionOptionSelect?.addEventListener("change", resetSelectionToFirstAvailable);

serviceTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const service = trigger.getAttribute("data-book-service");
    if (serviceSelect && service && serviceConfigs[service]) {
      serviceSelect.value = service;
      refreshBooking();
    }
  });
});

bookingForm?.addEventListener("submit", (event) => {
  updateHiddenFields();
  const selectedDateObject = selectedDate ? new Date(`${selectedDate}T12:00:00`) : null;
  const slotStillAvailable = selectedDateObject ? availableTimesFor(selectedDateObject).includes(selectedTime) : false;
  const calendarLink = buildCalendarLink();
  if (!selectedDate || !selectedTime || !calendarLink || !slotStillAvailable) {
    event.preventDefault();
    if (bookingStatus) bookingStatus.textContent = serviceLeadMessage();
    return;
  }
  window.open(calendarLink, "_blank", "noopener");
});

if (calendarGrid) {
  refreshBooking();
}

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
