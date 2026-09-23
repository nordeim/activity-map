// Extract a structured inventory of the home page (or any page) for parity comparison.
// Usage: agent-browser eval "$(cat /home/z/my-project/scripts/extract_home.js)"
(() => {
  const out = { sections: [] };
  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
  const style = (el, props) => {
    const cs = getComputedStyle(el);
    const o = {};
    props.forEach((p) => (o[p] = cs[p]));
    return o;
  };
  // Top-level landmarks: navbar, hero, category cards, route, restaurants, stays, sights, footer
  const navbar = document.querySelector("nav");
  if (navbar) {
    out.navbar = {
      cls: clean(navbar.className).slice(0, 120),
      font: style(navbar.querySelector("a") || navbar, ["fontFamily", "fontSize", "fontWeight"]),
      containerCls: clean(navbar.parentElement?.className).slice(0, 120),
      height: navbar.getBoundingClientRect().height,
    };
  }
  const h1 = document.querySelector("h1");
  if (h1) {
    out.h1 = { text: clean(h1.textContent), style: style(h1, ["fontFamily", "fontSize", "fontWeight", "letterSpacing", "color"]) };
  }
  // every h2 section heading in order
  document.querySelectorAll("h2").forEach((h) => {
    out.sections.push({
      text: clean(h.textContent).slice(0, 70),
      font: style(h, ["fontFamily", "fontSize", "fontWeight", "letterSpacing", "color"]),
      parentBg: style(h.closest("section,div"), ["backgroundColor"]).backgroundColor,
    });
  });
  // category cards
  const hotel = [...document.querySelectorAll("span,div,h2,h3,p")].find((e) => e.children.length === 0 && /^12 Hotels$/.test(clean(e.textContent)));
  if (hotel) {
    let card = hotel;
    while (card && card.parentElement) {
      card = card.parentElement;
      if (card.textContent.includes("Design hotels") && card.querySelector("a")) break;
    }
    out.categoryCard = {
      headingFont: style(hotel, ["fontFamily", "fontSize", "fontWeight"]),
      cardStyle: style(card, ["backgroundColor", "borderRadius", "boxShadow", "backdropFilter", "padding"]),
      viewAll: style(card.querySelector("a"), ["backgroundColor", "color", "height", "fontSize", "fontWeight", "borderRadius"]),
    };
  }
  // planner pill
  const pill = document.querySelector(".trip-planner-card, form[aria-label='Trip planner']");
  if (pill) {
    out.planner = {
      cls: clean(pill.className).slice(0, 140),
      width: pill.getBoundingClientRect().width,
      style: style(pill, ["backgroundColor", "borderRadius", "backdropFilter"]),
      segments: [...pill.querySelectorAll("p")].filter((p) => clean(p.textContent).length < 30).map((p) => clean(p.textContent)).slice(0, 8),
    };
  }
  // route stops
  const stopH = [...document.querySelectorAll("h3,h4")].find((e) => clean(e.textContent) === "Morning Coffee");
  if (stopH) {
    out.routeStop = {
      headingFont: style(stopH, ["fontFamily", "fontSize", "fontWeight"]),
      metaSample: [...stopH.closest("a,article,div").querySelectorAll("span")].slice(0, 10).map((s) => ({ t: clean(s.textContent).slice(0, 24), font: style(s, ["fontFamily", "fontSize"]) })).filter((x) => x.t),
    };
  }
  // stay showcase card
  const stayH = [...document.querySelectorAll("h3,h4")].find((e) => clean(e.textContent) === "Courtyard Stay");
  if (stayH) {
    out.stayCard = { headingFont: style(stayH, ["fontFamily", "fontSize", "fontWeight"]) };
  }
  // sights card
  const sightH = [...document.querySelectorAll("h3,h4")].find((e) => clean(e.textContent) === "Fuggerei");
  if (sightH) {
    out.sightCard = { headingFont: style(sightH, ["fontFamily", "fontSize", "fontWeight"]) };
  }
  // footer
  const footer = document.querySelector("footer");
  if (footer) {
    out.footer = {
      text: clean(footer.textContent).slice(0, 160),
      bg: style(footer, ["backgroundColor", "color"]),
    };
  }
  out.bodyBg = style(document.body, ["backgroundColor"]).backgroundColor;
  return JSON.stringify(out, null, 1);
})()
