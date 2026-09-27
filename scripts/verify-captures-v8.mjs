// VLM verification of the session-27 screenshot captures (backend only).
import ZAI from "z-ai-web-dev-sdk";
import fs from "node:fs";

const SHOTS = [
  ["docs/screenshots/30-desktop-route-stop-chrome.png", "a route stop card at desktop width: at the top a small white rounded time pill containing a coffee cup icon and the text '9:00 AM', below it a large serif heading 'Morning Coffee', then a white rounded bordered card with the place name 'Specialty Coffee Bar', a meta line starting with a small map-pin icon, a description, and a dark rounded 'Learn More' button"],
  ["docs/screenshots/31-mobile-route-stop-chrome.png", "the same route stop card at phone width: time pill with coffee icon, big serif 'Morning Coffee' title, white rounded card with map-pin meta line and dark Learn More button"],
  ["docs/screenshots/32-mobile-login-fields.png", "a login card on a phone: a circular logo, a welcome heading, a 'Continue with Google' button, email and password fields each with an icon inside, a dark 'Sign in' button, and a bottom row with 'Forgot password?' on the left and 'Need an account? Sign up' on the right"],
];

const zai = await ZAI.create();
for (const [path, expect] of SHOTS) {
  const b64 = fs.readFileSync(path).toString("base64");
  const res = await zai.chat.completions.createVision({
    model: "glm-4.6v",
    thinking: { type: "disabled" },
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: `Does this screenshot show ${expect}? Answer with YES or NO first, then one short sentence describing what you actually see.` },
          { type: "image_url", image_url: { url: `data:image/png;base64,${b64}` } },
        ],
      },
    ],
  });
  console.log(`== ${path}\n${res.choices[0]?.message?.content?.trim()}\n`);
}
