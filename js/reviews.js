/* Shared client reviews. No email transport and no browser-local review wall. */
(() => {
  "use strict";
  const form = document.querySelector("[data-review-form]");
  const dialog = document.querySelector("[data-review-dialog]");
  if (!form || !dialog) return;
  const list = document.querySelector("[data-review-list]");
  const status = document.querySelector("[data-review-status]");
  const wallStatus = document.querySelector("[data-review-wall-status]");
  const submit = document.querySelector("[data-review-submit]");
  const successLink = document.querySelector("[data-review-success-link]");
  const more = document.querySelector("[data-review-more]");
  const refresh = document.querySelector("[data-review-refresh]");
  const ratingInput = document.querySelector("[data-review-rating-input]");
  const selectedRating = document.querySelector("[data-review-selected-rating]");
  const stars = [...document.querySelectorAll("[data-review-rating-button]")];
  const incentive = window.BOWReviewIncentive;
  const reviews = new Map();
  let nextCursor = null;
  let pending = null;
  let saving = false;
  let loading = false;
  let automaticRefreshPaused = false;
  let opener = null;
  const endpoint = validEndpoint(window.BOW_REVIEW_CONFIG?.endpoint);
  const services = ["1:1 Coaching", "In-Person Training", "Pretzeling", "Massage", "Chair Massage", "General experience"];
  const offlineMessage = "Online review submission is being connected. Please try again later.";

  function validEndpoint(value) {
    if (typeof value !== "string") return "";
    if (/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(value)) return value;
    // Development test endpoint can only be used from a local preview page.
    if (["127.0.0.1", "localhost"].includes(window.location.hostname) && /^http:\/\/127\.0\.0\.1:\d+\/reviews$/.test(value)) return value;
    return "";
  }
  function uuid() {
    return window.crypto.randomUUID();
  }
  function visitorId() {
    try {
      const old = window.localStorage.getItem("bow-review-visitor-v1");
      if (/^[0-9a-f-]{36}$/i.test(old || "")) return old;
      const id = uuid();
      window.localStorage.setItem("bow-review-visitor-v1", id);
      return id;
    } catch { return uuid(); }
  }
  const visitor = endpoint ? visitorId() : "";

  function jsonp(params) {
    return new Promise((resolve, reject) => {
      const callback = `bowReviews_${uuid().replaceAll("-", "")}`;
      const script = document.createElement("script");
      const url = new URL(endpoint);
      Object.entries({ ...params, callback, _: Date.now() }).forEach(([key, value]) => url.searchParams.set(key, value));
      let timer;
      const cleanup = () => {
        window.clearTimeout(timer);
        script.remove();
        // A late response must not execute an expired callback.
        window[callback] = () => {};
        window.setTimeout(() => { delete window[callback]; }, 60000);
      };
      window[callback] = (result) => {
        cleanup();
        if (result?.ok === true) resolve(result);
        else {
          const error = new Error(typeof result?.message === "string" ? result.message : "Review service unavailable");
          error.code = typeof result?.code === "string" ? result.code : "";
          reject(error);
        }
      };
      script.onerror = () => { cleanup(); reject(new Error("Review service unavailable")); };
      timer = window.setTimeout(() => { cleanup(); reject(new Error("Review service timed out")); }, 7000);
      script.src = url.href;
      script.referrerPolicy = "no-referrer";
      document.head.append(script);
    });
  }
  function validReview(review) {
    return review && typeof review.id === "string" && /^[0-9a-f-]{36}$/i.test(review.id) &&
      Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5 &&
      typeof review.name === "string" && review.name.length > 0 && review.name.length <= 50 &&
      typeof review.text === "string" && review.text.length > 0 && review.text.length <= 2000 &&
      services.includes(review.service) && typeof review.createdAt === "string" && Number.isFinite(Date.parse(review.createdAt));
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function render() {
    if (!list) return;
    const cards = [...reviews.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id)).map((review) => {
      const card = element("article", "testimonial-card submitted-testimonial-card");
      const rating = element("div", "testimonial-rating");
      rating.setAttribute("aria-label", `${review.rating} out of 5 stars`);
      const symbols = element("span", "", "★".repeat(review.rating));
      symbols.setAttribute("aria-hidden", "true");
      rating.append(symbols, element("small", "", review.rating.toFixed(1)));
      const byline = element("div");
      byline.append(element("strong", "", review.name), element("span", "", `${review.service} / Site review`));
      const displayed = incentive ? incentive.decode(review.text) : { text: review.text, disclosure: "" };
      card.append(rating, element("p", "", `“${displayed.text}”`), byline);
      if (displayed.disclosure) card.append(element("p", "review-incentive-disclosure", displayed.disclosure));
      return card;
    });
    list.replaceChildren(...cards);
    list.hidden = cards.length === 0;
  }
  async function loadReviews(append = false) {
    if (!endpoint || !list || loading) return;
    loading = true;
    refresh.disabled = true;
    more.disabled = true;
    try {
      const result = await jsonp({ action: "list", ...(append && nextCursor ? { cursor: nextCursor } : {}) });
      if (!Array.isArray(result.reviews) || !result.reviews.every(validReview)) throw new Error("Invalid review response");
      // First-page refresh replaces the current page. More reviews remain available via pagination.
      if (!append) reviews.clear();
      result.reviews.forEach((review) => reviews.set(review.id, review));
      nextCursor = typeof result.nextCursor === "string" ? result.nextCursor : null;
      render();
      wallStatus.textContent = automaticRefreshPaused ? "Showing older website reviews. Refresh to see the latest." : "Website reviews refresh automatically. Featured client reviews appear below.";
      more.hidden = !nextCursor;
    } catch {
      wallStatus.textContent = "Live reviews are temporarily unavailable. Featured reviews remain below. You can try refreshing.";
    } finally {
      loading = false;
      refresh.disabled = false;
      more.disabled = false;
    }
  }
  function setRating(value) {
    const rating = Math.max(1, Math.min(5, Number(value) || 5));
    ratingInput.value = String(rating);
    selectedRating.textContent = String(rating);
    stars.forEach((button) => {
      const n = Number(button.getAttribute("data-review-rating-button"));
      button.classList.toggle("is-active", n <= rating);
      button.setAttribute("aria-pressed", String(n === rating));
    });
  }
  function busy(value) {
    saving = value;
    submit.disabled = value || !endpoint;
    form.setAttribute("aria-busy", String(value));
    submit.textContent = value ? "Publishing…" : "Publish Review";
    [...form.elements].forEach((field) => {
      if (field !== submit && !field.matches("[data-review-close]")) field.disabled = value;
    });
  }
  function closeDialog() {
    dialog.close();
    opener?.focus();
  }
  document.querySelectorAll("[data-review-open]").forEach((button) => button.addEventListener("click", () => {
    opener = button;
    if (!saving && !pending) {
      setRating(button.getAttribute("data-review-rating") || 5);
      status.textContent = endpoint ? "" : offlineMessage;
    }
    if (!dialog.open) dialog.showModal();
    if (saving) document.querySelector("[data-review-close]").focus();
    else form.elements.name.focus();
  }));
  stars.forEach((button) => button.addEventListener("click", () => setRating(button.getAttribute("data-review-rating-button"))));
  document.querySelector("[data-review-close]").addEventListener("click", closeDialog);
  dialog.addEventListener("close", () => opener?.focus());
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (saving) return;
    if (!endpoint) { status.textContent = offlineMessage; return; }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      service: String(data.get("service") || ""),
      review: String(data.get("review") || "").trim(),
      rating: Number(data.get("rating")),
    };
    if (!payload.name || !payload.review || payload.name.length > 50 || payload.review.length > 2000 || !services.includes(payload.service) || !Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5 || data.get("website")) {
      status.textContent = "Please enter a name, a review, and a rating from 1 to 5.";
      return;
    }
    if (incentive) {
      if (payload.review.length > incentive.maxTextLength) { status.textContent = "Please keep your review to 1,800 characters."; return; }
      payload.review = incentive.encode(payload.review);
    }
    const fingerprint = JSON.stringify(payload);
    if (!pending || pending.fingerprint !== fingerprint) pending = { id: uuid(), fingerprint };
    const id = pending.id;
    busy(true);
    successLink.hidden = true;
    status.textContent = "Publishing your review…";
    try {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 12000);
      try {
        await window.fetch(endpoint, {
          method: "POST", mode: "no-cors", credentials: "omit", referrerPolicy: "no-referrer",
          body: new URLSearchParams({ ...payload, id, visitorId: visitor, website: "", consent: "true" }), signal: controller.signal,
        });
      } catch { /* A network failure may follow a successful write. Always verify the stored record. */ }
      finally { window.clearTimeout(timer); }
      let confirmed = null;
      for (let attempt = 0; attempt < 8; attempt += 1) {
        try {
          const result = await jsonp({ action: "find", id });
          const review = result.review;
          if (validReview(review) && review.id === id && review.name === payload.name && review.service === payload.service && review.text === payload.review && review.rating === payload.rating) {
            confirmed = review;
            break;
          }
        } catch (error) { if (error.code) throw error; /* Retry transient read failures only. */ }
        await new Promise((resolve) => window.setTimeout(resolve, 1500));
      }
      if (!confirmed) throw new Error("Unconfirmed submission");
      reviews.set(confirmed.id, confirmed);
      render();
      pending = null;
      form.reset();
      setRating(5);
      status.textContent = "Thank you. Your review is published on the website.";
      successLink.hidden = false;
    } catch (error) {
      status.textContent = error.code ? error.message : "We could not confirm publication. Your text is still here. Retry to check or send the same review.";
    } finally { busy(false); }
  });
  refresh?.addEventListener("click", () => {
    automaticRefreshPaused = false;
    loadReviews();
  });
  more?.addEventListener("click", () => {
    automaticRefreshPaused = true;
    loadReviews(true);
  });
  setRating(5);
  submit.disabled = !endpoint;
  if (endpoint) {
    status.textContent = "";
    if (refresh) refresh.hidden = false;
    loadReviews();
    if (list) window.setInterval(() => { if (document.visibilityState === "visible" && !saving && !automaticRefreshPaused) loadReviews(); }, 60000);
  } else if (wallStatus) {
    wallStatus.textContent = "Featured client reviews. Online review submission is being connected.";
  }
})();
