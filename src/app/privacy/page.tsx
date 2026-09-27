import { redirect } from "next/navigation";

// Session-25: the live's legal route is /privacy-policy (its old /privacy
// 404s). The clone keeps this permanent redirect so inbound links shipped
// since session 2 survive the rename.
export default function LegacyPrivacyPage() {
  redirect("/privacy-policy");
}
