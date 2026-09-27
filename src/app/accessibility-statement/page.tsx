import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = { title: { absolute: "Accessibility Statement | Activity Map" } };

// The live's verbatim accessibility body (session-25 re-measure).
export default function AccessibilityStatementPage() {
  return (
    <LegalPage title="Accessibility Statement">
      <p>
        Roam aims to provide a clear, readable, and navigable experience across
        devices, including responsive layouts, readable contrast, and
        keyboard-friendly links.
      </p>
      <p>
        We continue improving accessibility as the product evolves and welcome
        feedback about barriers that make planning, browsing, or booking harder
        to use.
      </p>
      <p>
        If you experience an accessibility issue, please contact us through the
        app with the page, device, and description of the problem.
      </p>
    </LegalPage>
  );
}
