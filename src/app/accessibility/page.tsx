import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = { title: "Accessibility Statement" };

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility Statement" updated="September 2026">
      <p>
        ROAM aims to meet WCAG 2.1 level AA across the guide. Text and interface
        colours are tuned for at least 4.5:1 contrast on body text; every interactive
        control is reachable and operable by keyboard with a visible focus ring; and
        all imagery carries alternative text or is marked decorative.
      </p>
      <p>
        The map view is keyboard-navigable via Leaflet&apos;s built-in controls and
        every marker exposes its place name to assistive technology. Animations
        respect the <span className="font-medium text-ink">prefers-reduced-motion</span>{" "}
        setting, and the mobile navigation bar keeps a horizontal-scroll safety valve
        so links can never be clipped or covered at narrow widths.
      </p>
      <p>
        If you hit a barrier — a control that traps focus, a contrast failure, or a
        screen-reader announcement that misleads — please report it to the operator of
        your deployment so it can be fixed at the source, in this repository.
      </p>
    </LegalPage>
  );
}
