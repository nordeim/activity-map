import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = { title: { absolute: "Privacy Policy | Activity Map" } };

// The live's verbatim privacy body (session-25 re-measure) — three short
// paragraphs describing the hosted Roam service's data usage.
export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        Roam uses account, booking, preference, and trip details to provide
        recommendations, reservations, itinerary planning, and local discovery
        features.
      </p>
      <p>
        We only use personal information to operate the service, improve the
        experience, communicate important updates, and keep bookings and trip
        activity organized.
      </p>
      <p>
        You can contact Roam through the app experience to request access,
        correction, or deletion of information connected to your account, where
        applicable.
      </p>
    </LegalPage>
  );
}
