export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.SENTRY_DSN) {
    // Sentry package can be added later without changing call sites.
    console.info("Monitoring configured. Install @sentry/nextjs to send events to Sentry.");
  }
}
