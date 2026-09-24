// Inspect live app mobile nav links at 390px
const data = JSON.stringify({
  navCount: document.querySelectorAll("header nav").length,
  links: Array.from(document.querySelectorAll("header nav a, header nav button")).map((a) => {
    const r = a.getBoundingClientRect();
    return {
      text: (a.innerText || a.getAttribute("aria-label") || "").trim().slice(0, 20),
      x: Math.round(r.x),
      w: Math.round(r.width),
      h: Math.round(r.height),
      color: getComputedStyle(a).color,
      weight: getComputedStyle(a).fontWeight,
      font: getComputedStyle(a).fontFamily.slice(0, 40),
    };
  }),
});
data;
