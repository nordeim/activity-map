import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="September 2026">
      <p>
        ROAM is a self-hosted city guide. The application runs entirely on your own
        infrastructure: the pages you browse, the places you save, and the bookings you
        create are stored in the application&apos;s own SQLite database and are never
        transmitted to a third-party analytics or advertising service.
      </p>
      <p>
        The only account data held is the email address, display name, and a salted
        scrypt hash of your password. Session cookies carry a signed, non-sensitive
        summary of that account, expire after seven days, and are marked
        <span className="font-medium text-ink"> httpOnly</span> and
        <span className="font-medium text-ink"> SameSite=Lax</span> so they are not
        readable from JavaScript or sent on cross-site requests.
      </p>
      <p>
        Place photography is served from the reference app&apos;s public media CDN and
        map tiles from CARTO&apos;s public basemap; loading those images reveals your IP
        address to those CDNs under their respective policies, but no account data is
        attached to such requests.
      </p>
      <p>
        To have your account and every favourite or booking removed, delete the
        database file or contact the operator of your deployment — there is no
        external processor to involve.
      </p>
    </LegalPage>
  );
}
