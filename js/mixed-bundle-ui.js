(() => {
  "use strict";
  const host = document.querySelector("[data-mixed-bundle]");
  const model = window.BOWMixedBundles;
  if (!host || !model) return;
  const fields = [...host.querySelectorAll("select")];
  fields.forEach(field => model.options.forEach(option => {
    const item = document.createElement("option"); item.value = option.id; item.textContent = option.label; field.append(item);
  }));
  const request = host.querySelector("[data-mixed-request]");
  const status = host.querySelector("[data-mixed-status]");
  function render() {
    const quote = model.calculate(fields.map(field => field.value));
    for (const key of ["standardCents", "savingsCents", "totalCents"]) host.querySelector('[data-mixed-total="' + key + '"]').textContent = quote ? model.money(quote[key]) : "—";
    request.hidden = !quote;
    if (quote) request.href = model.requestUrl(quote); else request.removeAttribute("href");
    status.textContent = quote ? "Your three-session pack is " + model.money(quote.totalCents) + " after the 25% saving. Request your secure checkout link below." : "Choose all three sessions to see your package total.";
  }
  fields.forEach(field => field.addEventListener("change", render)); render();
})();
