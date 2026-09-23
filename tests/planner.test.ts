import { describe, expect, it } from "vitest";

import {
  formatPlannerDate,
  plannerDateLabel,
  plannerIsReady,
  plannerRoute,
  plannerSearchUrl,
} from "@/lib/planner";

// The planner seam measured from the live app (session 3): the search
// button routes to the CATEGORY page (never the map) with people/start_date/
// end_date params, and the dates segment renders the DD/MM/YYYY range label.

describe("plannerRoute", () => {
  it("maps the three activity types to their browse routes", () => {
    expect(plannerRoute("Restaurants")).toBe("/eat");
    expect(plannerRoute("Hotels")).toBe("/stay");
    expect(plannerRoute("Attractions")).toBe("/do");
  });
});

describe("formatPlannerDate", () => {
  it("renders ISO dates as DD/MM/YYYY", () => {
    expect(formatPlannerDate("2026-09-15")).toBe("15/09/2026");
    expect(formatPlannerDate("2026-12-01")).toBe("01/12/2026");
  });
  it("passes non-ISO input through unchanged", () => {
    expect(formatPlannerDate(" Select dates ")).toBe(" Select dates ");
    expect(formatPlannerDate("")).toBe("");
  });
});

describe("plannerDateLabel", () => {
  it("shows Select dates at rest", () => {
    expect(plannerDateLabel(null, null)).toBe("Select dates");
    expect(plannerDateLabel("", "")).toBe("Select dates");
  });
  it("shows the single date when only from is chosen", () => {
    expect(plannerDateLabel("2026-09-15", null)).toBe("15/09/2026");
  });
  it("joins a full range with an em dash", () => {
    expect(plannerDateLabel("2026-09-15", "2026-09-18")).toBe("15/09/2026 — 18/09/2026");
  });
});

describe("plannerSearchUrl", () => {
  it("always carries people; dates only when present", () => {
    expect(plannerSearchUrl("Restaurants", 2)).toBe("/eat?people=2");
    expect(plannerSearchUrl("Hotels", 4)).toBe("/stay?people=4");
    expect(plannerSearchUrl("Attractions", 3)).toBe("/do?people=3");
  });
  it("appends start_date and end_date in order", () => {
    expect(plannerSearchUrl("Restaurants", 2, "2026-09-15", "2026-09-18")).toBe(
      "/eat?people=2&start_date=2026-09-15&end_date=2026-09-18",
    );
    expect(plannerSearchUrl("Restaurants", 2, "2026-09-15")).toBe(
      "/eat?people=2&start_date=2026-09-15",
    );
  });
});

describe("plannerIsReady", () => {
  it("is false at the pristine state", () => {
    expect(plannerIsReady(null, null, 2, "Restaurants")).toBe(false);
  });
  it("is true once any date is chosen or defaults deviate", () => {
    expect(plannerIsReady("2026-09-15", null)).toBe(true);
    expect(plannerIsReady(null, null, 4)).toBe(true);
    expect(plannerIsReady(null, null, 2, "Hotels")).toBe(true);
  });
});
