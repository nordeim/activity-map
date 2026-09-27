import { redirect } from "next/navigation";

// Session-25: the live's legal route is /accessibility-statement (its old
// /accessibility 404s). The clone keeps this permanent redirect so inbound
// links shipped since session 2 survive the rename.
export default function LegacyAccessibilityPage() {
  redirect("/accessibility-statement");
}
