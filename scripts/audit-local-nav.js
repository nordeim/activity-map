// Audit local mobile nav at 390px — mirror of the live-app probe
const out = JSON.stringify({
  headers: Array.from(document.querySelectorAll("header")).map((h) => {
    const r = h.getBoundingClientRect();
    return { cls: h.className.slice(0, 40), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  }),
  navLinks: Array.from(document.querySelectorAll('nav[aria-label="Primary"] a')).map((a) => {
    const r = a.getBoundingClientRect();
    const cs = getComputedStyle(a);
    return {
      text: (a.innerText || a.getAttribute("aria-label") || "").trim().slice(0, 14),
      x: Math.round(r.x),
      w: Math.round(r.width),
      h: Math.round(r.height),
      weight: cs.fontWeight,
      color: cs.color,
      font: cs.fontFamily.split(",")[0],
    };
  }),
});
out;
