import { resend } from "./resend";

export async function sendWelcomeEmail(
  email: string,
  name: string
) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Welcome to Synibe 🎉",
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thanks for joining Synibe.</p>
      <p>Create rooms, sync videos, and watch together.</p>
    `,
  });
}